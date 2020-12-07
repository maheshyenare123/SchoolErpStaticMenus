// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ReferenceModel } from '../_models/reference.model';

export enum ReferenceActionTypes {
  ReferenceOnServerCreated = '[Edit Reference Dialog] Reference On Server Created',
  ReferenceCreated = '[Edit Reference Dialog] Reference Created',
  ReferenceUpdated = '[Edit Reference Dialog] Reference Updated',
  ReferencesStatusUpdated = '[Reference List Page] References Status Updated',
  OneReferenceDeleted = '[References List Page] One Reference Deleted',
  ManyReferencesDeleted = '[References List Page] Many Reference Deleted',
  ReferencesPageRequested = '[References List Page] References Page Requested',
  ReferencesPageLoaded = '[References API] References Page Loaded',
  ReferencesPageCancelled = '[References API] References Page Cancelled',
  ReferencesPageToggleLoading = '[References] References Page Toggle Loading',
  ReferenceActionToggleLoading = '[References] References Action Toggle Loading'
}

export class ReferenceOnServerCreated implements Action {
  readonly type = ReferenceActionTypes.ReferenceOnServerCreated;
  constructor(public payload: { reference: ReferenceModel }) {
  }
}

export class ReferenceCreated implements Action {
  readonly type = ReferenceActionTypes.ReferenceCreated;

  constructor(public payload: { reference: ReferenceModel }) {
  }
}

export class ReferenceUpdated implements Action {
  readonly type = ReferenceActionTypes.ReferenceUpdated;

  constructor(public payload: {
    partialReference: Update<ReferenceModel>, // For State update
    reference: ReferenceModel // For Server update (through service)
  }) {
  }
}

export class ReferencesStatusUpdated implements Action {
  readonly type = ReferenceActionTypes.ReferencesStatusUpdated;

  constructor(public payload: {
    references: ReferenceModel[],
    status: number
  }) {
  }
}

export class OneReferenceDeleted implements Action {
  readonly type = ReferenceActionTypes.OneReferenceDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyReferencesDeleted implements Action {
  readonly type = ReferenceActionTypes.ManyReferencesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ReferencesPageRequested implements Action {
  readonly type = ReferenceActionTypes.ReferencesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ReferencesPageLoaded implements Action {
  readonly type = ReferenceActionTypes.ReferencesPageLoaded;

  constructor(public payload: { references: ReferenceModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ReferencesPageCancelled implements Action {
  readonly type = ReferenceActionTypes.ReferencesPageCancelled;
}

export class ReferencesPageToggleLoading implements Action {
  readonly type = ReferenceActionTypes.ReferencesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ReferenceActionToggleLoading implements Action {
  readonly type = ReferenceActionTypes.ReferenceActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ReferenceActions = ReferenceOnServerCreated
| ReferenceCreated
| ReferenceUpdated
| ReferencesStatusUpdated
| OneReferenceDeleted
| ManyReferencesDeleted
| ReferencesPageRequested
| ReferencesPageLoaded
| ReferencesPageCancelled
| ReferencesPageToggleLoading
| ReferenceActionToggleLoading;
