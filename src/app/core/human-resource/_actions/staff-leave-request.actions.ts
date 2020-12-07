// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StaffLeaveRequestModel } from '../_models/staff-leave-request.model';

export enum StaffLeaveRequestActionTypes {
  StaffLeaveRequestOnServerCreated = '[Edit StaffLeaveRequest Dialog] StaffLeaveRequest On Server Created',
  StaffLeaveRequestCreated = '[Edit StaffLeaveRequest Dialog] StaffLeaveRequest Created',
  StaffLeaveRequestUpdated = '[Edit StaffLeaveRequest Dialog] StaffLeaveRequest Updated',
  StaffLeaveRequestsStatusUpdated = '[StaffLeaveRequest List Page] StaffLeaveRequests Status Updated',
  OneStaffLeaveRequestDeleted = '[StaffLeaveRequests List Page] One StaffLeaveRequest Deleted',
  ManyStaffLeaveRequestsDeleted = '[StaffLeaveRequests List Page] Many StaffLeaveRequest Deleted',
  StaffLeaveRequestsPageRequested = '[StaffLeaveRequests List Page] StaffLeaveRequests Page Requested',
  StaffLeaveRequestsPageLoaded = '[StaffLeaveRequests API] StaffLeaveRequests Page Loaded',
  StaffLeaveRequestsPageCancelled = '[StaffLeaveRequests API] StaffLeaveRequests Page Cancelled',
  StaffLeaveRequestsPageToggleLoading = '[StaffLeaveRequests] StaffLeaveRequests Page Toggle Loading',
  StaffLeaveRequestActionToggleLoading = '[StaffLeaveRequests] StaffLeaveRequests Action Toggle Loading'
}

export class StaffLeaveRequestOnServerCreated implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestOnServerCreated;
  constructor(public payload: { staffLeaveRequest: StaffLeaveRequestModel }) {
  }
}

export class StaffLeaveRequestCreated implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestCreated;

  constructor(public payload: { staffLeaveRequest: StaffLeaveRequestModel }) {
  }
}

export class StaffLeaveRequestUpdated implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestUpdated;

  constructor(public payload: {
    partialStaffLeaveRequest: Update<StaffLeaveRequestModel>, // For State update
    staffLeaveRequest: StaffLeaveRequestModel // For Server update (through service)
  }) {
  }
}

export class StaffLeaveRequestsStatusUpdated implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestsStatusUpdated;

  constructor(public payload: {
    staffLeaveRequests: StaffLeaveRequestModel[],
    status: number
  }) {
  }
}

export class OneStaffLeaveRequestDeleted implements Action {
  readonly type = StaffLeaveRequestActionTypes.OneStaffLeaveRequestDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStaffLeaveRequestsDeleted implements Action {
  readonly type = StaffLeaveRequestActionTypes.ManyStaffLeaveRequestsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StaffLeaveRequestsPageRequested implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StaffLeaveRequestsPageLoaded implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestsPageLoaded;

  constructor(public payload: { staffLeaveRequests: StaffLeaveRequestModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StaffLeaveRequestsPageCancelled implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestsPageCancelled;
}

export class StaffLeaveRequestsPageToggleLoading implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StaffLeaveRequestActionToggleLoading implements Action {
  readonly type = StaffLeaveRequestActionTypes.StaffLeaveRequestActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StaffLeaveRequestActions = StaffLeaveRequestOnServerCreated
| StaffLeaveRequestCreated
| StaffLeaveRequestUpdated
| StaffLeaveRequestsStatusUpdated
| OneStaffLeaveRequestDeleted
| ManyStaffLeaveRequestsDeleted
| StaffLeaveRequestsPageRequested
| StaffLeaveRequestsPageLoaded
| StaffLeaveRequestsPageCancelled
| StaffLeaveRequestsPageToggleLoading
| StaffLeaveRequestActionToggleLoading;
