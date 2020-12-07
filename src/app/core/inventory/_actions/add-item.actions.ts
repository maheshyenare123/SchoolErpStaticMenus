// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AddItemModel } from '../_models/add-item.model';

export enum AddItemActionTypes {
  AddItemOnServerCreated = '[Edit AddItem Dialog] AddItem On Server Created',
  AddItemCreated = '[Edit AddItem Dialog] AddItem Created',
  AddItemUpdated = '[Edit AddItem Dialog] AddItem Updated',
  AddItemsStatusUpdated = '[AddItem List Page] AddItems Status Updated',
  OneAddItemDeleted = '[AddItems List Page] One AddItem Deleted',
  ManyAddItemsDeleted = '[AddItems List Page] Many AddItem Deleted',
  AddItemsPageRequested = '[AddItems List Page] AddItems Page Requested',
  AddItemsPageLoaded = '[AddItems API] AddItems Page Loaded',
  AddItemsPageCancelled = '[AddItems API] AddItems Page Cancelled',
  AddItemsPageToggleLoading = '[AddItems] AddItems Page Toggle Loading',
  AddItemActionToggleLoading = '[AddItems] AddItems Action Toggle Loading'
}

export class AddItemOnServerCreated implements Action {
  readonly type = AddItemActionTypes.AddItemOnServerCreated;
  constructor(public payload: { addItem: AddItemModel }) {
  }
}

export class AddItemCreated implements Action {
  readonly type = AddItemActionTypes.AddItemCreated;

  constructor(public payload: { addItem: AddItemModel }) {
  }
}

export class AddItemUpdated implements Action {
  readonly type = AddItemActionTypes.AddItemUpdated;

  constructor(public payload: {
    partialAddItem: Update<AddItemModel>, // For State update
    addItem: AddItemModel // For Server update (through service)
  }) {
  }
}

export class AddItemsStatusUpdated implements Action {
  readonly type = AddItemActionTypes.AddItemsStatusUpdated;

  constructor(public payload: {
    addItems: AddItemModel[],
    status: number
  }) {
  }
}

export class OneAddItemDeleted implements Action {
  readonly type = AddItemActionTypes.OneAddItemDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyAddItemsDeleted implements Action {
  readonly type = AddItemActionTypes.ManyAddItemsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AddItemsPageRequested implements Action {
  readonly type = AddItemActionTypes.AddItemsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class AddItemsPageLoaded implements Action {
  readonly type = AddItemActionTypes.AddItemsPageLoaded;

  constructor(public payload: { addItems: AddItemModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AddItemsPageCancelled implements Action {
  readonly type = AddItemActionTypes.AddItemsPageCancelled;
}

export class AddItemsPageToggleLoading implements Action {
  readonly type = AddItemActionTypes.AddItemsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AddItemActionToggleLoading implements Action {
  readonly type = AddItemActionTypes.AddItemActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AddItemActions = AddItemOnServerCreated
| AddItemCreated
| AddItemUpdated
| AddItemsStatusUpdated
| OneAddItemDeleted
| ManyAddItemsDeleted
| AddItemsPageRequested
| AddItemsPageLoaded
| AddItemsPageCancelled
| AddItemsPageToggleLoading
| AddItemActionToggleLoading;
