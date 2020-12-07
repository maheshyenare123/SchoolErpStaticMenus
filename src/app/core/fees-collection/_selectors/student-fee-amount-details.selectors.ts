// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentFeeAmountDetailssState } from '../_reducers/student-fee-amount-details.reducers';
import { StudentFeeAmountDetailsModel } from '../_models/student-fee-amount-details.model';

export const selectStudentFeeAmountDetailssState = createFeatureSelector<StudentFeeAmountDetailssState>('studentFeeAmountDetailss');

export const selectStudentFeeAmountDetailsById = (studentFeeAmountDetailsId: number) => createSelector(
    selectStudentFeeAmountDetailssState,
    studentFeeAmountDetailssState => studentFeeAmountDetailssState.entities[studentFeeAmountDetailsId]
);

export const selectStudentFeeAmountDetailssPageLoading = createSelector(
    selectStudentFeeAmountDetailssState,
    studentFeeAmountDetailssState => studentFeeAmountDetailssState.listLoading
);

export const selectStudentFeeAmountDetailssActionLoading = createSelector(
    selectStudentFeeAmountDetailssState,
    studentFeeAmountDetailssState => studentFeeAmountDetailssState.actionsloading
);

export const selectLastCreatedStudentFeeAmountDetailsId = createSelector(
    selectStudentFeeAmountDetailssState,
    studentFeeAmountDetailssState => studentFeeAmountDetailssState.lastCreatedStudentFeeAmountDetailsId
);

export const selectStudentFeeAmountDetailssShowInitWaitingMessage = createSelector(
    selectStudentFeeAmountDetailssState,
    studentFeeAmountDetailssState => studentFeeAmountDetailssState.showInitWaitingMessage
);

export const selectStudentFeeAmountDetailssInStore = createSelector(
    selectStudentFeeAmountDetailssState,
    studentFeeAmountDetailssState => {
      const items: StudentFeeAmountDetailsModel[] = [];
      each(studentFeeAmountDetailssState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentFeeAmountDetailsModel[] =
        httpExtension.sortArray(items, studentFeeAmountDetailssState.lastQuery.sortField, studentFeeAmountDetailssState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentFeeAmountDetailssState.totalCount, '');
    }
);
