// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StaffModel } from '../_models/staff.model';

export enum StaffActionTypes {
  StaffOnServerCreated = '[Edit Staff Dialog] Staff On Server Created',
  StaffCreated = '[Edit Staff Dialog] Staff Created',
  StaffUpdated = '[Edit Staff Dialog] Staff Updated',
  StaffsStatusUpdated = '[Staff List Page] Staffs Status Updated',
  OneStaffDeleted = '[Staffs List Page] One Staff Deleted',
  ManyStaffsDeleted = '[Staffs List Page] Many Staff Deleted',
  StaffsPageRequested = '[Staffs List Page] Staffs Page Requested',
  StaffsuserPageRequested = '[Staffs User List Page] Staffs Page Requested',
  ParentsuserPageRequested = '[Parent User List Page] Staffs Page Requested',
  StaffsPageLoaded = '[Staffs API] Staffs Page Loaded',
  StaffsPageCancelled = '[Staffs API] Staffs Page Cancelled',
  StaffsPageToggleLoading = '[Staffs] Staffs Page Toggle Loading',
  StaffActionToggleLoading = '[Staffs] Staffs Action Toggle Loading'
}

export class StaffOnServerCreated implements Action {
  readonly type = StaffActionTypes.StaffOnServerCreated;
  constructor(public payload: { staff: StaffModel }) {
  }
}

export class StaffCreated implements Action {
  readonly type = StaffActionTypes.StaffCreated;

  constructor(public payload: { staff: StaffModel }) {
  }
}

export class StaffUpdated implements Action {
  readonly type = StaffActionTypes.StaffUpdated;

  constructor(public payload: {
    partialStaff: Update<StaffModel>, // For State update
    staff: StaffModel // For Server update (through service)
  }) {
  }
}

export class StaffsStatusUpdated implements Action {
  readonly type = StaffActionTypes.StaffsStatusUpdated;

  constructor(public payload: {
    staffs: StaffModel[],
    status: number
  }) {
  }
}

export class OneStaffDeleted implements Action {
  readonly type = StaffActionTypes.OneStaffDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStaffsDeleted implements Action {
  readonly type = StaffActionTypes.ManyStaffsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StaffsPageRequested implements Action {
  readonly type = StaffActionTypes.StaffsPageRequested;

  constructor(public payload: { page: QueryParamsModel,roleId:number }) {
  }
}

export class StaffsuserPageRequested implements Action {
  readonly type = StaffActionTypes.StaffsuserPageRequested;

  constructor(public payload: { page: QueryParamsModel,role:string }) {
  }
}


export class ParentsuserPageRequested implements Action {
  readonly type = StaffActionTypes.ParentsuserPageRequested;

  constructor(public payload: { page: QueryParamsModel,role:string }) {
  }
}

export class StaffsPageLoaded implements Action {
  readonly type = StaffActionTypes.StaffsPageLoaded;

  constructor(public payload: { staffs: StaffModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StaffsPageCancelled implements Action {
  readonly type = StaffActionTypes.StaffsPageCancelled;
}

export class StaffsPageToggleLoading implements Action {
  readonly type = StaffActionTypes.StaffsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StaffActionToggleLoading implements Action {
  readonly type = StaffActionTypes.StaffActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StaffActions = StaffOnServerCreated
| StaffCreated
| StaffUpdated
| StaffsStatusUpdated
| OneStaffDeleted
| ManyStaffsDeleted
| StaffsPageRequested
| StaffsPageLoaded
| StaffsPageCancelled
| StaffsPageToggleLoading
| StaffActionToggleLoading;
