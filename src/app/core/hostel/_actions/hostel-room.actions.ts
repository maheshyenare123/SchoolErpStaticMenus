// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { HostelRoomModel } from '../_models/hostel-room.model';

export enum HostelRoomActionTypes {
  HostelRoomOnServerCreated = '[Edit HostelRoom Dialog] HostelRoom On Server Created',
  HostelRoomCreated = '[Edit HostelRoom Dialog] HostelRoom Created',
  HostelRoomUpdated = '[Edit HostelRoom Dialog] HostelRoom Updated',
  HostelRoomsStatusUpdated = '[HostelRoom List Page] HostelRooms Status Updated',
  OneHostelRoomDeleted = '[HostelRooms List Page] One HostelRoom Deleted',
  ManyHostelRoomsDeleted = '[HostelRooms List Page] Many HostelRoom Deleted',
  HostelRoomsPageRequested = '[HostelRooms List Page] HostelRooms Page Requested',
  HostelRoomsPageLoaded = '[HostelRooms API] HostelRooms Page Loaded',
  HostelRoomsPageCancelled = '[HostelRooms API] HostelRooms Page Cancelled',
  HostelRoomsPageToggleLoading = '[HostelRooms] HostelRooms Page Toggle Loading',
  HostelRoomActionToggleLoading = '[HostelRooms] HostelRooms Action Toggle Loading'
}

export class HostelRoomOnServerCreated implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomOnServerCreated;
  constructor(public payload: { hostelRoom: HostelRoomModel }) {
  }
}

export class HostelRoomCreated implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomCreated;

  constructor(public payload: { hostelRoom: HostelRoomModel }) {
  }
}

export class HostelRoomUpdated implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomUpdated;

  constructor(public payload: {
    partialHostelRoom: Update<HostelRoomModel>, // For State update
    hostelRoom: HostelRoomModel // For Server update (through service)
  }) {
  }
}

export class HostelRoomsStatusUpdated implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomsStatusUpdated;

  constructor(public payload: {
    hostelRooms: HostelRoomModel[],
    status: number
  }) {
  }
}

export class OneHostelRoomDeleted implements Action {
  readonly type = HostelRoomActionTypes.OneHostelRoomDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyHostelRoomsDeleted implements Action {
  readonly type = HostelRoomActionTypes.ManyHostelRoomsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class HostelRoomsPageRequested implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class HostelRoomsPageLoaded implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomsPageLoaded;

  constructor(public payload: { hostelRooms: HostelRoomModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class HostelRoomsPageCancelled implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomsPageCancelled;
}

export class HostelRoomsPageToggleLoading implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class HostelRoomActionToggleLoading implements Action {
  readonly type = HostelRoomActionTypes.HostelRoomActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type HostelRoomActions = HostelRoomOnServerCreated
| HostelRoomCreated
| HostelRoomUpdated
| HostelRoomsStatusUpdated
| OneHostelRoomDeleted
| ManyHostelRoomsDeleted
| HostelRoomsPageRequested
| HostelRoomsPageLoaded
| HostelRoomsPageCancelled
| HostelRoomsPageToggleLoading
| HostelRoomActionToggleLoading;
