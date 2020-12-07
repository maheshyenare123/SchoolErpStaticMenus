// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { VisitorPurposeModel } from '../_models/visitor-purpose.model';

export enum VisitorPurposeActionTypes {
  VisitorPurposeOnServerCreated = '[Edit VisitorPurpose Dialog] VisitorPurpose On Server Created',
  VisitorPurposeCreated = '[Edit VisitorPurpose Dialog] VisitorPurpose Created',
  VisitorPurposeUpdated = '[Edit VisitorPurpose Dialog] VisitorPurpose Updated',
  VisitorPurposesStatusUpdated = '[VisitorPurpose List Page] VisitorPurposes Status Updated',
  OneVisitorPurposeDeleted = '[VisitorPurposes List Page] One VisitorPurpose Deleted',
  ManyVisitorPurposesDeleted = '[VisitorPurposes List Page] Many VisitorPurpose Deleted',
  VisitorPurposesPageRequested = '[VisitorPurposes List Page] VisitorPurposes Page Requested',
  VisitorPurposesPageLoaded = '[VisitorPurposes API] VisitorPurposes Page Loaded',
  VisitorPurposesPageCancelled = '[VisitorPurposes API] VisitorPurposes Page Cancelled',
  VisitorPurposesPageToggleLoading = '[VisitorPurposes] VisitorPurposes Page Toggle Loading',
  VisitorPurposeActionToggleLoading = '[VisitorPurposes] VisitorPurposes Action Toggle Loading'
}

export class VisitorPurposeOnServerCreated implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposeOnServerCreated;
  constructor(public payload: { visitorPurpose: VisitorPurposeModel }) {
  }
}

export class VisitorPurposeCreated implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposeCreated;

  constructor(public payload: { visitorPurpose: VisitorPurposeModel }) {
  }
}

export class VisitorPurposeUpdated implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposeUpdated;

  constructor(public payload: {
    partialVisitorPurpose: Update<VisitorPurposeModel>, // For State update
    visitorPurpose: VisitorPurposeModel // For Server update (through service)
  }) {
  }
}

export class VisitorPurposesStatusUpdated implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposesStatusUpdated;

  constructor(public payload: {
    visitorPurposes: VisitorPurposeModel[],
    status: number
  }) {
  }
}

export class OneVisitorPurposeDeleted implements Action {
  readonly type = VisitorPurposeActionTypes.OneVisitorPurposeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyVisitorPurposesDeleted implements Action {
  readonly type = VisitorPurposeActionTypes.ManyVisitorPurposesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class VisitorPurposesPageRequested implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class VisitorPurposesPageLoaded implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposesPageLoaded;

  constructor(public payload: { visitorPurposes: VisitorPurposeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class VisitorPurposesPageCancelled implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposesPageCancelled;
}

export class VisitorPurposesPageToggleLoading implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class VisitorPurposeActionToggleLoading implements Action {
  readonly type = VisitorPurposeActionTypes.VisitorPurposeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type VisitorPurposeActions = VisitorPurposeOnServerCreated
| VisitorPurposeCreated
| VisitorPurposeUpdated
| VisitorPurposesStatusUpdated
| OneVisitorPurposeDeleted
| ManyVisitorPurposesDeleted
| VisitorPurposesPageRequested
| VisitorPurposesPageLoaded
| VisitorPurposesPageCancelled
| VisitorPurposesPageToggleLoading
| VisitorPurposeActionToggleLoading;
