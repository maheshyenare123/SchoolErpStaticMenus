// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StaffActions, StaffActionTypes } from '../_actions/staff.actions';
// Models
import { StaffModel } from '../_models/staff.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StaffsState extends EntityState<StaffModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStaffId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StaffModel> = createEntityAdapter<StaffModel>();

export const initialStaffsState: StaffsState = adapter.getInitialState({
  staffForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStaffId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function staffsReducer(state = initialStaffsState, action: StaffActions): StaffsState {
  switch (action.type) {
    case StaffActionTypes.StaffsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStaffId: undefined
      };
    }
    case StaffActionTypes.StaffActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StaffActionTypes.StaffOnServerCreated:
      return {
        ...state
      };
    case StaffActionTypes.StaffCreated:
      return adapter.addOne(action.payload.staff, {
        ...state, lastCreatedStaffId: action.payload.staff.id
      });
    case StaffActionTypes.StaffUpdated:
      return adapter.updateOne(action.payload.partialStaff, state);
    // case StaffActionTypes.StaffsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStaffs: Update<StaffModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.staffs.length; i++) {
    //     _partialStaffs.push({
    //       id: action.payload.staffs[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStaffs, state);
    // }
    case StaffActionTypes.OneStaffDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StaffActionTypes.ManyStaffsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StaffActionTypes.StaffsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StaffActionTypes.StaffsPageLoaded: {
      return adapter.addMany(action.payload.staffs, {
        ...initialStaffsState,
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

export const getStaffState = createFeatureSelector<StaffModel>('staffs');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
