// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ExamsState } from '../_reducers/exam.reducers'
import { ExamModel } from '../_models/exam.model';

export const selectExamsState = createFeatureSelector<ExamsState>('exams');

export const selectExamById = (examId: number) => createSelector(
    selectExamsState,
    examsState => examsState.entities[examId]
);

export const selectExamsPageLoading = createSelector(
    selectExamsState,
    examsState => examsState.listLoading
);

export const selectExamsActionLoading = createSelector(
    selectExamsState,
    examsState => examsState.actionsloading
);

export const selectLastCreatedExamId = createSelector(
    selectExamsState,
    examsState => examsState.lastCreatedExamId
);

export const selectExamsShowInitWaitingMessage = createSelector(
    selectExamsState,
    examsState => examsState.showInitWaitingMessage
);

export const selectExamsInStore = createSelector(
    selectExamsState,
    examsState => {
      const items: ExamModel[] = [];
      each(examsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ExamModel[] =
        httpExtension.sortArray(items, examsState.lastQuery.sortField, examsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, examsState.totalCount, '');
    }
);
