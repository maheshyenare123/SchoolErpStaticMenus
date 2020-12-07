// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ApproveLeaveActions, ApproveLeaveActionTypes } from '../_actions/approve-leave.actions';
// Models
import { ApproveLeaveDtoModel } from '../_models/approve-leave.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ApproveLeavesState extends EntityState<ApproveLeaveDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedApproveLeaveId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ApproveLeaveDtoModel> = createEntityAdapter<ApproveLeaveDtoModel>();

export const initialApproveLeavesState: ApproveLeavesState = adapter.getInitialState({
  approveLeaveForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedApproveLeaveId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function approveLeavesReducer(state = initialApproveLeavesState, action: ApproveLeaveActions): ApproveLeavesState {
  switch (action.type) {
    case ApproveLeaveActionTypes.ApproveLeavesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedApproveLeaveId: undefined
      };
    }
    case ApproveLeaveActionTypes.ApproveLeaveActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ApproveLeaveActionTypes.ApproveLeaveOnServerCreated:
      return {
        ...state
      };
    case ApproveLeaveActionTypes.ApproveLeaveCreated:
      return adapter.addOne(action.payload.approveLeave, {
        ...state, lastCreatedApproveLeaveId: action.payload.approveLeave.id
      });
    case ApproveLeaveActionTypes.ApproveLeaveUpdated:
      return adapter.updateOne(action.payload.partialApproveLeave, state);
    // case ApproveLeaveActionTypes.ApproveLeavesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialApproveLeaves: Update<ApproveLeaveDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.approveLeaves.length; i++) {
    //     _partialApproveLeaves.push({
    //       id: action.payload.approveLeaves[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialApproveLeaves, state);
    // }
    case ApproveLeaveActionTypes.OneApproveLeaveDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ApproveLeaveActionTypes.ManyApproveLeavesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ApproveLeaveActionTypes.ApproveLeavesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ApproveLeaveActionTypes.ApproveLeavesPageLoaded: {
      return adapter.addMany(action.payload.approveLeaves, {
        ...initialApproveLeavesState,
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

export const getApproveLeaveState = createFeatureSelector<ApproveLeaveDtoModel>('approveLeaves');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
