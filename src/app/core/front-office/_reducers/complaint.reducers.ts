// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ComplaintActions, ComplaintActionTypes } from '../_actions/complaint.actions';
// Models
import { ComplaintModel } from '../_models/complaint.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ComplaintsState extends EntityState<ComplaintModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedComplaintId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ComplaintModel> = createEntityAdapter<ComplaintModel>();

export const initialComplaintsState: ComplaintsState = adapter.getInitialState({
  complaintForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedComplaintId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function complaintsReducer(state = initialComplaintsState, action: ComplaintActions): ComplaintsState {
  switch (action.type) {
    case ComplaintActionTypes.ComplaintsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedComplaintId: undefined
      };
    }
    case ComplaintActionTypes.ComplaintActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ComplaintActionTypes.ComplaintOnServerCreated:
      return {
        ...state
      };
    case ComplaintActionTypes.ComplaintCreated:
      return adapter.addOne(action.payload.complaint, {
        ...state, lastCreatedComplaintId: action.payload.complaint.id
      });
    case ComplaintActionTypes.ComplaintUpdated:
      return adapter.updateOne(action.payload.partialComplaint, state);
    // case ComplaintActionTypes.ComplaintsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialComplaints: Update<ComplaintModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.complaints.length; i++) {
    //     _partialComplaints.push({
    //       id: action.payload.complaints[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialComplaints, state);
    // }
    case ComplaintActionTypes.OneComplaintDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ComplaintActionTypes.ManyComplaintsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ComplaintActionTypes.ComplaintsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ComplaintActionTypes.ComplaintsPageLoaded: {
      return adapter.addMany(action.payload.complaints, {
        ...initialComplaintsState,
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

export const getComplaintState = createFeatureSelector<ComplaintModel>('complaints');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
