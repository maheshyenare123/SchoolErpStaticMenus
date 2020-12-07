// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { BookIssueReturnsState } from '../_reducers/book-issue-retrun.reducers';
import { BookIssueReturnModel } from '../_models/book-issue-return.model';

export const selectBookIssueReturnsState = createFeatureSelector<BookIssueReturnsState>('bookIssueReturns');

export const selectBookIssueReturnById = (bookIssueReturnId: number) => createSelector(
    selectBookIssueReturnsState,
    bookIssueReturnsState => bookIssueReturnsState.entities[bookIssueReturnId]
);

export const selectBookIssueReturnsPageLoading = createSelector(
    selectBookIssueReturnsState,
    bookIssueReturnsState => bookIssueReturnsState.listLoading
);

export const selectBookIssueReturnsActionLoading = createSelector(
    selectBookIssueReturnsState,
    bookIssueReturnsState => bookIssueReturnsState.actionsloading
);

export const selectLastCreatedBookIssueReturnId = createSelector(
    selectBookIssueReturnsState,
    bookIssueReturnsState => bookIssueReturnsState.lastCreatedBookIssueReturnId
);

export const selectBookIssueReturnsShowInitWaitingMessage = createSelector(
    selectBookIssueReturnsState,
    bookIssueReturnsState => bookIssueReturnsState.showInitWaitingMessage
);

export const selectBookIssueReturnsInStore = createSelector(
    selectBookIssueReturnsState,
    bookIssueReturnsState => {
      const items: BookIssueReturnModel[] = [];
      each(bookIssueReturnsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: BookIssueReturnModel[] =
        httpExtension.sortArray(items, bookIssueReturnsState.lastQuery.sortField, bookIssueReturnsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, bookIssueReturnsState.totalCount, '');
    }
);
