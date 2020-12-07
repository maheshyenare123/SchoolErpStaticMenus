// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { BooksState } from '../_reducers/book.reducers';
import { BookModel } from '../_models/book.model';

export const selectBooksState = createFeatureSelector<BooksState>('books');

export const selectBookById = (bookId: number) => createSelector(
    selectBooksState,
    booksState => booksState.entities[bookId]
);

export const selectBooksPageLoading = createSelector(
    selectBooksState,
    booksState => booksState.listLoading
);

export const selectBooksActionLoading = createSelector(
    selectBooksState,
    booksState => booksState.actionsloading
);

export const selectLastCreatedBookId = createSelector(
    selectBooksState,
    booksState => booksState.lastCreatedBookId
);

export const selectBooksShowInitWaitingMessage = createSelector(
    selectBooksState,
    booksState => booksState.showInitWaitingMessage
);

export const selectBooksInStore = createSelector(
    selectBooksState,
    booksState => {
      const items: BookModel[] = [];
      each(booksState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: BookModel[] =
        httpExtension.sortArray(items, booksState.lastQuery.sortField, booksState.lastQuery.sortOrder);
      return new QueryResultsModel(result, booksState.totalCount, '');
    }
);
