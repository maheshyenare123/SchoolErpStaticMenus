// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StaffPayslipModel } from '../_models/staff-payslip.model';

export enum StaffPayslipActionTypes {
  StaffPayslipOnServerCreated = '[Edit StaffPayslip Dialog] StaffPayslip On Server Created',
  StaffPayslipCreated = '[Edit StaffPayslip Dialog] StaffPayslip Created',
  StaffPayslipUpdated = '[Edit StaffPayslip Dialog] StaffPayslip Updated',
  StaffPayslipsStatusUpdated = '[StaffPayslip List Page] StaffPayslips Status Updated',
  OneStaffPayslipDeleted = '[StaffPayslips List Page] One StaffPayslip Deleted',
  ManyStaffPayslipsDeleted = '[StaffPayslips List Page] Many StaffPayslip Deleted',
  StaffPayslipsPageRequested = '[StaffPayslips List Page] StaffPayslips Page Requested',
  StaffPayslipsPageLoaded = '[StaffPayslips API] StaffPayslips Page Loaded',
  StaffPayslipsPageCancelled = '[StaffPayslips API] StaffPayslips Page Cancelled',
  StaffPayslipsPageToggleLoading = '[StaffPayslips] StaffPayslips Page Toggle Loading',
  StaffPayslipActionToggleLoading = '[StaffPayslips] StaffPayslips Action Toggle Loading'
}

export class StaffPayslipOnServerCreated implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipOnServerCreated;
  constructor(public payload: { staffPayslip: StaffPayslipModel }) {
  }
}

export class StaffPayslipCreated implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipCreated;

  constructor(public payload: { staffPayslip: StaffPayslipModel }) {
  }
}

export class StaffPayslipUpdated implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipUpdated;

  constructor(public payload: {
    partialStaffPayslip: Update<StaffPayslipModel>, // For State update
    staffPayslip: StaffPayslipModel // For Server update (through service)
  }) {
  }
}

export class StaffPayslipsStatusUpdated implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipsStatusUpdated;

  constructor(public payload: {
    staffPayslips: StaffPayslipModel[],
    status: number
  }) {
  }
}

export class OneStaffPayslipDeleted implements Action {
  readonly type = StaffPayslipActionTypes.OneStaffPayslipDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStaffPayslipsDeleted implements Action {
  readonly type = StaffPayslipActionTypes.ManyStaffPayslipsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StaffPayslipsPageRequested implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipsPageRequested;

  constructor(public payload: { page: QueryParamsModel ,roleName:string,month:string,year:string}) {
  }
}

export class StaffPayslipsPageLoaded implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipsPageLoaded;

  constructor(public payload: { staffPayslips: StaffPayslipModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StaffPayslipsPageCancelled implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipsPageCancelled;
}

export class StaffPayslipsPageToggleLoading implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StaffPayslipActionToggleLoading implements Action {
  readonly type = StaffPayslipActionTypes.StaffPayslipActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StaffPayslipActions = StaffPayslipOnServerCreated
| StaffPayslipCreated
| StaffPayslipUpdated
| StaffPayslipsStatusUpdated
| OneStaffPayslipDeleted
| ManyStaffPayslipsDeleted
| StaffPayslipsPageRequested
| StaffPayslipsPageLoaded
| StaffPayslipsPageCancelled
| StaffPayslipsPageToggleLoading
| StaffPayslipActionToggleLoading;
