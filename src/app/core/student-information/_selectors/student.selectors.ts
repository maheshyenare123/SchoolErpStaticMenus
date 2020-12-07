// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentsState } from '../_reducers/student.reducers';
import { StudentDtoModel } from '../_models/studentDto.model';

export const selectStudentsState = createFeatureSelector<StudentsState>('students');

export const selectStudentById = (studentId: number) => createSelector(
    selectStudentsState,
    studentsState => studentsState.entities[studentId]
);

export const selectStudentsPageLoading = createSelector(
    selectStudentsState,
    studentsState => studentsState.listLoading
);

export const selectStudentsActionLoading = createSelector(
    selectStudentsState,
    studentsState => studentsState.actionsloading
);

export const selectLastCreatedStudentId = createSelector(
    selectStudentsState,
    studentsState => studentsState.lastCreatedStudentId
);

export const selectStudentsShowInitWaitingMessage = createSelector(
    selectStudentsState,
    studentsState => studentsState.showInitWaitingMessage
);

export const selectStudentsInStore = createSelector(
    selectStudentsState,
    studentsState => {
      const items: StudentDtoModel[] = [];
      each(studentsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentDtoModel[] =
        httpExtension.sortArray(items, studentsState.lastQuery.sortField, studentsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentsState.totalCount, '');
    }
);
