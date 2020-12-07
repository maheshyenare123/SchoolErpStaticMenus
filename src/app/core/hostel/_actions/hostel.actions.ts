// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { HostelModel } from '../_models/hostel.model';

export enum HostelActionTypes {
  HostelOnServerCreated = '[Edit Hostel Dialog] Hostel On Server Created',
  HostelCreated = '[Edit Hostel Dialog] Hostel Created',
  HostelUpdated = '[Edit Hostel Dialog] Hostel Updated',
  HostelsStatusUpdated = '[Hostel List Page] Hostels Status Updated',
  OneHostelDeleted = '[Hostels List Page] One Hostel Deleted',
  ManyHostelsDeleted = '[Hostels List Page] Many Hostel Deleted',
  HostelsPageRequested = '[Hostels List Page] Hostels Page Requested',
  HostelsPageLoaded = '[Hostels API] Hostels Page Loaded',
  HostelsPageCancelled = '[Hostels API] Hostels Page Cancelled',
  HostelsPageToggleLoading = '[Hostels] Hostels Page Toggle Loading',
  HostelActionToggleLoading = '[Hostels] Hostels Action Toggle Loading'
}

export class HostelOnServerCreated implements Action {
  readonly type = HostelActionTypes.HostelOnServerCreated;
  constructor(public payload: { hostel: HostelModel }) {
  }
}

export class HostelCreated implements Action {
  readonly type = HostelActionTypes.HostelCreated;

  constructor(public payload: { hostel: HostelModel }) {
  }
}

export class HostelUpdated implements Action {
  readonly type = HostelActionTypes.HostelUpdated;

  constructor(public payload: {
    partialHostel: Update<HostelModel>, // For State update
    hostel: HostelModel // For Server update (through service)
  }) {
  }
}

export class HostelsStatusUpdated implements Action {
  readonly type = HostelActionTypes.HostelsStatusUpdated;

  constructor(public payload: {
    hostels: HostelModel[],
    status: number
  }) {
  }
}

export class OneHostelDeleted implements Action {
  readonly type = HostelActionTypes.OneHostelDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyHostelsDeleted implements Action {
  readonly type = HostelActionTypes.ManyHostelsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class HostelsPageRequested implements Action {
  readonly type = HostelActionTypes.HostelsPageRequested;

  constructor(public payload: { page: QueryParamsModel,searchTerm:any }) {
  }
}

export class HostelsPageLoaded implements Action {
  readonly type = HostelActionTypes.HostelsPageLoaded;

  constructor(public payload: { hostels: HostelModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class HostelsPageCancelled implements Action {
  readonly type = HostelActionTypes.HostelsPageCancelled;
}

export class HostelsPageToggleLoading implements Action {
  readonly type = HostelActionTypes.HostelsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class HostelActionToggleLoading implements Action {
  readonly type = HostelActionTypes.HostelActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type HostelActions = HostelOnServerCreated
| HostelCreated
| HostelUpdated
| HostelsStatusUpdated
| OneHostelDeleted
| ManyHostelsDeleted
| HostelsPageRequested
| HostelsPageLoaded
| HostelsPageCancelled
| HostelsPageToggleLoading
| HostelActionToggleLoading;
