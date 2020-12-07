// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { SubjectGroupsState } from '../_reducers/subject-group.reducers';
import { SubjectGroupDtoModel } from '../_models/subjectGroupDto.model';

export const selectSubjectGroupsState = createFeatureSelector<SubjectGroupsState>('subjectGroups');

export const selectSubjectGroupById = (subjectGroupId: number) => createSelector(
    selectSubjectGroupsState,
    subjectGroupsState => subjectGroupsState.entities[subjectGroupId]
);

export const selectSubjectGroupsPageLoading = createSelector(
    selectSubjectGroupsState,
    subjectGroupsState => subjectGroupsState.listLoading
);

export const selectSubjectGroupsActionLoading = createSelector(
    selectSubjectGroupsState,
    subjectGroupsState => subjectGroupsState.actionsloading
);

export const selectLastCreatedSubjectGroupId = createSelector(
    selectSubjectGroupsState,
    subjectGroupsState => subjectGroupsState.lastCreatedSubjectGroupId
);

export const selectSubjectGroupsShowInitWaitingMessage = createSelector(
    selectSubjectGroupsState,
    subjectGroupsState => subjectGroupsState.showInitWaitingMessage
);

export const selectSubjectGroupsInStore = createSelector(
    selectSubjectGroupsState,
    subjectGroupsState => {
      const items: SubjectGroupDtoModel[] = [];
      each(subjectGroupsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: SubjectGroupDtoModel[] =
        httpExtension.sortArray(items, subjectGroupsState.lastQuery.sortField, subjectGroupsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, subjectGroupsState.totalCount, '');
    }
);
