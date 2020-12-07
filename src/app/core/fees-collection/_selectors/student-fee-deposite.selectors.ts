// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentFeeDepositesState } from '../_reducers/student-fee-deposite.reducers';
import { StudentFeeDepositeModel } from '../_models/student-fee-deposite.model';

export const selectStudentFeeDepositesState = createFeatureSelector<StudentFeeDepositesState>('studentFeeDeposites');

export const selectStudentFeeDepositeById = (studentFeeDepositeId: number) => createSelector(
    selectStudentFeeDepositesState,
    studentFeeDepositesState => studentFeeDepositesState.entities[studentFeeDepositeId]
);

export const selectStudentFeeDepositesPageLoading = createSelector(
    selectStudentFeeDepositesState,
    studentFeeDepositesState => studentFeeDepositesState.listLoading
);

export const selectStudentFeeDepositesActionLoading = createSelector(
    selectStudentFeeDepositesState,
    studentFeeDepositesState => studentFeeDepositesState.actionsloading
);

export const selectLastCreatedStudentFeeDepositeId = createSelector(
    selectStudentFeeDepositesState,
    studentFeeDepositesState => studentFeeDepositesState.lastCreatedStudentFeeDepositeId
);

export const selectStudentFeeDepositesShowInitWaitingMessage = createSelector(
    selectStudentFeeDepositesState,
    studentFeeDepositesState => studentFeeDepositesState.showInitWaitingMessage
);

export const selectStudentFeeDepositesInStore = createSelector(
    selectStudentFeeDepositesState,
    studentFeeDepositesState => {
      const items: StudentFeeDepositeModel[] = [];
      each(studentFeeDepositesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentFeeDepositeModel[] =
        httpExtension.sortArray(items, studentFeeDepositesState.lastQuery.sortField, studentFeeDepositesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentFeeDepositesState.totalCount, '');
    }
);
