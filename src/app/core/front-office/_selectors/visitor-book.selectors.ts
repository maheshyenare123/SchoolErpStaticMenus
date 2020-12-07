// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { VisitorBooksState } from '../_reducers/visitor-book.reducers';
import { VisitorBookModel } from '../_models/visitor-book.model';

export const selectVisitorBooksState = createFeatureSelector<VisitorBooksState>('visitorBooks');

export const selectVisitorBookById = (visitorBookId: number) => createSelector(
    selectVisitorBooksState,
    visitorBooksState => visitorBooksState.entities[visitorBookId]
);

export const selectVisitorBooksPageLoading = createSelector(
    selectVisitorBooksState,
    visitorBooksState => visitorBooksState.listLoading
);

export const selectVisitorBooksActionLoading = createSelector(
    selectVisitorBooksState,
    visitorBooksState => visitorBooksState.actionsloading
);

export const selectLastCreatedVisitorBookId = createSelector(
    selectVisitorBooksState,
    visitorBooksState => visitorBooksState.lastCreatedVisitorBookId
);

export const selectVisitorBooksShowInitWaitingMessage = createSelector(
    selectVisitorBooksState,
    visitorBooksState => visitorBooksState.showInitWaitingMessage
);

export const selectVisitorBooksInStore = createSelector(
    selectVisitorBooksState,
    visitorBooksState => {
      const items: VisitorBookModel[] = [];
      each(visitorBooksState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: VisitorBookModel[] =
        httpExtension.sortArray(items, visitorBooksState.lastQuery.sortField, visitorBooksState.lastQuery.sortOrder);
      return new QueryResultsModel(result, visitorBooksState.totalCount, '');
    }
);
