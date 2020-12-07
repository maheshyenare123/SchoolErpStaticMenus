// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { RoomTypeModel } from '../_models/room-type.model';

export enum RoomTypeActionTypes {
  RoomTypeOnServerCreated = '[Edit RoomType Dialog] RoomType On Server Created',
  RoomTypeCreated = '[Edit RoomType Dialog] RoomType Created',
  RoomTypeUpdated = '[Edit RoomType Dialog] RoomType Updated',
  RoomTypesStatusUpdated = '[RoomType List Page] RoomTypes Status Updated',
  OneRoomTypeDeleted = '[RoomTypes List Page] One RoomType Deleted',
  ManyRoomTypesDeleted = '[RoomTypes List Page] Many RoomType Deleted',
  RoomTypesPageRequested = '[RoomTypes List Page] RoomTypes Page Requested',
  RoomTypesPageLoaded = '[RoomTypes API] RoomTypes Page Loaded',
  RoomTypesPageCancelled = '[RoomTypes API] RoomTypes Page Cancelled',
  RoomTypesPageToggleLoading = '[RoomTypes] RoomTypes Page Toggle Loading',
  RoomTypeActionToggleLoading = '[RoomTypes] RoomTypes Action Toggle Loading'
}

export class RoomTypeOnServerCreated implements Action {
  readonly type = RoomTypeActionTypes.RoomTypeOnServerCreated;
  constructor(public payload: { roomType: RoomTypeModel }) {
  }
}

export class RoomTypeCreated implements Action {
  readonly type = RoomTypeActionTypes.RoomTypeCreated;

  constructor(public payload: { roomType: RoomTypeModel }) {
  }
}

export class RoomTypeUpdated implements Action {
  readonly type = RoomTypeActionTypes.RoomTypeUpdated;

  constructor(public payload: {
    partialRoomType: Update<RoomTypeModel>, // For State update
    roomType: RoomTypeModel // For Server update (through service)
  }) {
  }
}

export class RoomTypesStatusUpdated implements Action {
  readonly type = RoomTypeActionTypes.RoomTypesStatusUpdated;

  constructor(public payload: {
    roomTypes: RoomTypeModel[],
    status: number
  }) {
  }
}

export class OneRoomTypeDeleted implements Action {
  readonly type = RoomTypeActionTypes.OneRoomTypeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyRoomTypesDeleted implements Action {
  readonly type = RoomTypeActionTypes.ManyRoomTypesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class RoomTypesPageRequested implements Action {
  readonly type = RoomTypeActionTypes.RoomTypesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class RoomTypesPageLoaded implements Action {
  readonly type = RoomTypeActionTypes.RoomTypesPageLoaded;

  constructor(public payload: { roomTypes: RoomTypeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class RoomTypesPageCancelled implements Action {
  readonly type = RoomTypeActionTypes.RoomTypesPageCancelled;
}

export class RoomTypesPageToggleLoading implements Action {
  readonly type = RoomTypeActionTypes.RoomTypesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class RoomTypeActionToggleLoading implements Action {
  readonly type = RoomTypeActionTypes.RoomTypeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type RoomTypeActions = RoomTypeOnServerCreated
| RoomTypeCreated
| RoomTypeUpdated
| RoomTypesStatusUpdated
| OneRoomTypeDeleted
| ManyRoomTypesDeleted
| RoomTypesPageRequested
| RoomTypesPageLoaded
| RoomTypesPageCancelled
| RoomTypesPageToggleLoading
| RoomTypeActionToggleLoading;
