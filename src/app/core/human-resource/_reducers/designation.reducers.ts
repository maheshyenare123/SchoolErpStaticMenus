// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StaffDesignationActions, StaffDesignationActionTypes } from '../_actions/designation.actions';
// Models
import { StaffDesignationModel } from '../_models/staff-designation.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StaffDesignationsState extends EntityState<StaffDesignationModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStaffDesignationId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StaffDesignationModel> = createEntityAdapter<StaffDesignationModel>();

export const initialStaffDesignationsState: StaffDesignationsState = adapter.getInitialState({
  staffDesignationForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStaffDesignationId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function staffDesignationsReducer(state = initialStaffDesignationsState, action: StaffDesignationActions): StaffDesignationsState {
  switch (action.type) {
    case StaffDesignationActionTypes.StaffDesignationsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStaffDesignationId: undefined
      };
    }
    case StaffDesignationActionTypes.StaffDesignationActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StaffDesignationActionTypes.StaffDesignationOnServerCreated:
      return {
        ...state
      };
    case StaffDesignationActionTypes.StaffDesignationCreated:
      return adapter.addOne(action.payload.staffDesignation, {
        ...state, lastCreatedStaffDesignationId: action.payload.staffDesignation.id
      });
    case StaffDesignationActionTypes.StaffDesignationUpdated:
      return adapter.updateOne(action.payload.partialStaffDesignation, state);
    // case StaffDesignationActionTypes.StaffDesignationsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStaffDesignations: Update<StaffDesignationModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.staffDesignations.length; i++) {
    //     _partialStaffDesignations.push({
    //       id: action.payload.staffDesignations[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStaffDesignations, state);
    // }
    case StaffDesignationActionTypes.OneStaffDesignationDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StaffDesignationActionTypes.ManyStaffDesignationsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StaffDesignationActionTypes.StaffDesignationsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StaffDesignationActionTypes.StaffDesignationsPageLoaded: {
      return adapter.addMany(action.payload.staffDesignations, {
        ...initialStaffDesignationsState,
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

export const getStaffDesignationState = createFeatureSelector<StaffDesignationModel>('staffDesignations');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
