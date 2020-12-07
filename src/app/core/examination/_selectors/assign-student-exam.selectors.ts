// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AssignStudentExamState } from '../_reducers/assign-student-exam.reducers';
import { AssignExamStudentRequestDtoModel } from '../_models/assign-exam-student-request-dto.model';

export const selectAssignStudentExamState = createFeatureSelector<AssignStudentExamState>('assignStudentExams');

export const selectAssignStudentExamById = (assignStudentExamId: number) => createSelector(
    selectAssignStudentExamState,
    assignStudentExamState => assignStudentExamState.entities[assignStudentExamId]
);

export const selectAssignStudentExamPageLoading = createSelector(
    selectAssignStudentExamState,
    assignStudentExamState => assignStudentExamState.listLoading
);

export const selectAssignStudentExamActionLoading = createSelector(
    selectAssignStudentExamState,
    assignStudentExamState => assignStudentExamState.actionsloading
);

export const selectLastCreatedAssignStudentExamId = createSelector(
    selectAssignStudentExamState,
    assignStudentExamState => assignStudentExamState.lastCreatedAssignStudentExamsId
);

export const selectAssignStudentExamShowInitWaitingMessage = createSelector(
    selectAssignStudentExamState,
    assignStudentExamState => assignStudentExamState.showInitWaitingMessage
);

export const selectAssignStudentExamInStore = createSelector(
    selectAssignStudentExamState,
    assignStudentExamState => {
      const items: AssignExamStudentRequestDtoModel[] = [];
      each(assignStudentExamState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: AssignExamStudentRequestDtoModel[] =
        httpExtension.sortArray(items, assignStudentExamState.lastQuery.sortField, assignStudentExamState.lastQuery.sortOrder);
      return new QueryResultsModel(result, assignStudentExamState.totalCount, '');
    }
);
