// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentDetailsState } from '../_reducers/student-detail.reducers';
import { StudentDtoModel } from '../_models/studentDto.model';

export const selectStudentDetailsState = createFeatureSelector<StudentDetailsState>('studentDetails');

export const selectStudentDetailById = (studentDetailId: number) => createSelector(
    selectStudentDetailsState,
    studentDetailsState => studentDetailsState.entities[studentDetailId]
);

export const selectStudentDetailsPageLoading = createSelector(
    selectStudentDetailsState,
    studentDetailsState => studentDetailsState.listLoading
);

export const selectStudentDetailsActionLoading = createSelector(
    selectStudentDetailsState,
    studentDetailsState => studentDetailsState.actionsloading
);

export const selectLastCreatedStudentDetailId = createSelector(
    selectStudentDetailsState,
    studentDetailsState => studentDetailsState.lastCreatedStudentDetailId
);

export const selectStudentDetailsShowInitWaitingMessage = createSelector(
    selectStudentDetailsState,
    studentDetailsState => studentDetailsState.showInitWaitingMessage
);

export const selectStudentDetailsInStore = createSelector(
    selectStudentDetailsState,
    studentDetailsState => {
      const items: StudentDtoModel[] = [];
      each(studentDetailsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentDtoModel[] =
        httpExtension.sortArray(items, studentDetailsState.lastQuery.sortField, studentDetailsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentDetailsState.totalCount, '');
    }
);
