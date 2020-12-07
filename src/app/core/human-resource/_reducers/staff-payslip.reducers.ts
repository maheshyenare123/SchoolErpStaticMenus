// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StaffPayslipActions, StaffPayslipActionTypes } from '../_actions/staff-payslip.actions';
// Models
import { StaffPayslipModel } from '../_models/staff-payslip.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StaffPayslipsState extends EntityState<StaffPayslipModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStaffPayslipId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StaffPayslipModel> = createEntityAdapter<StaffPayslipModel>();

export const initialStaffPayslipsState: StaffPayslipsState = adapter.getInitialState({
  staffPayslipForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStaffPayslipId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function staffPayslipsReducer(state = initialStaffPayslipsState, action: StaffPayslipActions): StaffPayslipsState {
  switch (action.type) {
    case StaffPayslipActionTypes.StaffPayslipsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStaffPayslipId: undefined
      };
    }
    case StaffPayslipActionTypes.StaffPayslipActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StaffPayslipActionTypes.StaffPayslipOnServerCreated:
      return {
        ...state
      };
    case StaffPayslipActionTypes.StaffPayslipCreated:
      return adapter.addOne(action.payload.staffPayslip, {
        ...state, lastCreatedStaffPayslipId: action.payload.staffPayslip.id
      });
    case StaffPayslipActionTypes.StaffPayslipUpdated:
      return adapter.updateOne(action.payload.partialStaffPayslip, state);
    // case StaffPayslipActionTypes.StaffPayslipsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStaffPayslips: Update<StaffPayslipModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.staffPayslips.length; i++) {
    //     _partialStaffPayslips.push({
    //       id: action.payload.staffPayslips[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStaffPayslips, state);
    // }
    case StaffPayslipActionTypes.OneStaffPayslipDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StaffPayslipActionTypes.ManyStaffPayslipsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StaffPayslipActionTypes.StaffPayslipsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StaffPayslipActionTypes.StaffPayslipsPageLoaded: {
      return adapter.addMany(action.payload.staffPayslips, {
        ...initialStaffPayslipsState,
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

export const getStaffPayslipState = createFeatureSelector<StaffPayslipModel>('staffPayslips');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
