// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ApproveLeaveDtoModel } from '../_models/approve-leave.model'

export enum ApproveLeaveActionTypes {
  ApproveLeaveOnServerCreated = '[Edit ApproveLeave Dialog] ApproveLeave On Server Created',
  ApproveLeaveCreated = '[Edit ApproveLeave Dialog] ApproveLeave Created',
  ApproveLeaveUpdated = '[Edit ApproveLeave Dialog] ApproveLeave Updated',
  ApproveLeavesStatusUpdated = '[ApproveLeave List Page] ApproveLeaves Status Updated',
  OneApproveLeaveDeleted = '[ApproveLeaves List Page] One ApproveLeave Deleted',
  ManyApproveLeavesDeleted = '[ApproveLeaves List Page] Many ApproveLeave Deleted',
  ApproveLeavesPageRequested = '[ApproveLeaves List Page] ApproveLeaves Page Requested',
  ApproveLeavesPageLoaded = '[ApproveLeaves API] ApproveLeaves Page Loaded',
  ApproveLeavesPageCancelled = '[ApproveLeaves API] ApproveLeaves Page Cancelled',
  ApproveLeavesPageToggleLoading = '[ApproveLeaves] ApproveLeaves Page Toggle Loading',
  ApproveLeaveActionToggleLoading = '[ApproveLeaves] ApproveLeaves Action Toggle Loading'
}

export class ApproveLeaveOnServerCreated implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeaveOnServerCreated;
  constructor(public payload: { approveLeave: ApproveLeaveDtoModel }) {
  }
}

export class ApproveLeaveCreated implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeaveCreated;

  constructor(public payload: { approveLeave: ApproveLeaveDtoModel }) {
  }
}

export class ApproveLeaveUpdated implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeaveUpdated;

  constructor(public payload: {
    partialApproveLeave: Update<ApproveLeaveDtoModel>, // For State update
    approveLeave: ApproveLeaveDtoModel // For Server update (through service)
  }) {
  }
}

export class ApproveLeavesStatusUpdated implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeavesStatusUpdated;

  constructor(public payload: {
    approveLeaves: ApproveLeaveDtoModel[],
    status: number
  }) {
  }
}

export class OneApproveLeaveDeleted implements Action {
  readonly type = ApproveLeaveActionTypes.OneApproveLeaveDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyApproveLeavesDeleted implements Action {
  readonly type = ApproveLeaveActionTypes.ManyApproveLeavesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ApproveLeavesPageRequested implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeavesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ApproveLeavesPageLoaded implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeavesPageLoaded;

  constructor(public payload: { approveLeaves: ApproveLeaveDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ApproveLeavesPageCancelled implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeavesPageCancelled;
}

export class ApproveLeavesPageToggleLoading implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeavesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ApproveLeaveActionToggleLoading implements Action {
  readonly type = ApproveLeaveActionTypes.ApproveLeaveActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ApproveLeaveActions = ApproveLeaveOnServerCreated
| ApproveLeaveCreated
| ApproveLeaveUpdated
| ApproveLeavesStatusUpdated
| OneApproveLeaveDeleted
| ManyApproveLeavesDeleted
| ApproveLeavesPageRequested
| ApproveLeavesPageLoaded
| ApproveLeavesPageCancelled
| ApproveLeavesPageToggleLoading
| ApproveLeaveActionToggleLoading;
