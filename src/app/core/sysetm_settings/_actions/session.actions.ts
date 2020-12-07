// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { SessionModel } from '../_models/session.model';

export enum SessionActionTypes {
  SessionOnServerCreated = '[Edit Session Dialog] Session On Server Created',
  SessionCreated = '[Edit Session Dialog] Session Created',
  SessionUpdated = '[Edit Session Dialog] Session Updated',
  SessionsStatusUpdated = '[Session List Page] Sessions Status Updated',
  OneSessionDeleted = '[Sessions List Page] One Session Deleted',
  ManySessionsDeleted = '[Sessions List Page] Many Session Deleted',
  SessionsPageRequested = '[Sessions List Page] Sessions Page Requested',
  SessionsPageLoaded = '[Sessions API] Sessions Page Loaded',
  SessionsPageCancelled = '[Sessions API] Sessions Page Cancelled',
  SessionsPageToggleLoading = '[Sessions] Sessions Page Toggle Loading',
  SessionActionToggleLoading = '[Sessions] Sessions Action Toggle Loading'
}

export class SessionOnServerCreated implements Action {
  readonly type = SessionActionTypes.SessionOnServerCreated;
  constructor(public payload: { session: SessionModel }) {
  }
}

export class SessionCreated implements Action {
  readonly type = SessionActionTypes.SessionCreated;

  constructor(public payload: { session: SessionModel }) {
  }
}

export class SessionUpdated implements Action {
  readonly type = SessionActionTypes.SessionUpdated;

  constructor(public payload: {
    partialSession: Update<SessionModel>, // For State update
    session: SessionModel // For Server update (through service)
  }) {
  }
}

export class SessionsStatusUpdated implements Action {
  readonly type = SessionActionTypes.SessionsStatusUpdated;

  constructor(public payload: {
    sessions: SessionModel[],
    status: number
  }) {
  }
}

export class OneSessionDeleted implements Action {
  readonly type = SessionActionTypes.OneSessionDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManySessionsDeleted implements Action {
  readonly type = SessionActionTypes.ManySessionsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class SessionsPageRequested implements Action {
  readonly type = SessionActionTypes.SessionsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class SessionsPageLoaded implements Action {
  readonly type = SessionActionTypes.SessionsPageLoaded;

  constructor(public payload: { sessions: SessionModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class SessionsPageCancelled implements Action {
  readonly type = SessionActionTypes.SessionsPageCancelled;
}

export class SessionsPageToggleLoading implements Action {
  readonly type = SessionActionTypes.SessionsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class SessionActionToggleLoading implements Action {
  readonly type = SessionActionTypes.SessionActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type SessionActions = SessionOnServerCreated
| SessionCreated
| SessionUpdated
| SessionsStatusUpdated
| OneSessionDeleted
| ManySessionsDeleted
| SessionsPageRequested
| SessionsPageLoaded
| SessionsPageCancelled
| SessionsPageToggleLoading
| SessionActionToggleLoading;
