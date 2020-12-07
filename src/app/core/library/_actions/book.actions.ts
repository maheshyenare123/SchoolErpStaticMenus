// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { BookModel } from '../_models/book.model';

export enum BookActionTypes {
  BookOnServerCreated = '[Edit Book Dialog] Book On Server Created',
  BookCreated = '[Edit Book Dialog] Book Created',
  BookUpdated = '[Edit Book Dialog] Book Updated',
  BooksStatusUpdated = '[Book List Page] Books Status Updated',
  OneBookDeleted = '[Books List Page] One Book Deleted',
  ManyBooksDeleted = '[Books List Page] Many Book Deleted',
  BooksPageRequested = '[Books List Page] Books Page Requested',
  BooksPageLoaded = '[Books API] Books Page Loaded',
  BooksPageCancelled = '[Books API] Books Page Cancelled',
  BooksPageToggleLoading = '[Books] Books Page Toggle Loading',
  BookActionToggleLoading = '[Books] Books Action Toggle Loading'
}

export class BookOnServerCreated implements Action {
  readonly type = BookActionTypes.BookOnServerCreated;
  constructor(public payload: { book: BookModel }) {
  }
}

export class BookCreated implements Action {
  readonly type = BookActionTypes.BookCreated;

  constructor(public payload: { book: BookModel }) {
  }
}

export class BookUpdated implements Action {
  readonly type = BookActionTypes.BookUpdated;

  constructor(public payload: {
    partialBook: Update<BookModel>, // For State update
    book: BookModel // For Server update (through service)
  }) {
  }
}

export class BooksStatusUpdated implements Action {
  readonly type = BookActionTypes.BooksStatusUpdated;

  constructor(public payload: {
    books: BookModel[],
    status: number
  }) {
  }
}

export class OneBookDeleted implements Action {
  readonly type = BookActionTypes.OneBookDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyBooksDeleted implements Action {
  readonly type = BookActionTypes.ManyBooksDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class BooksPageRequested implements Action {
  readonly type = BookActionTypes.BooksPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class BooksPageLoaded implements Action {
  readonly type = BookActionTypes.BooksPageLoaded;

  constructor(public payload: { books: BookModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class BooksPageCancelled implements Action {
  readonly type = BookActionTypes.BooksPageCancelled;
}

export class BooksPageToggleLoading implements Action {
  readonly type = BookActionTypes.BooksPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class BookActionToggleLoading implements Action {
  readonly type = BookActionTypes.BookActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type BookActions = BookOnServerCreated
| BookCreated
| BookUpdated
| BooksStatusUpdated
| OneBookDeleted
| ManyBooksDeleted
| BooksPageRequested
| BooksPageLoaded
| BooksPageCancelled
| BooksPageToggleLoading
| BookActionToggleLoading;
