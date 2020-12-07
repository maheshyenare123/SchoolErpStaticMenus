// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ExamSubjectMarkssState } from '../_reducers/exam-subject-marks.reducers';
import { ExamSubjectMarksModel } from '../_models/exam-subject-marks.model';

export const selectExamSubjectMarkssState = createFeatureSelector<ExamSubjectMarkssState>('examSubjectMarkss');

export const selectExamSubjectMarksById = (examSubjectMarksId: number) => createSelector(
    selectExamSubjectMarkssState,
    examSubjectMarkssState => examSubjectMarkssState.entities[examSubjectMarksId]
);

export const selectExamSubjectMarkssPageLoading = createSelector(
    selectExamSubjectMarkssState,
    examSubjectMarkssState => examSubjectMarkssState.listLoading
);

export const selectExamSubjectMarkssActionLoading = createSelector(
    selectExamSubjectMarkssState,
    examSubjectMarkssState => examSubjectMarkssState.actionsloading
);

export const selectLastCreatedExamSubjectMarksId = createSelector(
    selectExamSubjectMarkssState,
    examSubjectMarkssState => examSubjectMarkssState.lastCreatedExamSubjectMarksId
);

export const selectExamSubjectMarkssShowInitWaitingMessage = createSelector(
    selectExamSubjectMarkssState,
    examSubjectMarkssState => examSubjectMarkssState.showInitWaitingMessage
);

export const selectExamSubjectMarkssInStore = createSelector(
    selectExamSubjectMarkssState,
    examSubjectMarkssState => {
      const items: ExamSubjectMarksModel[] = [];
      each(examSubjectMarkssState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ExamSubjectMarksModel[] =
        httpExtension.sortArray(items, examSubjectMarkssState.lastQuery.sortField, examSubjectMarkssState.lastQuery.sortOrder);
      return new QueryResultsModel(result, examSubjectMarkssState.totalCount, '');
    }
);
