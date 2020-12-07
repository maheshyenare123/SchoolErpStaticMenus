// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AdmissionEnquiryActions, AdmissionEnquiryActionTypes } from '../_actions/admission-enquiry.actions';
// Models
import { EnquiryModel } from '../_models/enquiry.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AdmissionEnquirysState extends EntityState<EnquiryModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAdmissionEnquiryId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<EnquiryModel> = createEntityAdapter<EnquiryModel>();

export const initialAdmissionEnquirysState: AdmissionEnquirysState = adapter.getInitialState({
  admissionEnquiryForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAdmissionEnquiryId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function admissionEnquirysReducer(state = initialAdmissionEnquirysState, action: AdmissionEnquiryActions): AdmissionEnquirysState {
  switch (action.type) {
    case AdmissionEnquiryActionTypes.AdmissionEnquirysPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAdmissionEnquiryId: undefined
      };
    }
    case AdmissionEnquiryActionTypes.AdmissionEnquiryActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AdmissionEnquiryActionTypes.AdmissionEnquiryOnServerCreated:
      return {
        ...state
      };
    case AdmissionEnquiryActionTypes.AdmissionEnquiryCreated:
      return adapter.addOne(action.payload.enquiry, {
        ...state, lastCreatedAdmissionEnquiryId: action.payload.enquiry.id
      });
    case AdmissionEnquiryActionTypes.AdmissionEnquiryUpdated:
      return adapter.updateOne(action.payload.partialAdmissionEnquiry, state);
    // case AdmissionEnquiryActionTypes.AdmissionEnquirysStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAdmissionEnquirys: Update<EnquiryModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.enquirys.length; i++) {
    //     _partialAdmissionEnquirys.push({
    //       id: action.payload.enquirys[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAdmissionEnquirys, state);
    // }
    case AdmissionEnquiryActionTypes.OneAdmissionEnquiryDeleted:
      return adapter.removeOne(action.payload.id, state);
    case AdmissionEnquiryActionTypes.ManyAdmissionEnquirysDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AdmissionEnquiryActionTypes.AdmissionEnquirysPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AdmissionEnquiryActionTypes.AdmissionEnquirysPageLoaded: {
      return adapter.addMany(action.payload.enquirys, {
        ...initialAdmissionEnquirysState,
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

export const getAdmissionEnquiryState = createFeatureSelector<EnquiryModel>('admissionEnquirys');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
