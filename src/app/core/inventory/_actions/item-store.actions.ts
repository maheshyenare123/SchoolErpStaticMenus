// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ItemStoreModel } from '../_models/item-store.model';

export enum ItemStoreActionTypes {
  ItemStoreOnServerCreated = '[Edit ItemStore Dialog] ItemStore On Server Created',
  ItemStoreCreated = '[Edit ItemStore Dialog] ItemStore Created',
  ItemStoreUpdated = '[Edit ItemStore Dialog] ItemStore Updated',
  ItemStoresStatusUpdated = '[ItemStore List Page] ItemStores Status Updated',
  OneItemStoreDeleted = '[ItemStores List Page] One ItemStore Deleted',
  ManyItemStoresDeleted = '[ItemStores List Page] Many ItemStore Deleted',
  ItemStoresPageRequested = '[ItemStores List Page] ItemStores Page Requested',
  ItemStoresPageLoaded = '[ItemStores API] ItemStores Page Loaded',
  ItemStoresPageCancelled = '[ItemStores API] ItemStores Page Cancelled',
  ItemStoresPageToggleLoading = '[ItemStores] ItemStores Page Toggle Loading',
  ItemStoreActionToggleLoading = '[ItemStores] ItemStores Action Toggle Loading'
}

export class ItemStoreOnServerCreated implements Action {
  readonly type = ItemStoreActionTypes.ItemStoreOnServerCreated;
  constructor(public payload: { itemStore: ItemStoreModel }) {
  }
}

export class ItemStoreCreated implements Action {
  readonly type = ItemStoreActionTypes.ItemStoreCreated;

  constructor(public payload: { itemStore: ItemStoreModel }) {
  }
}

export class ItemStoreUpdated implements Action {
  readonly type = ItemStoreActionTypes.ItemStoreUpdated;

  constructor(public payload: {
    partialItemStore: Update<ItemStoreModel>, // For State update
    itemStore: ItemStoreModel // For Server update (through service)
  }) {
  }
}

export class ItemStoresStatusUpdated implements Action {
  readonly type = ItemStoreActionTypes.ItemStoresStatusUpdated;

  constructor(public payload: {
    itemStores: ItemStoreModel[],
    status: number
  }) {
  }
}

export class OneItemStoreDeleted implements Action {
  readonly type = ItemStoreActionTypes.OneItemStoreDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyItemStoresDeleted implements Action {
  readonly type = ItemStoreActionTypes.ManyItemStoresDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ItemStoresPageRequested implements Action {
  readonly type = ItemStoreActionTypes.ItemStoresPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ItemStoresPageLoaded implements Action {
  readonly type = ItemStoreActionTypes.ItemStoresPageLoaded;

  constructor(public payload: { itemStores: ItemStoreModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ItemStoresPageCancelled implements Action {
  readonly type = ItemStoreActionTypes.ItemStoresPageCancelled;
}

export class ItemStoresPageToggleLoading implements Action {
  readonly type = ItemStoreActionTypes.ItemStoresPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ItemStoreActionToggleLoading implements Action {
  readonly type = ItemStoreActionTypes.ItemStoreActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ItemStoreActions = ItemStoreOnServerCreated
| ItemStoreCreated
| ItemStoreUpdated
| ItemStoresStatusUpdated
| OneItemStoreDeleted
| ManyItemStoresDeleted
| ItemStoresPageRequested
| ItemStoresPageLoaded
| ItemStoresPageCancelled
| ItemStoresPageToggleLoading
| ItemStoreActionToggleLoading;
