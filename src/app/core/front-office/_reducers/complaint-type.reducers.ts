// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ComplaintTypeActions, ComplaintTypeActionTypes } from '../_actions/complaint-type.actions';
// Models
import { ComplaintTypeModel } from '../_models/complaint-type.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ComplaintTypesState extends EntityState<ComplaintTypeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedComplaintTypeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ComplaintTypeModel> = createEntityAdapter<ComplaintTypeModel>();

export const initialComplaintTypesState: ComplaintTypesState = adapter.getInitialState({
  complaintTypeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedComplaintTypeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function complaintTypesReducer(state = initialComplaintTypesState, action: ComplaintTypeActions): ComplaintTypesState {
  switch (action.type) {
    case ComplaintTypeActionTypes.ComplaintTypesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedComplaintTypeId: undefined
      };
    }
    case ComplaintTypeActionTypes.ComplaintTypeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ComplaintTypeActionTypes.ComplaintTypeOnServerCreated:
      return {
        ...state
      };
    case ComplaintTypeActionTypes.ComplaintTypeCreated:
      return adapter.addOne(action.payload.complaintType, {
        ...state, lastCreatedComplaintTypeId: action.payload.complaintType.id
      });
    case ComplaintTypeActionTypes.ComplaintTypeUpdated:
      return adapter.updateOne(action.payload.partialComplaintType, state);
    // case ComplaintTypeActionTypes.ComplaintTypesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialComplaintTypes: Update<ComplainttTypeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.complaintTypes.length; i++) {
    //     _partialComplaintTypes.push({
    //       id: action.payload.complaintTypes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialComplaintTypes, state);
    // }
    case ComplaintTypeActionTypes.OneComplaintTypeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ComplaintTypeActionTypes.ManyComplaintTypesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ComplaintTypeActionTypes.ComplaintTypesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ComplaintTypeActionTypes.ComplaintTypesPageLoaded: {
      return adapter.addMany(action.payload.complaintTypes, {
        ...initialComplaintTypesState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    }

    case ComplaintTypeActionTypes.ComplaintTypeStoreUpdated:
      return adapter.updateOne(action.payload.complainType, state);

    default:
      return state;
  }
}

export const getComplaintTypeState = createFeatureSelector<ComplaintTypeModel>('complaintTypes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
