// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ItemSupplierModel } from '../_models/item-supplier.model';

export enum ItemSupplierActionTypes {
  ItemSupplierOnServerCreated = '[Edit ItemSupplier Dialog] ItemSupplier On Server Created',
  ItemSupplierCreated = '[Edit ItemSupplier Dialog] ItemSupplier Created',
  ItemSupplierUpdated = '[Edit ItemSupplier Dialog] ItemSupplier Updated',
  ItemSuppliersStatusUpdated = '[ItemSupplier List Page] ItemSuppliers Status Updated',
  OneItemSupplierDeleted = '[ItemSuppliers List Page] One ItemSupplier Deleted',
  ManyItemSuppliersDeleted = '[ItemSuppliers List Page] Many ItemSupplier Deleted',
  ItemSuppliersPageRequested = '[ItemSuppliers List Page] ItemSuppliers Page Requested',
  ItemSuppliersPageLoaded = '[ItemSuppliers API] ItemSuppliers Page Loaded',
  ItemSuppliersPageCancelled = '[ItemSuppliers API] ItemSuppliers Page Cancelled',
  ItemSuppliersPageToggleLoading = '[ItemSuppliers] ItemSuppliers Page Toggle Loading',
  ItemSupplierActionToggleLoading = '[ItemSuppliers] ItemSuppliers Action Toggle Loading'
}

export class ItemSupplierOnServerCreated implements Action {
  readonly type = ItemSupplierActionTypes.ItemSupplierOnServerCreated;
  constructor(public payload: { itemSupplier: ItemSupplierModel }) {
  }
}

export class ItemSupplierCreated implements Action {
  readonly type = ItemSupplierActionTypes.ItemSupplierCreated;

  constructor(public payload: { itemSupplier: ItemSupplierModel }) {
  }
}

export class ItemSupplierUpdated implements Action {
  readonly type = ItemSupplierActionTypes.ItemSupplierUpdated;

  constructor(public payload: {
    partialItemSupplier: Update<ItemSupplierModel>, // For State update
    itemSupplier: ItemSupplierModel // For Server update (through service)
  }) {
  }
}

export class ItemSuppliersStatusUpdated implements Action {
  readonly type = ItemSupplierActionTypes.ItemSuppliersStatusUpdated;

  constructor(public payload: {
    itemSuppliers: ItemSupplierModel[],
    status: number
  }) {
  }
}

export class OneItemSupplierDeleted implements Action {
  readonly type = ItemSupplierActionTypes.OneItemSupplierDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyItemSuppliersDeleted implements Action {
  readonly type = ItemSupplierActionTypes.ManyItemSuppliersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ItemSuppliersPageRequested implements Action {
  readonly type = ItemSupplierActionTypes.ItemSuppliersPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ItemSuppliersPageLoaded implements Action {
  readonly type = ItemSupplierActionTypes.ItemSuppliersPageLoaded;

  constructor(public payload: { itemSuppliers: ItemSupplierModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ItemSuppliersPageCancelled implements Action {
  readonly type = ItemSupplierActionTypes.ItemSuppliersPageCancelled;
}

export class ItemSuppliersPageToggleLoading implements Action {
  readonly type = ItemSupplierActionTypes.ItemSuppliersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ItemSupplierActionToggleLoading implements Action {
  readonly type = ItemSupplierActionTypes.ItemSupplierActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ItemSupplierActions = ItemSupplierOnServerCreated
| ItemSupplierCreated
| ItemSupplierUpdated
| ItemSuppliersStatusUpdated
| OneItemSupplierDeleted
| ManyItemSuppliersDeleted
| ItemSuppliersPageRequested
| ItemSuppliersPageLoaded
| ItemSuppliersPageCancelled
| ItemSuppliersPageToggleLoading
| ItemSupplierActionToggleLoading;
