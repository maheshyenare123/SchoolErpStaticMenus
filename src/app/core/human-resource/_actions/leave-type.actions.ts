// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { LeaveTypeModel } from '../_models/leave-type.model';

export enum LeaveTypeActionTypes {
  LeaveTypeOnServerCreated = '[Edit LeaveType Dialog] LeaveType On Server Created',
  LeaveTypeCreated = '[Edit LeaveType Dialog] LeaveType Created',
  LeaveTypeUpdated = '[Edit LeaveType Dialog] LeaveType Updated',
  LeaveTypesStatusUpdated = '[LeaveType List Page] LeaveTypes Status Updated',
  OneLeaveTypeDeleted = '[LeaveTypes List Page] One LeaveType Deleted',
  ManyLeaveTypesDeleted = '[LeaveTypes List Page] Many LeaveType Deleted',
  LeaveTypesPageRequested = '[LeaveTypes List Page] LeaveTypes Page Requested',
  LeaveTypesPageLoaded = '[LeaveTypes API] LeaveTypes Page Loaded',
  LeaveTypesPageCancelled = '[LeaveTypes API] LeaveTypes Page Cancelled',
  LeaveTypesPageToggleLoading = '[LeaveTypes] LeaveTypes Page Toggle Loading',
  LeaveTypeActionToggleLoading = '[LeaveTypes] LeaveTypes Action Toggle Loading'
}

export class LeaveTypeOnServerCreated implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypeOnServerCreated;
  constructor(public payload: { leaveType: LeaveTypeModel }) {
  }
}

export class LeaveTypeCreated implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypeCreated;

  constructor(public payload: { leaveType: LeaveTypeModel }) {
  }
}

export class LeaveTypeUpdated implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypeUpdated;

  constructor(public payload: {
    partialLeaveType: Update<LeaveTypeModel>, // For State update
    leaveType: LeaveTypeModel // For Server update (through service)
  }) {
  }
}

export class LeaveTypesStatusUpdated implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypesStatusUpdated;

  constructor(public payload: {
    leaveTypes: LeaveTypeModel[],
    status: number
  }) {
  }
}

export class OneLeaveTypeDeleted implements Action {
  readonly type = LeaveTypeActionTypes.OneLeaveTypeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyLeaveTypesDeleted implements Action {
  readonly type = LeaveTypeActionTypes.ManyLeaveTypesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class LeaveTypesPageRequested implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class LeaveTypesPageLoaded implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypesPageLoaded;

  constructor(public payload: { leaveTypes: LeaveTypeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class LeaveTypesPageCancelled implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypesPageCancelled;
}

export class LeaveTypesPageToggleLoading implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class LeaveTypeActionToggleLoading implements Action {
  readonly type = LeaveTypeActionTypes.LeaveTypeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type LeaveTypeActions = LeaveTypeOnServerCreated
| LeaveTypeCreated
| LeaveTypeUpdated
| LeaveTypesStatusUpdated
| OneLeaveTypeDeleted
| ManyLeaveTypesDeleted
| LeaveTypesPageRequested
| LeaveTypesPageLoaded
| LeaveTypesPageCancelled
| LeaveTypesPageToggleLoading
| LeaveTypeActionToggleLoading;
