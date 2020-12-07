// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { BookIssueReturnModel } from '../_models/book-issue-return.model';

export enum BookIssueReturnActionTypes {
  BookIssueReturnOnServerCreated = '[Edit BookIssueReturn Dialog] BookIssueReturn On Server Created',
  BookIssueReturnCreated = '[Edit BookIssueReturn Dialog] BookIssueReturn Created',
  BookIssueReturnUpdated = '[Edit BookIssueReturn Dialog] BookIssueReturn Updated',
  BookIssueReturnsStatusUpdated = '[BookIssueReturn List Page] BookIssueReturns Status Updated',
  OneBookIssueReturnDeleted = '[BookIssueReturns List Page] One BookIssueReturn Deleted',
  ManyBookIssueReturnsDeleted = '[BookIssueReturns List Page] Many BookIssueReturn Deleted',
  BookIssueReturnsPageRequested = '[BookIssueReturns List Page] BookIssueReturns Page Requested',
  BookIssueReturnsPageLoaded = '[BookIssueReturns API] BookIssueReturns Page Loaded',
  BookIssueReturnsPageCancelled = '[BookIssueReturns API] BookIssueReturns Page Cancelled',
  BookIssueReturnsPageToggleLoading = '[BookIssueReturns] BookIssueReturns Page Toggle Loading',
  BookIssueReturnActionToggleLoading = '[BookIssueReturns] BookIssueReturns Action Toggle Loading'
}

export class BookIssueReturnOnServerCreated implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnOnServerCreated;
  constructor(public payload: { bookIssueReturn: BookIssueReturnModel }) {
  }
}

export class BookIssueReturnCreated implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnCreated;

  constructor(public payload: { bookIssueReturn: BookIssueReturnModel }) {
  }
}

export class BookIssueReturnUpdated implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnUpdated;

  constructor(public payload: {
    partialBookIssueReturn: Update<BookIssueReturnModel>, // For State update
    bookIssueReturn: BookIssueReturnModel // For Server update (through service)
  }) {
  }
}

export class BookIssueReturnsStatusUpdated implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnsStatusUpdated;

  constructor(public payload: {
    bookIssueReturns: BookIssueReturnModel[],
    status: number
  }) {
  }
}

export class OneBookIssueReturnDeleted implements Action {
  readonly type = BookIssueReturnActionTypes.OneBookIssueReturnDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyBookIssueReturnsDeleted implements Action {
  readonly type = BookIssueReturnActionTypes.ManyBookIssueReturnsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class BookIssueReturnsPageRequested implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnsPageRequested;

  constructor(public payload: { page: QueryParamsModel ,id:number}) {
  }
}

export class BookIssueReturnsPageLoaded implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnsPageLoaded;

  constructor(public payload: { bookIssueReturns: BookIssueReturnModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class BookIssueReturnsPageCancelled implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnsPageCancelled;
}

export class BookIssueReturnsPageToggleLoading implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class BookIssueReturnActionToggleLoading implements Action {
  readonly type = BookIssueReturnActionTypes.BookIssueReturnActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type BookIssueReturnActions = BookIssueReturnOnServerCreated
| BookIssueReturnCreated
| BookIssueReturnUpdated
| BookIssueReturnsStatusUpdated
| OneBookIssueReturnDeleted
| ManyBookIssueReturnsDeleted
| BookIssueReturnsPageRequested
| BookIssueReturnsPageLoaded
| BookIssueReturnsPageCancelled
| BookIssueReturnsPageToggleLoading
| BookIssueReturnActionToggleLoading;
