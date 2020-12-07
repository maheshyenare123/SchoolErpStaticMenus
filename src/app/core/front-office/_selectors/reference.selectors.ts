// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ReferencesState } from '../_reducers/reference.reducers';
import { ReferenceModel } from '../_models/reference.model';

export const selectReferencesState = createFeatureSelector<ReferencesState>('references');

export const selectReferenceById = (referenceId: number) => createSelector(
    selectReferencesState,
    referencesState => referencesState.entities[referenceId]
);

export const selectReferencesPageLoading = createSelector(
    selectReferencesState,
    referencesState => referencesState.listLoading
);

export const selectReferencesActionLoading = createSelector(
    selectReferencesState,
    referencesState => referencesState.actionsloading
);

export const selectLastCreatedReferenceId = createSelector(
    selectReferencesState,
    referencesState => referencesState.lastCreatedReferenceId
);

export const selectReferencesShowInitWaitingMessage = createSelector(
    selectReferencesState,
    referencesState => referencesState.showInitWaitingMessage
);

export const selectReferencesInStore = createSelector(
    selectReferencesState,
    referencesState => {
      const items: ReferenceModel[] = [];
      each(referencesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ReferenceModel[] =
        httpExtension.sortArray(items, referencesState.lastQuery.sortField, referencesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, referencesState.totalCount, '');
    }
);
