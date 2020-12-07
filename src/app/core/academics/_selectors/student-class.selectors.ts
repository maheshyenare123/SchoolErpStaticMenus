// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentClasssState } from '../_reducers/student-class.reducers';
import { StudentClassModel } from '../_models/student-class.model';

export const selectStudentClasssState = createFeatureSelector<StudentClasssState>('studentClasss');

export const selectStudentClassById = (studentClassId: number) => createSelector(
    selectStudentClasssState,
    studentClasssState => studentClasssState.entities[studentClassId]
);

export const selectStudentClasssPageLoading = createSelector(
    selectStudentClasssState,
    studentClasssState => studentClasssState.listLoading
);

export const selectStudentClasssActionLoading = createSelector(
    selectStudentClasssState,
    studentClasssState => studentClasssState.actionsloading
);

export const selectLastCreatedStudentClassId = createSelector(
    selectStudentClasssState,
    studentClasssState => studentClasssState.lastCreatedStudentClassId
);

export const selectStudentClasssShowInitWaitingMessage = createSelector(
    selectStudentClasssState,
    studentClasssState => studentClasssState.showInitWaitingMessage
);

export const selectStudentClasssInStore = createSelector(
    selectStudentClasssState,
    studentClasssState => {
      const items: StudentClassModel[] = [];
      each(studentClasssState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentClassModel[] =
        httpExtension.sortArray(items, studentClasssState.lastQuery.sortField, studentClasssState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentClasssState.totalCount, '');
    }
);
