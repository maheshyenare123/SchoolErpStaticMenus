// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StaffLeaveRequestActions, StaffLeaveRequestActionTypes } from '../_actions/staff-leave-request.actions';
// Models
import { StaffLeaveRequestModel } from '../_models/staff-leave-request.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StaffLeaveRequestsState extends EntityState<StaffLeaveRequestModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStaffLeaveRequestId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StaffLeaveRequestModel> = createEntityAdapter<StaffLeaveRequestModel>();

export const initialStaffLeaveRequestsState: StaffLeaveRequestsState = adapter.getInitialState({
  staffLeaveRequestForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStaffLeaveRequestId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function staffLeaveRequestsReducer(state = initialStaffLeaveRequestsState, action: StaffLeaveRequestActions): StaffLeaveRequestsState {
  switch (action.type) {
    case StaffLeaveRequestActionTypes.StaffLeaveRequestsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStaffLeaveRequestId: undefined
      };
    }
    case StaffLeaveRequestActionTypes.StaffLeaveRequestActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StaffLeaveRequestActionTypes.StaffLeaveRequestOnServerCreated:
      return {
        ...state
      };
    case StaffLeaveRequestActionTypes.StaffLeaveRequestCreated:
      return adapter.addOne(action.payload.staffLeaveRequest, {
        ...state, lastCreatedStaffLeaveRequestId: action.payload.staffLeaveRequest.id
      });
    case StaffLeaveRequestActionTypes.StaffLeaveRequestUpdated:
      return adapter.updateOne(action.payload.partialStaffLeaveRequest, state);
    // case StaffLeaveRequestActionTypes.StaffLeaveRequestsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStaffLeaveRequests: Update<StaffLeaveRequestModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.staffLeaveRequests.length; i++) {
    //     _partialStaffLeaveRequests.push({
    //       id: action.payload.staffLeaveRequests[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStaffLeaveRequests, state);
    // }
    case StaffLeaveRequestActionTypes.OneStaffLeaveRequestDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StaffLeaveRequestActionTypes.ManyStaffLeaveRequestsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StaffLeaveRequestActionTypes.StaffLeaveRequestsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StaffLeaveRequestActionTypes.StaffLeaveRequestsPageLoaded: {
      return adapter.addMany(action.payload.staffLeaveRequests, {
        ...initialStaffLeaveRequestsState,
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

export const getStaffLeaveRequestState = createFeatureSelector<StaffLeaveRequestModel>('staffLeaveRequests');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
