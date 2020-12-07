// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { RouteModel } from '../_models/route.model';

export enum RouteActionTypes {
  RouteOnServerCreated = '[Edit Route Dialog] Route On Server Created',
  RouteCreated = '[Edit Route Dialog] Route Created',
  RouteUpdated = '[Edit Route Dialog] Route Updated',
  RoutesStatusUpdated = '[Route List Page] Routes Status Updated',
  OneRouteDeleted = '[Routes List Page] One Route Deleted',
  ManyRoutesDeleted = '[Routes List Page] Many Route Deleted',
  RoutesPageRequested = '[Routes List Page] Routes Page Requested',
  RoutesPageLoaded = '[Routes API] Routes Page Loaded',
  RoutesPageCancelled = '[Routes API] Routes Page Cancelled',
  RoutesPageToggleLoading = '[Routes] Routes Page Toggle Loading',
  RouteActionToggleLoading = '[Routes] Routes Action Toggle Loading'
}

export class RouteOnServerCreated implements Action {
  readonly type = RouteActionTypes.RouteOnServerCreated;
  constructor(public payload: { route: RouteModel }) {
  }
}

export class RouteCreated implements Action {
  readonly type = RouteActionTypes.RouteCreated;

  constructor(public payload: { route: RouteModel }) {
  }
}

export class RouteUpdated implements Action {
  readonly type = RouteActionTypes.RouteUpdated;

  constructor(public payload: {
    partialRoute: Update<RouteModel>, // For State update
    route: RouteModel // For Server update (through service)
  }) {
  }
}

export class RoutesStatusUpdated implements Action {
  readonly type = RouteActionTypes.RoutesStatusUpdated;

  constructor(public payload: {
    routes: RouteModel[],
    status: number
  }) {
  }
}

export class OneRouteDeleted implements Action {
  readonly type = RouteActionTypes.OneRouteDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyRoutesDeleted implements Action {
  readonly type = RouteActionTypes.ManyRoutesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class RoutesPageRequested implements Action {
  readonly type = RouteActionTypes.RoutesPageRequested;

  constructor(public payload: { page: QueryParamsModel,searchTerm:any }) {
  }
}

export class RoutesPageLoaded implements Action {
  readonly type = RouteActionTypes.RoutesPageLoaded;

  constructor(public payload: { routes: RouteModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class RoutesPageCancelled implements Action {
  readonly type = RouteActionTypes.RoutesPageCancelled;
}

export class RoutesPageToggleLoading implements Action {
  readonly type = RouteActionTypes.RoutesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class RouteActionToggleLoading implements Action {
  readonly type = RouteActionTypes.RouteActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type RouteActions = RouteOnServerCreated
| RouteCreated
| RouteUpdated
| RoutesStatusUpdated
| OneRouteDeleted
| ManyRoutesDeleted
| RoutesPageRequested
| RoutesPageLoaded
| RoutesPageCancelled
| RoutesPageToggleLoading
| RouteActionToggleLoading;
