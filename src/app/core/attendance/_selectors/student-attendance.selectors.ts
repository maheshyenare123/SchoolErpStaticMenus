// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentAttendencesState } from '../_reducers/student-attendance.reducers';
import { StudentAttendenceDtoModel } from '../_models/studentAttendenceDto.model';

export const selectStudentAttendencesState = createFeatureSelector<StudentAttendencesState>('studentAttendences');

export const selectStudentAttendenceById = (studentAttendenceId: number) => createSelector(
    selectStudentAttendencesState,
    studentAttendencesState => studentAttendencesState.entities[studentAttendenceId]
);

export const selectStudentAttendencesPageLoading = createSelector(
    selectStudentAttendencesState,
    studentAttendencesState => studentAttendencesState.listLoading
);

export const selectStudentAttendencesActionLoading = createSelector(
    selectStudentAttendencesState,
    studentAttendencesState => studentAttendencesState.actionsloading
);

export const selectLastCreatedStudentAttendenceId = createSelector(
    selectStudentAttendencesState,
    studentAttendencesState => studentAttendencesState.lastCreatedStudentAttendenceId
);

export const selectStudentAttendencesShowInitWaitingMessage = createSelector(
    selectStudentAttendencesState,
    studentAttendencesState => studentAttendencesState.showInitWaitingMessage
);

export const selectStudentAttendencesInStore = createSelector(
    selectStudentAttendencesState,
    studentAttendencesState => {
      const items: StudentAttendenceDtoModel[] = [];
      each(studentAttendencesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentAttendenceDtoModel[] =
        httpExtension.sortArray(items, studentAttendencesState.lastQuery.sortField, studentAttendencesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentAttendencesState.totalCount, '');
    }
);
