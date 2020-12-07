// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { DispatchReceiveModel} from '../_models/dispose-dispatch-receive.model';

export enum PostalReceiveActionTypes {
  PostalReceiveOnServerCreated = '[Edit PostalReceive Dialog] PostalReceive On Server Created',
  PostalReceiveCreated = '[Edit PostalReceive Dialog] PostalReceive Created',
  PostalReceiveUpdated = '[Edit PostalReceive Dialog] PostalReceive Updated',
  PostalReceivesStatusUpdated = '[PostalReceive List Page] PostalReceives Status Updated',
  OnePostalReceiveDeleted = '[PostalReceives List Page] One PostalReceive Deleted',
  ManyPostalReceivesDeleted = '[PostalReceives List Page] Many PostalReceive Deleted',
  PostalReceivesPageRequested = '[PostalReceives List Page] PostalReceives Page Requested',
  PostalReceivesPageLoaded = '[PostalReceives API] PostalReceives Page Loaded',
  PostalReceivesPageCancelled = '[PostalReceives API] PostalReceives Page Cancelled',
  PostalReceivesPageToggleLoading = '[PostalReceives] PostalReceives Page Toggle Loading',
  PostalReceiveActionToggleLoading = '[PostalReceives] PostalReceives Action Toggle Loading'
}

export class PostalReceiveOnServerCreated implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceiveOnServerCreated;
  constructor(public payload: { postalReceive: DispatchReceiveModel }) {
  }
}

export class PostalReceiveCreated implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceiveCreated;

  constructor(public payload: { postalReceive: DispatchReceiveModel }) {
  }
}

export class PostalReceiveUpdated implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceiveUpdated;

  constructor(public payload: {
    partialPostalReceive: Update<DispatchReceiveModel>, // For State update
    postalReceive: DispatchReceiveModel // For Server update (through service)
  }) {
  }
}

export class PostalReceivesStatusUpdated implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceivesStatusUpdated;

  constructor(public payload: {
    postalReceives: DispatchReceiveModel[],
    status: number
  }) {
  }
}

export class OnePostalReceiveDeleted implements Action {
  readonly type = PostalReceiveActionTypes.OnePostalReceiveDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyPostalReceivesDeleted implements Action {
  readonly type = PostalReceiveActionTypes.ManyPostalReceivesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class PostalReceivesPageRequested implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceivesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class PostalReceivesPageLoaded implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceivesPageLoaded;

  constructor(public payload: { postalReceives: DispatchReceiveModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class PostalReceivesPageCancelled implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceivesPageCancelled;
}

export class PostalReceivesPageToggleLoading implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceivesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class PostalReceiveActionToggleLoading implements Action {
  readonly type = PostalReceiveActionTypes.PostalReceiveActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type PostalReceiveActions = PostalReceiveOnServerCreated
| PostalReceiveCreated
| PostalReceiveUpdated
| PostalReceivesStatusUpdated
| OnePostalReceiveDeleted
| ManyPostalReceivesDeleted
| PostalReceivesPageRequested
| PostalReceivesPageLoaded
| PostalReceivesPageCancelled
| PostalReceivesPageToggleLoading
| PostalReceiveActionToggleLoading;
