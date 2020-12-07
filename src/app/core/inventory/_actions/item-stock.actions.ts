// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ItemStockModel } from '../_models/item-stock.model';

export enum ItemStockActionTypes {
  ItemStockOnServerCreated = '[Edit ItemStock Dialog] ItemStock On Server Created',
  ItemStockCreated = '[Edit ItemStock Dialog] ItemStock Created',
  ItemStockUpdated = '[Edit ItemStock Dialog] ItemStock Updated',
  ItemStocksStatusUpdated = '[ItemStock List Page] ItemStocks Status Updated',
  OneItemStockDeleted = '[ItemStocks List Page] One ItemStock Deleted',
  ManyItemStocksDeleted = '[ItemStocks List Page] Many ItemStock Deleted',
  ItemStocksPageRequested = '[ItemStocks List Page] ItemStocks Page Requested',
  ItemStocksPageLoaded = '[ItemStocks API] ItemStocks Page Loaded',
  ItemStocksPageCancelled = '[ItemStocks API] ItemStocks Page Cancelled',
  ItemStocksPageToggleLoading = '[ItemStocks] ItemStocks Page Toggle Loading',
  ItemStockActionToggleLoading = '[ItemStocks] ItemStocks Action Toggle Loading'
}

export class ItemStockOnServerCreated implements Action {
  readonly type = ItemStockActionTypes.ItemStockOnServerCreated;
  constructor(public payload: { itemStock: ItemStockModel }) {
  }
}

export class ItemStockCreated implements Action {
  readonly type = ItemStockActionTypes.ItemStockCreated;

  constructor(public payload: { itemStock: ItemStockModel }) {
  }
}

export class ItemStockUpdated implements Action {
  readonly type = ItemStockActionTypes.ItemStockUpdated;

  constructor(public payload: {
    partialItemStock: Update<ItemStockModel>, // For State update
    itemStock: ItemStockModel // For Server update (through service)
  }) {
  }
}

export class ItemStocksStatusUpdated implements Action {
  readonly type = ItemStockActionTypes.ItemStocksStatusUpdated;

  constructor(public payload: {
    itemStocks: ItemStockModel[],
    status: number
  }) {
  }
}

export class OneItemStockDeleted implements Action {
  readonly type = ItemStockActionTypes.OneItemStockDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyItemStocksDeleted implements Action {
  readonly type = ItemStockActionTypes.ManyItemStocksDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ItemStocksPageRequested implements Action {
  readonly type = ItemStockActionTypes.ItemStocksPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ItemStocksPageLoaded implements Action {
  readonly type = ItemStockActionTypes.ItemStocksPageLoaded;

  constructor(public payload: { itemStocks: ItemStockModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ItemStocksPageCancelled implements Action {
  readonly type = ItemStockActionTypes.ItemStocksPageCancelled;
}

export class ItemStocksPageToggleLoading implements Action {
  readonly type = ItemStockActionTypes.ItemStocksPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ItemStockActionToggleLoading implements Action {
  readonly type = ItemStockActionTypes.ItemStockActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ItemStockActions = ItemStockOnServerCreated
| ItemStockCreated
| ItemStockUpdated
| ItemStocksStatusUpdated
| OneItemStockDeleted
| ManyItemStocksDeleted
| ItemStocksPageRequested
| ItemStocksPageLoaded
| ItemStocksPageCancelled
| ItemStocksPageToggleLoading
| ItemStockActionToggleLoading;
