// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { DisableReasonModel } from '../_models/disableReason.model';

export enum DisableReasonActionTypes {
  DisableReasonOnServerCreated = '[Edit DisableReason Dialog] DisableReason On Server Created',
  DisableReasonCreated = '[Edit DisableReason Dialog] DisableReason Created',
  DisableReasonUpdated = '[Edit DisableReason Dialog] DisableReason Updated',
  DisableReasonsStatusUpdated = '[DisableReason List Page] DisableReasons Status Updated',
  OneDisableReasonDeleted = '[DisableReasons List Page] One DisableReason Deleted',
  ManyDisableReasonsDeleted = '[DisableReasons List Page] Many DisableReason Deleted',
  DisableReasonsPageRequested = '[DisableReasons List Page] DisableReasons Page Requested',
  DisableReasonsPageLoaded = '[DisableReasons API] DisableReasons Page Loaded',
  DisableReasonsPageCancelled = '[DisableReasons API] DisableReasons Page Cancelled',
  DisableReasonsPageToggleLoading = '[DisableReasons] DisableReasons Page Toggle Loading',
  DisableReasonActionToggleLoading = '[DisableReasons] DisableReasons Action Toggle Loading'
}

export class DisableReasonOnServerCreated implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonOnServerCreated;
  constructor(public payload: { disableReason: DisableReasonModel }) {
  }
}

export class DisableReasonCreated implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonCreated;

  constructor(public payload: { disableReason: DisableReasonModel }) {
  }
}

export class DisableReasonUpdated implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonUpdated;

  constructor(public payload: {
    partialDisableReason: Update<DisableReasonModel>, // For State update
    disableReason: DisableReasonModel // For Server update (through service)
  }) {
  }
}

export class DisableReasonsStatusUpdated implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonsStatusUpdated;

  constructor(public payload: {
    disableReasons: DisableReasonModel[],
    status: number
  }) {
  }
}

export class OneDisableReasonDeleted implements Action {
  readonly type = DisableReasonActionTypes.OneDisableReasonDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyDisableReasonsDeleted implements Action {
  readonly type = DisableReasonActionTypes.ManyDisableReasonsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class DisableReasonsPageRequested implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class DisableReasonsPageLoaded implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonsPageLoaded;

  constructor(public payload: { disableReasons: DisableReasonModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class DisableReasonsPageCancelled implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonsPageCancelled;
}

export class DisableReasonsPageToggleLoading implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class DisableReasonActionToggleLoading implements Action {
  readonly type = DisableReasonActionTypes.DisableReasonActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type DisableReasonActions = DisableReasonOnServerCreated
| DisableReasonCreated
| DisableReasonUpdated
| DisableReasonsStatusUpdated
| OneDisableReasonDeleted
| ManyDisableReasonsDeleted
| DisableReasonsPageRequested
| DisableReasonsPageLoaded
| DisableReasonsPageCancelled
| DisableReasonsPageToggleLoading
| DisableReasonActionToggleLoading;
