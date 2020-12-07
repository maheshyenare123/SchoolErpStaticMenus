// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StaffAttendanceModel } from '../_models/staff-attendance.model';

export enum StaffAttendanceActionTypes {
  StaffAttendanceOnServerCreated = '[Edit StaffAttendance Dialog] StaffAttendance On Server Created',
  StaffAttendanceCreated = '[Edit StaffAttendance Dialog] StaffAttendance Created',
  StaffAttendanceUpdated = '[Edit StaffAttendance Dialog] StaffAttendance Updated',
  StaffAttendancesStatusUpdated = '[StaffAttendance List Page] StaffAttendances Status Updated',
  OneStaffAttendanceDeleted = '[StaffAttendances List Page] One StaffAttendance Deleted',
  ManyStaffAttendancesDeleted = '[StaffAttendances List Page] Many StaffAttendance Deleted',
  StaffAttendancesPageRequested = '[StaffAttendances List Page] StaffAttendances Page Requested',
  StaffAttendancesPageLoaded = '[StaffAttendances API] StaffAttendances Page Loaded',
  StaffAttendancesPageCancelled = '[StaffAttendances API] StaffAttendances Page Cancelled',
  StaffAttendancesPageToggleLoading = '[StaffAttendances] StaffAttendances Page Toggle Loading',
  StaffAttendanceActionToggleLoading = '[StaffAttendances] StaffAttendances Action Toggle Loading'
}

export class StaffAttendanceOnServerCreated implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendanceOnServerCreated;
  constructor(public payload: { staffAttendance: StaffAttendanceModel }) {
  }
}

export class StaffAttendanceCreated implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendanceCreated;

  constructor(public payload: { staffAttendance: StaffAttendanceModel }) {
  }
}

export class StaffAttendanceUpdated implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendanceUpdated;

  constructor(public payload: {
    partialStaffAttendance: Update<StaffAttendanceModel>, // For State update
    staffAttendance: StaffAttendanceModel // For Server update (through service)
  }) {
  }
}

export class StaffAttendancesStatusUpdated implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendancesStatusUpdated;

  constructor(public payload: {
    staffAttendances: StaffAttendanceModel[],
    status: number
  }) {
  }
}

export class OneStaffAttendanceDeleted implements Action {
  readonly type = StaffAttendanceActionTypes.OneStaffAttendanceDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStaffAttendancesDeleted implements Action {
  readonly type = StaffAttendanceActionTypes.ManyStaffAttendancesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StaffAttendancesPageRequested implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendancesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StaffAttendancesPageLoaded implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendancesPageLoaded;

  constructor(public payload: { staffAttendances: StaffAttendanceModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StaffAttendancesPageCancelled implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendancesPageCancelled;
}

export class StaffAttendancesPageToggleLoading implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendancesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StaffAttendanceActionToggleLoading implements Action {
  readonly type = StaffAttendanceActionTypes.StaffAttendanceActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StaffAttendanceActions = StaffAttendanceOnServerCreated
| StaffAttendanceCreated
| StaffAttendanceUpdated
| StaffAttendancesStatusUpdated
| OneStaffAttendanceDeleted
| ManyStaffAttendancesDeleted
| StaffAttendancesPageRequested
| StaffAttendancesPageLoaded
| StaffAttendancesPageCancelled
| StaffAttendancesPageToggleLoading
| StaffAttendanceActionToggleLoading;
