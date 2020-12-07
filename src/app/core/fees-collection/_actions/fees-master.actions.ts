// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { FeesMasterModel } from '../_models/fees-master.model';

export enum FeesMasterActionTypes {
  FeesMasterOnServerCreated = '[Edit FeesMaster Dialog] FeesMaster On Server Created',
  FeesMasterCreated = '[Edit FeesMaster Dialog] FeesMaster Created',
  FeesMasterUpdated = '[Edit FeesMaster Dialog] FeesMaster Updated',
  FeesMastersStatusUpdated = '[FeesMaster List Page] FeesMasters Status Updated',
  OneFeesMasterDeleted = '[FeesMasters List Page] One FeesMaster Deleted',
  ManyFeesMastersDeleted = '[FeesMasters List Page] Many FeesMaster Deleted',
  FeesMastersPageRequested = '[FeesMasters List Page] FeesMasters Page Requested',
  FeesMastersPageLoaded = '[FeesMasters API] FeesMasters Page Loaded',
  FeesMastersPageCancelled = '[FeesMasters API] FeesMasters Page Cancelled',
  FeesMastersPageToggleLoading = '[FeesMasters] FeesMasters Page Toggle Loading',
  FeesMasterActionToggleLoading = '[FeesMasters] FeesMasters Action Toggle Loading'
}

export class FeesMasterOnServerCreated implements Action {
  readonly type = FeesMasterActionTypes.FeesMasterOnServerCreated;
  constructor(public payload: { feesMaster: FeesMasterModel }) {
  }
}

export class FeesMasterCreated implements Action {
  readonly type = FeesMasterActionTypes.FeesMasterCreated;

  constructor(public payload: { feesMaster: FeesMasterModel }) {
  }
}

export class FeesMasterUpdated implements Action {
  readonly type = FeesMasterActionTypes.FeesMasterUpdated;

  constructor(public payload: {
    partialFeesMaster: Update<FeesMasterModel>, // For State update
    feesMaster: FeesMasterModel // For Server update (through service)
  }) {
  }
}

export class FeesMastersStatusUpdated implements Action {
  readonly type = FeesMasterActionTypes.FeesMastersStatusUpdated;

  constructor(public payload: {
    feesMasters: FeesMasterModel[],
    status: number
  }) {
  }
}

export class OneFeesMasterDeleted implements Action {
  readonly type = FeesMasterActionTypes.OneFeesMasterDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyFeesMastersDeleted implements Action {
  readonly type = FeesMasterActionTypes.ManyFeesMastersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class FeesMastersPageRequested implements Action {
  readonly type = FeesMasterActionTypes.FeesMastersPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class FeesMastersPageLoaded implements Action {
  readonly type = FeesMasterActionTypes.FeesMastersPageLoaded;

  constructor(public payload: { feesMasters: FeesMasterModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class FeesMastersPageCancelled implements Action {
  readonly type = FeesMasterActionTypes.FeesMastersPageCancelled;
}

export class FeesMastersPageToggleLoading implements Action {
  readonly type = FeesMasterActionTypes.FeesMastersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class FeesMasterActionToggleLoading implements Action {
  readonly type = FeesMasterActionTypes.FeesMasterActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type FeesMasterActions = FeesMasterOnServerCreated
| FeesMasterCreated
| FeesMasterUpdated
| FeesMastersStatusUpdated
| OneFeesMasterDeleted
| ManyFeesMastersDeleted
| FeesMastersPageRequested
| FeesMastersPageLoaded
| FeesMastersPageCancelled
| FeesMastersPageToggleLoading
| FeesMasterActionToggleLoading;
