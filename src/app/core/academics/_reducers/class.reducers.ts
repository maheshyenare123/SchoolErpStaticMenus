// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ClassActions, ClassActionTypes } from '../_actions/class.actions';
// Models
import { ClassDtoModel } from '../_models/classDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ClasssState extends EntityState<ClassDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedClassId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ClassDtoModel> = createEntityAdapter<ClassDtoModel>();

export const initialClasssState: ClasssState = adapter.getInitialState({
  classForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedClassId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function classsReducer(state = initialClasssState, action: ClassActions): ClasssState {
  switch (action.type) {
    case ClassActionTypes.ClasssPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedClassId: undefined
      };
    }
    case ClassActionTypes.ClassActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ClassActionTypes.ClassOnServerCreated:
      return {
        ...state
      };
    case ClassActionTypes.ClassCreated:
      return adapter.addOne(action.payload.class, {
        ...state, lastCreatedClassId: action.payload.class.id
      });
    case ClassActionTypes.ClassUpdated:
      return adapter.updateOne(action.payload.partialClass, state);
    // case ClassActionTypes.ClasssStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialClasss: Update<ClassDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.classs.length; i++) {
    //     _partialClasss.push({
    //       id: action.payload.classs[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialClasss, state);
    // }
    case ClassActionTypes.OneClassDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ClassActionTypes.ManyClasssDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ClassActionTypes.ClasssPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ClassActionTypes.ClasssPageLoaded: {
      return adapter.addMany(action.payload.classs, {
        ...initialClasssState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    }
    default:
      return state;
  }
}

export const getClassState = createFeatureSelector<ClassDtoModel>('classs');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
