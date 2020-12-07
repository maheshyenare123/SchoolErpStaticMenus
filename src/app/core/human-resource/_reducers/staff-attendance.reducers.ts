// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StaffAttendanceActions, StaffAttendanceActionTypes } from '../_actions/staff-attendance.actions';
// Models
import { StaffAttendanceModel } from '../_models/staff-attendance.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StaffAttendancesState extends EntityState<StaffAttendanceModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStaffAttendanceId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StaffAttendanceModel> = createEntityAdapter<StaffAttendanceModel>();

export const initialStaffAttendancesState: StaffAttendancesState = adapter.getInitialState({
  staffAttendanceForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStaffAttendanceId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function staffAttendancesReducer(state = initialStaffAttendancesState, action: StaffAttendanceActions): StaffAttendancesState {
  switch (action.type) {
    case StaffAttendanceActionTypes.StaffAttendancesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStaffAttendanceId: undefined
      };
    }
    case StaffAttendanceActionTypes.StaffAttendanceActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StaffAttendanceActionTypes.StaffAttendanceOnServerCreated:
      return {
        ...state
      };
    case StaffAttendanceActionTypes.StaffAttendanceCreated:
      return adapter.addOne(action.payload.staffAttendance, {
        ...state, lastCreatedStaffAttendanceId: action.payload.staffAttendance.id
      });
    case StaffAttendanceActionTypes.StaffAttendanceUpdated:
      return adapter.updateOne(action.payload.partialStaffAttendance, state);
    // case StaffAttendanceActionTypes.StaffAttendancesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStaffAttendances: Update<StaffAttendanceModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.staffAttendances.length; i++) {
    //     _partialStaffAttendances.push({
    //       id: action.payload.staffAttendances[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStaffAttendances, state);
    // }
    case StaffAttendanceActionTypes.OneStaffAttendanceDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StaffAttendanceActionTypes.ManyStaffAttendancesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StaffAttendanceActionTypes.StaffAttendancesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StaffAttendanceActionTypes.StaffAttendancesPageLoaded: {
      return adapter.addMany(action.payload.staffAttendances, {
        ...initialStaffAttendancesState,
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

export const getStaffAttendanceState = createFeatureSelector<StaffAttendanceModel>('staffAttendances');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
