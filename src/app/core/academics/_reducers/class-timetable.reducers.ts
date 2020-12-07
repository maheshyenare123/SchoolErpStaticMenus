// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ClassTimetableActions, ClassTimetableActionTypes } from '../_actions/class-timetable.actions';
// Models
import { ClassTimetableModel } from '../_models/class-timetable.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ClassTimetablesState extends EntityState<ClassTimetableModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedClassTimetableId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ClassTimetableModel> = createEntityAdapter<ClassTimetableModel>();

export const initialClassTimetablesState: ClassTimetablesState = adapter.getInitialState({
  classTimetableForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedClassTimetableId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function classTimetablesReducer(state = initialClassTimetablesState, action: ClassTimetableActions): ClassTimetablesState {
  switch (action.type) {
    case ClassTimetableActionTypes.ClassTimetablesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedClassTimetableId: undefined
      };
    }
    case ClassTimetableActionTypes.ClassTimetableActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ClassTimetableActionTypes.ClassTimetableOnServerCreated:
      return {
        ...state
      };
    case ClassTimetableActionTypes.ClassTimetableCreated:
      return adapter.addOne(action.payload.classTimetable, {
        ...state, lastCreatedClassTimetableId: action.payload.classTimetable.id
      });
    case ClassTimetableActionTypes.ClassTimetableUpdated:
      return adapter.updateOne(action.payload.partialClassTimetable, state);
    // case ClassTimetableActionTypes.ClassTimetablesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialClassTimetables: Update<ClassTimetableModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.classTimetables.length; i++) {
    //     _partialClassTimetables.push({
    //       id: action.payload.classTimetables[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialClassTimetables, state);
    // }
    case ClassTimetableActionTypes.OneClassTimetableDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ClassTimetableActionTypes.ManyClassTimetablesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ClassTimetableActionTypes.ClassTimetablesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ClassTimetableActionTypes.ClassTimetablesPageLoaded: {
      return adapter.addMany(action.payload.classTimetables, {
        ...initialClassTimetablesState,
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

export const getClassTimetableState = createFeatureSelector<ClassTimetableModel>('classTimetables');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
