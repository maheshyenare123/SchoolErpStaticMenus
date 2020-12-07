// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { SubjectsState } from '../_reducers/subject.reducers';
import { SubjectDtoModel } from '../_models/subjectDto.model';

export const selectSubjectsState = createFeatureSelector<SubjectsState>('subjects');

export const selectSubjectById = (subjectId: number) => createSelector(
    selectSubjectsState,
    subjectsState => subjectsState.entities[subjectId]
);

export const selectSubjectsPageLoading = createSelector(
    selectSubjectsState,
    subjectsState => subjectsState.listLoading
);

export const selectSubjectsActionLoading = createSelector(
    selectSubjectsState,
    subjectsState => subjectsState.actionsloading
);

export const selectLastCreatedSubjectId = createSelector(
    selectSubjectsState,
    subjectsState => subjectsState.lastCreatedSubjectId
);

export const selectSubjectsShowInitWaitingMessage = createSelector(
    selectSubjectsState,
    subjectsState => subjectsState.showInitWaitingMessage
);

export const selectSubjectsInStore = createSelector(
    selectSubjectsState,
    subjectsState => {
      const items: SubjectDtoModel[] = [];
      each(subjectsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: SubjectDtoModel[] =
        httpExtension.sortArray(items, subjectsState.lastQuery.sortField, subjectsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, subjectsState.totalCount, '');
    }
);
