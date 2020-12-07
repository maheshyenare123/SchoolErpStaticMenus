// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ExamGroupsState } from '../_reducers/exam-group.reducers';
import { ExamGroupModel } from '../_models/exam-group.model';

export const selectExamGroupsState = createFeatureSelector<ExamGroupsState>('examGroups');

export const selectExamGroupById = (examGroupId: number) => createSelector(
    selectExamGroupsState,
    examGroupsState => examGroupsState.entities[examGroupId]
);

export const selectExamGroupsPageLoading = createSelector(
    selectExamGroupsState,
    examGroupsState => examGroupsState.listLoading
);

export const selectExamGroupsActionLoading = createSelector(
    selectExamGroupsState,
    examGroupsState => examGroupsState.actionsloading
);

export const selectLastCreatedExamGroupId = createSelector(
    selectExamGroupsState,
    examGroupsState => examGroupsState.lastCreatedExamGroupId
);

export const selectExamGroupsShowInitWaitingMessage = createSelector(
    selectExamGroupsState,
    examGroupsState => examGroupsState.showInitWaitingMessage
);

export const selectExamGroupsInStore = createSelector(
    selectExamGroupsState,
    examGroupsState => {
      const items: ExamGroupModel[] = [];
      each(examGroupsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ExamGroupModel[] =
        httpExtension.sortArray(items, examGroupsState.lastQuery.sortField, examGroupsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, examGroupsState.totalCount, '');
    }
);
