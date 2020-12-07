// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';

export enum PostalDispatchActionTypes {
  PostalDispatchOnServerCreated = '[Edit PostalDispatch Dialog] PostalDispatch On Server Created',
  PostalDispatchCreated = '[Edit PostalDispatch Dialog] PostalDispatch Created',
  PostalDispatchUpdated = '[Edit PostalDispatch Dialog] PostalDispatch Updated',
  PostalDispatchsStatusUpdated = '[PostalDispatch List Page] PostalDispatchs Status Updated',
  OnePostalDispatchDeleted = '[PostalDispatchs List Page] One PostalDispatch Deleted',
  ManyPostalDispatchsDeleted = '[PostalDispatchs List Page] Many PostalDispatch Deleted',
  PostalDispatchsPageRequested = '[PostalDispatchs List Page] PostalDispatchs Page Requested',
  PostalDispatchsPageLoaded = '[PostalDispatchs API] PostalDispatchs Page Loaded',
  PostalDispatchsPageCancelled = '[PostalDispatchs API] PostalDispatchs Page Cancelled',
  PostalDispatchsPageToggleLoading = '[PostalDispatchs] PostalDispatchs Page Toggle Loading',
  PostalDispatchActionToggleLoading = '[PostalDispatchs] PostalDispatchs Action Toggle Loading'
}

export class PostalDispatchOnServerCreated implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchOnServerCreated;
  constructor(public payload: { postalDispatch: DispatchReceiveModel }) {
  }
}

export class PostalDispatchCreated implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchCreated;

  constructor(public payload: { postalDispatch: DispatchReceiveModel }) {
  }
}

export class PostalDispatchUpdated implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchUpdated;

  constructor(public payload: {
    partialPostalDispatch: Update<DispatchReceiveModel>, // For State update
    postalDispatch: DispatchReceiveModel // For Server update (through service)
  }) {
  }
}

export class PostalDispatchsStatusUpdated implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchsStatusUpdated;

  constructor(public payload: {
    postalDispatchs: DispatchReceiveModel[],
    status: number
  }) {
  }
}

export class OnePostalDispatchDeleted implements Action {
  readonly type = PostalDispatchActionTypes.OnePostalDispatchDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyPostalDispatchsDeleted implements Action {
  readonly type = PostalDispatchActionTypes.ManyPostalDispatchsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class PostalDispatchsPageRequested implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class PostalDispatchsPageLoaded implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchsPageLoaded;

  constructor(public payload: { postalDispatchs: DispatchReceiveModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class PostalDispatchsPageCancelled implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchsPageCancelled;
}

export class PostalDispatchsPageToggleLoading implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class PostalDispatchActionToggleLoading implements Action {
  readonly type = PostalDispatchActionTypes.PostalDispatchActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type PostalDispatchActions = PostalDispatchOnServerCreated
| PostalDispatchCreated
| PostalDispatchUpdated
| PostalDispatchsStatusUpdated
| OnePostalDispatchDeleted
| ManyPostalDispatchsDeleted
| PostalDispatchsPageRequested
| PostalDispatchsPageLoaded
| PostalDispatchsPageCancelled
| PostalDispatchsPageToggleLoading
| PostalDispatchActionToggleLoading;
