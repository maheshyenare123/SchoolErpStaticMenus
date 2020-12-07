// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { SourceModel } from '../_models/source.model';

export enum SourceActionTypes {
  SourceOnServerCreated = '[Edit Source Dialog] Source On Server Created',
  SourceCreated = '[Edit Source Dialog] Source Created',
  SourceUpdated = '[Edit Source Dialog] Source Updated',
  SourcesStatusUpdated = '[Source List Page] Sources Status Updated',
  OneSourceDeleted = '[Sources List Page] One Source Deleted',
  ManySourcesDeleted = '[Sources List Page] Many Source Deleted',
  SourcesPageRequested = '[Sources List Page] Sources Page Requested',
  SourcesPageLoaded = '[Sources API] Sources Page Loaded',
  SourcesPageCancelled = '[Sources API] Sources Page Cancelled',
  SourcesPageToggleLoading = '[Sources] Sources Page Toggle Loading',
  SourceActionToggleLoading = '[Sources] Sources Action Toggle Loading'
}

export class SourceOnServerCreated implements Action {
  readonly type = SourceActionTypes.SourceOnServerCreated;
  constructor(public payload: { source: SourceModel }) {
  }
}

export class SourceCreated implements Action {
  readonly type = SourceActionTypes.SourceCreated;

  constructor(public payload: { source: SourceModel }) {
  }
}

export class SourceUpdated implements Action {
  readonly type = SourceActionTypes.SourceUpdated;

  constructor(public payload: {
    partialSource: Update<SourceModel>, // For State update
    source: SourceModel // For Server update (through service)
  }) {
  }
}

export class SourcesStatusUpdated implements Action {
  readonly type = SourceActionTypes.SourcesStatusUpdated;

  constructor(public payload: {
    sources: SourceModel[],
    status: number
  }) {
  }
}

export class OneSourceDeleted implements Action {
  readonly type = SourceActionTypes.OneSourceDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManySourcesDeleted implements Action {
  readonly type = SourceActionTypes.ManySourcesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class SourcesPageRequested implements Action {
  readonly type = SourceActionTypes.SourcesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class SourcesPageLoaded implements Action {
  readonly type = SourceActionTypes.SourcesPageLoaded;

  constructor(public payload: { sources: SourceModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class SourcesPageCancelled implements Action {
  readonly type = SourceActionTypes.SourcesPageCancelled;
}

export class SourcesPageToggleLoading implements Action {
  readonly type = SourceActionTypes.SourcesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class SourceActionToggleLoading implements Action {
  readonly type = SourceActionTypes.SourceActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type SourceActions = SourceOnServerCreated
| SourceCreated
| SourceUpdated
| SourcesStatusUpdated
| OneSourceDeleted
| ManySourcesDeleted
| SourcesPageRequested
| SourcesPageLoaded
| SourcesPageCancelled
| SourcesPageToggleLoading
| SourceActionToggleLoading;
