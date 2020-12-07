// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { LeaveTypeActions, LeaveTypeActionTypes } from '../_actions/leave-type.actions';
// Models
import { LeaveTypeModel } from '../_models/leave-type.model';
import { QueryParamsModel } from '../../_base/crud';

export interface LeaveTypesState extends EntityState<LeaveTypeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedLeaveTypeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<LeaveTypeModel> = createEntityAdapter<LeaveTypeModel>();

export const initialLeaveTypesState: LeaveTypesState = adapter.getInitialState({
  leaveTypeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedLeaveTypeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function leaveTypesReducer(state = initialLeaveTypesState, action: LeaveTypeActions): LeaveTypesState {
  switch (action.type) {
    case LeaveTypeActionTypes.LeaveTypesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedLeaveTypeId: undefined
      };
    }
    case LeaveTypeActionTypes.LeaveTypeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case LeaveTypeActionTypes.LeaveTypeOnServerCreated:
      return {
        ...state
      };
    case LeaveTypeActionTypes.LeaveTypeCreated:
      return adapter.addOne(action.payload.leaveType, {
        ...state, lastCreatedLeaveTypeId: action.payload.leaveType.id
      });
    case LeaveTypeActionTypes.LeaveTypeUpdated:
      return adapter.updateOne(action.payload.partialLeaveType, state);
    // case LeaveTypeActionTypes.LeaveTypesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialLeaveTypes: Update<LeaveTypeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.leaveTypes.length; i++) {
    //     _partialLeaveTypes.push({
    //       id: action.payload.leaveTypes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialLeaveTypes, state);
    // }
    case LeaveTypeActionTypes.OneLeaveTypeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case LeaveTypeActionTypes.ManyLeaveTypesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case LeaveTypeActionTypes.LeaveTypesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case LeaveTypeActionTypes.LeaveTypesPageLoaded: {
      return adapter.addMany(action.payload.leaveTypes, {
        ...initialLeaveTypesState,
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

export const getLeaveTypeState = createFeatureSelector<LeaveTypeModel>('leaveTypes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
