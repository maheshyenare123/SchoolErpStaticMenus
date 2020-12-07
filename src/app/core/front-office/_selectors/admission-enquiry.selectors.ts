// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AdmissionEnquirysState } from '../_reducers/admission-enquiry.reducers';
import { EnquiryModel } from '../_models/enquiry.model';

export const selectAdmissionEnquirysState = createFeatureSelector<AdmissionEnquirysState>('admissionEnquirys');

export const selectAdmissionEnquiryById = (admissionEnquiryId: number) => createSelector(
    selectAdmissionEnquirysState,
    admissionEnquirysState => admissionEnquirysState.entities[admissionEnquiryId]
);

export const selectAdmissionEnquirysPageLoading = createSelector(
    selectAdmissionEnquirysState,
    admissionEnquirysState => admissionEnquirysState.listLoading
);

export const selectAdmissionEnquirysActionLoading = createSelector(
    selectAdmissionEnquirysState,
    admissionEnquirysState => admissionEnquirysState.actionsloading
);

export const selectLastCreatedAdmissionEnquiryId = createSelector(
    selectAdmissionEnquirysState,
    admissionEnquirysState => admissionEnquirysState.lastCreatedAdmissionEnquiryId
);

export const selectAdmissionEnquirysShowInitWaitingMessage = createSelector(
    selectAdmissionEnquirysState,
    admissionEnquirysState => admissionEnquirysState.showInitWaitingMessage
);

export const selectAdmissionEnquirysInStore = createSelector(
    selectAdmissionEnquirysState,
    admissionEnquirysState => {
      const items: EnquiryModel[] = [];
      each(admissionEnquirysState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: EnquiryModel[] =
        httpExtension.sortArray(items, admissionEnquirysState.lastQuery.sortField, admissionEnquirysState.lastQuery.sortOrder);
      return new QueryResultsModel(result, admissionEnquirysState.totalCount, '');
    }
);
