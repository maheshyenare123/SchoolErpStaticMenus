// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ExamSubjectState } from '../_reducers/exam-subject.reducers';
import { ExamSubjectDtoModel } from '../_models/exam-subject-dto.model';

export const selectExamSubjectState = createFeatureSelector<ExamSubjectState>('examSubjects');

export const selectExamSubjectById = (examSubjectId: number) => createSelector(
    selectExamSubjectState,
    examSubjectState => examSubjectState.entities[examSubjectId]
);

export const selectExamSubjectPageLoading = createSelector(
    selectExamSubjectState,
    examSubjectState => examSubjectState.listLoading
);

export const selectExamSubjectActionLoading = createSelector(
    selectExamSubjectState,
    examSubjectState => examSubjectState.actionsloading
);

export const selectLastCreatedExamSubjectId = createSelector(
    selectExamSubjectState,
    examSubjectState => examSubjectState.lastCreatedExamSubjectsId
);

export const selectExamSubjectShowInitWaitingMessage = createSelector(
    selectExamSubjectState,
    examSubjectState => examSubjectState.showInitWaitingMessage
);

export const selectExamSubjectInStore = createSelector(
    selectExamSubjectState,
    examSubjectState => {
      const items: ExamSubjectDtoModel[] = [];
      each(examSubjectState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ExamSubjectDtoModel[] =
        httpExtension.sortArray(items, examSubjectState.lastQuery.sortField, examSubjectState.lastQuery.sortOrder);
      return new QueryResultsModel(result, examSubjectState.totalCount, '');
    }
);
