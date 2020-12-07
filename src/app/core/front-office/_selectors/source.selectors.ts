// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { SourcesState } from '../_reducers/source.reducers';
import { SourceModel } from '../_models/source.model';

export const selectSourcesState = createFeatureSelector<SourcesState>('sources');

export const selectSourceById = (sourceId: number) => createSelector(
    selectSourcesState,
    sourcesState => sourcesState.entities[sourceId]
);

export const selectSourcesPageLoading = createSelector(
    selectSourcesState,
    sourcesState => sourcesState.listLoading
);

export const selectSourcesActionLoading = createSelector(
    selectSourcesState,
    sourcesState => sourcesState.actionsloading
);

export const selectLastCreatedSourceId = createSelector(
    selectSourcesState,
    sourcesState => sourcesState.lastCreatedSourceId
);

export const selectSourcesShowInitWaitingMessage = createSelector(
    selectSourcesState,
    sourcesState => sourcesState.showInitWaitingMessage
);

export const selectSourcesInStore = createSelector(
    selectSourcesState,
    sourcesState => {
      const items: SourceModel[] = [];
      each(sourcesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: SourceModel[] =
        httpExtension.sortArray(items, sourcesState.lastQuery.sortField, sourcesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, sourcesState.totalCount, '');
    }
);
