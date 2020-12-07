// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { DepartmentModel } from '../_models/department.model';

export enum DepartmentActionTypes {
  DepartmentOnServerCreated = '[Edit Department Dialog] Department On Server Created',
  DepartmentCreated = '[Edit Department Dialog] Department Created',
  DepartmentUpdated = '[Edit Department Dialog] Department Updated',
  DepartmentsStatusUpdated = '[Department List Page] Departments Status Updated',
  OneDepartmentDeleted = '[Departments List Page] One Department Deleted',
  ManyDepartmentsDeleted = '[Departments List Page] Many Department Deleted',
  DepartmentsPageRequested = '[Departments List Page] Departments Page Requested',
  DepartmentsPageLoaded = '[Departments API] Departments Page Loaded',
  DepartmentsPageCancelled = '[Departments API] Departments Page Cancelled',
  DepartmentsPageToggleLoading = '[Departments] Departments Page Toggle Loading',
  DepartmentActionToggleLoading = '[Departments] Departments Action Toggle Loading'
}

export class DepartmentOnServerCreated implements Action {
  readonly type = DepartmentActionTypes.DepartmentOnServerCreated;
  constructor(public payload: { department: DepartmentModel }) {
  }
}

export class DepartmentCreated implements Action {
  readonly type = DepartmentActionTypes.DepartmentCreated;

  constructor(public payload: { department: DepartmentModel }) {
  }
}

export class DepartmentUpdated implements Action {
  readonly type = DepartmentActionTypes.DepartmentUpdated;

  constructor(public payload: {
    partialDepartment: Update<DepartmentModel>, // For State update
    department: DepartmentModel // For Server update (through service)
  }) {
  }
}

export class DepartmentsStatusUpdated implements Action {
  readonly type = DepartmentActionTypes.DepartmentsStatusUpdated;

  constructor(public payload: {
    departments: DepartmentModel[],
    status: number
  }) {
  }
}

export class OneDepartmentDeleted implements Action {
  readonly type = DepartmentActionTypes.OneDepartmentDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyDepartmentsDeleted implements Action {
  readonly type = DepartmentActionTypes.ManyDepartmentsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class DepartmentsPageRequested implements Action {
  readonly type = DepartmentActionTypes.DepartmentsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class DepartmentsPageLoaded implements Action {
  readonly type = DepartmentActionTypes.DepartmentsPageLoaded;

  constructor(public payload: { departments: DepartmentModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class DepartmentsPageCancelled implements Action {
  readonly type = DepartmentActionTypes.DepartmentsPageCancelled;
}

export class DepartmentsPageToggleLoading implements Action {
  readonly type = DepartmentActionTypes.DepartmentsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class DepartmentActionToggleLoading implements Action {
  readonly type = DepartmentActionTypes.DepartmentActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type DepartmentActions = DepartmentOnServerCreated
| DepartmentCreated
| DepartmentUpdated
| DepartmentsStatusUpdated
| OneDepartmentDeleted
| ManyDepartmentsDeleted
| DepartmentsPageRequested
| DepartmentsPageLoaded
| DepartmentsPageCancelled
| DepartmentsPageToggleLoading
| DepartmentActionToggleLoading;
