// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';

export enum BulkDeleteActionTypes {
  BulkDeleteOnServerCreated = '[Edit BulkDelete Dialog] BulkDelete On Server Created',
  BulkDeleteCreated = '[Edit BulkDelete Dialog] BulkDelete Created',
  BulkDeleteUpdated = '[Edit BulkDelete Dialog] BulkDelete Updated',
  BulkDeletesStatusUpdated = '[BulkDelete List Page] BulkDeletes Status Updated',
  OneBulkDeleteDeleted = '[BulkDeletes List Page] One BulkDelete Deleted',
  ManyBulkDeletesDeleted = '[BulkDeletes List Page] Many BulkDelete Deleted',
  BulkDeletesPageRequested = '[BulkDeletes List Page] BulkDeletes Page Requested',
  BulkDeletesPageLoaded = '[BulkDeletes API] BulkDeletes Page Loaded',
  BulkDeletesPageCancelled = '[BulkDeletes API] BulkDeletes Page Cancelled',
  BulkDeletesPageToggleLoading = '[BulkDeletes] BulkDeletes Page Toggle Loading',
  BulkDeleteActionToggleLoading = '[BulkDeletes] BulkDeletes Action Toggle Loading'
}

export class BulkDeleteOnServerCreated implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeleteOnServerCreated;
  constructor(public payload: { bulkDelete: StudentDtoModel }) {
  }
}

export class BulkDeleteCreated implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeleteCreated;

  constructor(public payload: { bulkDelete: StudentDtoModel }) {
  }
}

export class BulkDeleteUpdated implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeleteUpdated;

  constructor(public payload: {
    partialBulkDelete: Update<StudentDtoModel>, // For State update
    bulkDelete: StudentDtoModel // For Server update (through service)
  }) {
  }
}

export class BulkDeletesStatusUpdated implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeletesStatusUpdated;

  constructor(public payload: {
    bulkDeletes: StudentDtoModel[],
    status: number
  }) {
  }
}

export class OneBulkDeleteDeleted implements Action {
  readonly type = BulkDeleteActionTypes.OneBulkDeleteDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyBulkDeletesDeleted implements Action {
  readonly type = BulkDeleteActionTypes.ManyBulkDeletesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class BulkDeletesPageRequested implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeletesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class BulkDeletesPageLoaded implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeletesPageLoaded;

  constructor(public payload: { bulkDeletes: StudentDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class BulkDeletesPageCancelled implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeletesPageCancelled;
}

export class BulkDeletesPageToggleLoading implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeletesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class BulkDeleteActionToggleLoading implements Action {
  readonly type = BulkDeleteActionTypes.BulkDeleteActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type BulkDeleteActions = BulkDeleteOnServerCreated
| BulkDeleteCreated
| BulkDeleteUpdated
| BulkDeletesStatusUpdated
| OneBulkDeleteDeleted
| ManyBulkDeletesDeleted
| BulkDeletesPageRequested
| BulkDeletesPageLoaded
| BulkDeletesPageCancelled
| BulkDeletesPageToggleLoading
| BulkDeleteActionToggleLoading;
