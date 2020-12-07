// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AssignStudentFeediscountActions, AssignStudentFeediscountActionTypes } from '../_actions/assign-student-feediscount.actions';
// Models
import { AssignFeediscountStudentRequestDtoModel } from '../_models/assign-feediscount-student-request-dto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AssignStudentFeediscountssState extends EntityState<AssignFeediscountStudentRequestDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAssignStudentFeediscountsId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AssignFeediscountStudentRequestDtoModel> = createEntityAdapter<AssignFeediscountStudentRequestDtoModel>();

export const initialAssignStudentFeediscountssState: AssignStudentFeediscountssState = adapter.getInitialState({
  assignStudentFeediscountsForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAssignStudentFeediscountsId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function assignStudentFeediscountsReducer(state = initialAssignStudentFeediscountssState, action: AssignStudentFeediscountActions): AssignStudentFeediscountssState {
  switch (action.type) {
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAssignStudentFeediscountsId: undefined
      };
    }
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountOnServerCreated:
      return {
        ...state
      };
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountCreated:
      return adapter.addOne(action.payload.assignStudentFeediscount, {
        ...state, lastCreatedAssignStudentFeediscountsId: action.payload.assignStudentFeediscount.feeDiscountId
      });
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountUpdated:
      return adapter.updateOne(action.payload.partialAssignStudentFeediscount, state);
    // case AssignStudentFeediscountActionTypes.AssignStudentFeediscountssStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAssignStudentFeediscountss: Update<AssignFeediscountStudentRequestDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.assignStudentFeediscountss.length; i++) {
    //     _partialAssignStudentFeediscountss.push({
    //       id: action.payload.assignStudentFeediscountss[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAssignStudentFeediscountss, state);
    // }
    case AssignStudentFeediscountActionTypes.OneAssignStudentFeediscountDeleted:
      return adapter.removeOne(action.payload.id, state);
    case AssignStudentFeediscountActionTypes.ManyAssignStudentFeediscountsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageLoaded: {
      return adapter.addMany(action.payload.assignStudentFeediscounts, {
        ...initialAssignStudentFeediscountssState,
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

export const getAssignStudentFeediscountsState = createFeatureSelector<AssignFeediscountStudentRequestDtoModel>('assignStudentFeediscounts');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
