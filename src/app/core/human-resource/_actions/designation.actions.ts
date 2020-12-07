// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StaffDesignationModel } from '../_models/staff-designation.model';

export enum StaffDesignationActionTypes {
  StaffDesignationOnServerCreated = '[Edit StaffDesignation Dialog] StaffDesignation On Server Created',
  StaffDesignationCreated = '[Edit StaffDesignation Dialog] StaffDesignation Created',
  StaffDesignationUpdated = '[Edit StaffDesignation Dialog] StaffDesignation Updated',
  StaffDesignationsStatusUpdated = '[StaffDesignation List Page] StaffDesignations Status Updated',
  OneStaffDesignationDeleted = '[StaffDesignations List Page] One StaffDesignation Deleted',
  ManyStaffDesignationsDeleted = '[StaffDesignations List Page] Many StaffDesignation Deleted',
  StaffDesignationsPageRequested = '[StaffDesignations List Page] StaffDesignations Page Requested',
  StaffDesignationsPageLoaded = '[StaffDesignations API] StaffDesignations Page Loaded',
  StaffDesignationsPageCancelled = '[StaffDesignations API] StaffDesignations Page Cancelled',
  StaffDesignationsPageToggleLoading = '[StaffDesignations] StaffDesignations Page Toggle Loading',
  StaffDesignationActionToggleLoading = '[StaffDesignations] StaffDesignations Action Toggle Loading'
}

export class StaffDesignationOnServerCreated implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationOnServerCreated;
  constructor(public payload: { staffDesignation: StaffDesignationModel }) {
  }
}

export class StaffDesignationCreated implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationCreated;

  constructor(public payload: { staffDesignation: StaffDesignationModel }) {
  }
}

export class StaffDesignationUpdated implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationUpdated;

  constructor(public payload: {
    partialStaffDesignation: Update<StaffDesignationModel>, // For State update
    staffDesignation: StaffDesignationModel // For Server update (through service)
  }) {
  }
}

export class StaffDesignationsStatusUpdated implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationsStatusUpdated;

  constructor(public payload: {
    staffDesignations: StaffDesignationModel[],
    status: number
  }) {
  }
}

export class OneStaffDesignationDeleted implements Action {
  readonly type = StaffDesignationActionTypes.OneStaffDesignationDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStaffDesignationsDeleted implements Action {
  readonly type = StaffDesignationActionTypes.ManyStaffDesignationsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StaffDesignationsPageRequested implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StaffDesignationsPageLoaded implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationsPageLoaded;

  constructor(public payload: { staffDesignations: StaffDesignationModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StaffDesignationsPageCancelled implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationsPageCancelled;
}

export class StaffDesignationsPageToggleLoading implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StaffDesignationActionToggleLoading implements Action {
  readonly type = StaffDesignationActionTypes.StaffDesignationActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StaffDesignationActions = StaffDesignationOnServerCreated
| StaffDesignationCreated
| StaffDesignationUpdated
| StaffDesignationsStatusUpdated
| OneStaffDesignationDeleted
| ManyStaffDesignationsDeleted
| StaffDesignationsPageRequested
| StaffDesignationsPageLoaded
| StaffDesignationsPageCancelled
| StaffDesignationsPageToggleLoading
| StaffDesignationActionToggleLoading;
