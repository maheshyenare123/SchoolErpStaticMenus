// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AssignVehicleModel } from '../_models/assign-vehicle.model';

export enum AssignVehicleActionTypes {
  AssignVehicleOnServerCreated = '[Edit AssignVehicle Dialog] AssignVehicle On Server Created',
  AssignVehicleCreated = '[Edit AssignVehicle Dialog] AssignVehicle Created',
  AssignVehicleUpdated = '[Edit AssignVehicle Dialog] AssignVehicle Updated',
  AssignVehiclesStatusUpdated = '[AssignVehicle List Page] AssignVehicles Status Updated',
  OneAssignVehicleDeleted = '[AssignVehicles List Page] One AssignVehicle Deleted',
  ManyAssignVehiclesDeleted = '[AssignVehicles List Page] Many AssignVehicle Deleted',
  AssignVehiclesPageRequested = '[AssignVehicles List Page] AssignVehicles Page Requested',
  AssignVehiclesPageLoaded = '[AssignVehicles API] AssignVehicles Page Loaded',
  AssignVehiclesPageCancelled = '[AssignVehicles API] AssignVehicles Page Cancelled',
  AssignVehiclesPageToggleLoading = '[AssignVehicles] AssignVehicles Page Toggle Loading',
  AssignVehicleActionToggleLoading = '[AssignVehicles] AssignVehicles Action Toggle Loading'
}

export class AssignVehicleOnServerCreated implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehicleOnServerCreated;
  constructor(public payload: { assignVehicle: AssignVehicleModel }) {
  }
}

export class AssignVehicleCreated implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehicleCreated;

  constructor(public payload: { assignVehicle: AssignVehicleModel }) {
  }
}

export class AssignVehicleUpdated implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehicleUpdated;

  constructor(public payload: {
    partialAssignVehicle: Update<AssignVehicleModel>, // For State update
    assignVehicle: AssignVehicleModel // For Server update (through service)
  }) {
  }
}

export class AssignVehiclesStatusUpdated implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehiclesStatusUpdated;

  constructor(public payload: {
    assignVehicles: AssignVehicleModel[],
    status: number
  }) {
  }
}

export class OneAssignVehicleDeleted implements Action {
  readonly type = AssignVehicleActionTypes.OneAssignVehicleDeleted;

  // constructor(public payload: { id: number }) {
  // }

  constructor(public payload: { payloadItem: any }) {
  }

  
}

export class ManyAssignVehiclesDeleted implements Action {
  readonly type = AssignVehicleActionTypes.ManyAssignVehiclesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AssignVehiclesPageRequested implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehiclesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class AssignVehiclesPageLoaded implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehiclesPageLoaded;

  constructor(public payload: { assignVehicles: AssignVehicleModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AssignVehiclesPageCancelled implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehiclesPageCancelled;
}

export class AssignVehiclesPageToggleLoading implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehiclesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AssignVehicleActionToggleLoading implements Action {
  readonly type = AssignVehicleActionTypes.AssignVehicleActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AssignVehicleActions = AssignVehicleOnServerCreated
| AssignVehicleCreated
| AssignVehicleUpdated
| AssignVehiclesStatusUpdated
| OneAssignVehicleDeleted
| ManyAssignVehiclesDeleted
| AssignVehiclesPageRequested
| AssignVehiclesPageLoaded
| AssignVehiclesPageCancelled
| AssignVehiclesPageToggleLoading
| AssignVehicleActionToggleLoading;
