// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { VisitorBookModel } from '../_models/visitor-book.model';

export enum VisitorBookActionTypes {
  VisitorBookOnServerCreated = '[Edit VisitorBook Dialog] VisitorBook On Server Created',
  VisitorBookCreated = '[Edit VisitorBook Dialog] VisitorBook Created',
  VisitorBookUpdated = '[Edit VisitorBook Dialog] VisitorBook Updated',
  VisitorBooksStatusUpdated = '[VisitorBook List Page] VisitorBooks Status Updated',
  OneVisitorBookDeleted = '[VisitorBooks List Page] One VisitorBook Deleted',
  ManyVisitorBooksDeleted = '[VisitorBooks List Page] Many VisitorBook Deleted',
  VisitorBooksPageRequested = '[VisitorBooks List Page] VisitorBooks Page Requested',
  VisitorBooksPageLoaded = '[VisitorBooks API] VisitorBooks Page Loaded',
  VisitorBooksPageCancelled = '[VisitorBooks API] VisitorBooks Page Cancelled',
  VisitorBooksPageToggleLoading = '[VisitorBooks] VisitorBooks Page Toggle Loading',
  VisitorBookActionToggleLoading = '[VisitorBooks] VisitorBooks Action Toggle Loading'
}

export class VisitorBookOnServerCreated implements Action {
  readonly type = VisitorBookActionTypes.VisitorBookOnServerCreated;
  constructor(public payload: { visitorBook: VisitorBookModel }) {
  }
}

export class VisitorBookCreated implements Action {
  readonly type = VisitorBookActionTypes.VisitorBookCreated;

  constructor(public payload: { visitorBook: VisitorBookModel }) {
  }
}

export class VisitorBookUpdated implements Action {
  readonly type = VisitorBookActionTypes.VisitorBookUpdated;

  constructor(public payload: {
    partialVisitorBook: Update<VisitorBookModel>, // For State update
    visitorBook: VisitorBookModel // For Server update (through service)
  }) {
  }
}

export class VisitorBooksStatusUpdated implements Action {
  readonly type = VisitorBookActionTypes.VisitorBooksStatusUpdated;

  constructor(public payload: {
    visitorBooks: VisitorBookModel[],
    status: number
  }) {
  }
}

export class OneVisitorBookDeleted implements Action {
  readonly type = VisitorBookActionTypes.OneVisitorBookDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyVisitorBooksDeleted implements Action {
  readonly type = VisitorBookActionTypes.ManyVisitorBooksDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class VisitorBooksPageRequested implements Action {
  readonly type = VisitorBookActionTypes.VisitorBooksPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class VisitorBooksPageLoaded implements Action {
  readonly type = VisitorBookActionTypes.VisitorBooksPageLoaded;

  constructor(public payload: { visitorBooks: VisitorBookModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class VisitorBooksPageCancelled implements Action {
  readonly type = VisitorBookActionTypes.VisitorBooksPageCancelled;
}

export class VisitorBooksPageToggleLoading implements Action {
  readonly type = VisitorBookActionTypes.VisitorBooksPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class VisitorBookActionToggleLoading implements Action {
  readonly type = VisitorBookActionTypes.VisitorBookActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type VisitorBookActions = VisitorBookOnServerCreated
| VisitorBookCreated
| VisitorBookUpdated
| VisitorBooksStatusUpdated
| OneVisitorBookDeleted
| ManyVisitorBooksDeleted
| VisitorBooksPageRequested
| VisitorBooksPageLoaded
| VisitorBooksPageCancelled
| VisitorBooksPageToggleLoading
| VisitorBookActionToggleLoading;
