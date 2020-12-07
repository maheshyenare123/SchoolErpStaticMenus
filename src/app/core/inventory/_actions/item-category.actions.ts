// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ItemCategoryModel } from '../_models/item-category.model';

export enum ItemCategoryActionTypes {
  ItemCategoryOnServerCreated = '[Edit ItemCategory Dialog] ItemCategory On Server Created',
  ItemCategoryCreated = '[Edit ItemCategory Dialog] ItemCategory Created',
  ItemCategoryUpdated = '[Edit ItemCategory Dialog] ItemCategory Updated',
  ItemCategorysStatusUpdated = '[ItemCategory List Page] ItemCategorys Status Updated',
  OneItemCategoryDeleted = '[ItemCategorys List Page] One ItemCategory Deleted',
  ManyItemCategorysDeleted = '[ItemCategorys List Page] Many ItemCategory Deleted',
  ItemCategorysPageRequested = '[ItemCategorys List Page] ItemCategorys Page Requested',
  ItemCategorysPageLoaded = '[ItemCategorys API] ItemCategorys Page Loaded',
  ItemCategorysPageCancelled = '[ItemCategorys API] ItemCategorys Page Cancelled',
  ItemCategorysPageToggleLoading = '[ItemCategorys] ItemCategorys Page Toggle Loading',
  ItemCategoryActionToggleLoading = '[ItemCategorys] ItemCategorys Action Toggle Loading'
}

export class ItemCategoryOnServerCreated implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategoryOnServerCreated;
  constructor(public payload: { itemCategory: ItemCategoryModel }) {
  }
}

export class ItemCategoryCreated implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategoryCreated;

  constructor(public payload: { itemCategory: ItemCategoryModel }) {
  }
}

export class ItemCategoryUpdated implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategoryUpdated;

  constructor(public payload: {
    partialItemCategory: Update<ItemCategoryModel>, // For State update
    itemCategory: ItemCategoryModel // For Server update (through service)
  }) {
  }
}

export class ItemCategorysStatusUpdated implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategorysStatusUpdated;

  constructor(public payload: {
    itemCategorys: ItemCategoryModel[],
    status: number
  }) {
  }
}

export class OneItemCategoryDeleted implements Action {
  readonly type = ItemCategoryActionTypes.OneItemCategoryDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyItemCategorysDeleted implements Action {
  readonly type = ItemCategoryActionTypes.ManyItemCategorysDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ItemCategorysPageRequested implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategorysPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ItemCategorysPageLoaded implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategorysPageLoaded;

  constructor(public payload: { itemCategorys: ItemCategoryModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ItemCategorysPageCancelled implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategorysPageCancelled;
}

export class ItemCategorysPageToggleLoading implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategorysPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ItemCategoryActionToggleLoading implements Action {
  readonly type = ItemCategoryActionTypes.ItemCategoryActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ItemCategoryActions = ItemCategoryOnServerCreated
| ItemCategoryCreated
| ItemCategoryUpdated
| ItemCategorysStatusUpdated
| OneItemCategoryDeleted
| ManyItemCategorysDeleted
| ItemCategorysPageRequested
| ItemCategorysPageLoaded
| ItemCategorysPageCancelled
| ItemCategorysPageToggleLoading
| ItemCategoryActionToggleLoading;
