// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { VisitorPurposeActions, VisitorPurposeActionTypes } from '../_actions/visitor-purpose.actions';
// Models
import { VisitorPurposeModel } from '../_models/visitor-purpose.model';
import { QueryParamsModel } from '../../_base/crud';

export interface VisitorPurposesState extends EntityState<VisitorPurposeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedVisitorPurposeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<VisitorPurposeModel> = createEntityAdapter<VisitorPurposeModel>();

export const initialVisitorPurposesState: VisitorPurposesState = adapter.getInitialState({
  visitorPurposeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedVisitorPurposeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function visitorPurposesReducer(state = initialVisitorPurposesState, action: VisitorPurposeActions): VisitorPurposesState {
  switch (action.type) {
    case VisitorPurposeActionTypes.VisitorPurposesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedVisitorPurposeId: undefined
      };
    }
    case VisitorPurposeActionTypes.VisitorPurposeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case VisitorPurposeActionTypes.VisitorPurposeOnServerCreated:
      return {
        ...state
      };
    case VisitorPurposeActionTypes.VisitorPurposeCreated:
      return adapter.addOne(action.payload.visitorPurpose, {
        ...state, lastCreatedVisitorPurposeId: action.payload.visitorPurpose.id
      });
    case VisitorPurposeActionTypes.VisitorPurposeUpdated:
      return adapter.updateOne(action.payload.partialVisitorPurpose, state);
    // case VisitorPurposeActionTypes.VisitorPurposesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialVisitorPurposes: Update<VisitorPurposeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.visitorPurposes.length; i++) {
    //     _partialVisitorPurposes.push({
    //       id: action.payload.visitorPurposes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialVisitorPurposes, state);
    // }
    case VisitorPurposeActionTypes.OneVisitorPurposeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case VisitorPurposeActionTypes.ManyVisitorPurposesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case VisitorPurposeActionTypes.VisitorPurposesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case VisitorPurposeActionTypes.VisitorPurposesPageLoaded: {
      return adapter.addMany(action.payload.visitorPurposes, {
        ...initialVisitorPurposesState,
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

export const getVisitorPurposeState = createFeatureSelector<VisitorPurposeModel>('visitorPurposes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
