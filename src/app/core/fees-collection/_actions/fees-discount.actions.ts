// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { FeesDiscountModel } from '../_models/fees-discount.model';

export enum FeesDiscountActionTypes {
  FeesDiscountOnServerCreated = '[Edit FeesDiscount Dialog] FeesDiscount On Server Created',
  FeesDiscountCreated = '[Edit FeesDiscount Dialog] FeesDiscount Created',
  FeesDiscountUpdated = '[Edit FeesDiscount Dialog] FeesDiscount Updated',
  FeesDiscountsStatusUpdated = '[FeesDiscount List Page] FeesDiscounts Status Updated',
  OneFeesDiscountDeleted = '[FeesDiscounts List Page] One FeesDiscount Deleted',
  ManyFeesDiscountsDeleted = '[FeesDiscounts List Page] Many FeesDiscount Deleted',
  FeesDiscountsPageRequested = '[FeesDiscounts List Page] FeesDiscounts Page Requested',
  FeesDiscountsPageLoaded = '[FeesDiscounts API] FeesDiscounts Page Loaded',
  FeesDiscountsPageCancelled = '[FeesDiscounts API] FeesDiscounts Page Cancelled',
  FeesDiscountsPageToggleLoading = '[FeesDiscounts] FeesDiscounts Page Toggle Loading',
  FeesDiscountActionToggleLoading = '[FeesDiscounts] FeesDiscounts Action Toggle Loading'
}

export class FeesDiscountOnServerCreated implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountOnServerCreated;
  constructor(public payload: { feesDiscount: FeesDiscountModel }) {
  }
}

export class FeesDiscountCreated implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountCreated;

  constructor(public payload: { feesDiscount: FeesDiscountModel }) {
  }
}

export class FeesDiscountUpdated implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountUpdated;

  constructor(public payload: {
    partialFeesDiscount: Update<FeesDiscountModel>, // For State update
    feesDiscount: FeesDiscountModel // For Server update (through service)
  }) {
  }
}

export class FeesDiscountsStatusUpdated implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountsStatusUpdated;

  constructor(public payload: {
    feesDiscounts: FeesDiscountModel[],
    status: number
  }) {
  }
}

export class OneFeesDiscountDeleted implements Action {
  readonly type = FeesDiscountActionTypes.OneFeesDiscountDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyFeesDiscountsDeleted implements Action {
  readonly type = FeesDiscountActionTypes.ManyFeesDiscountsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class FeesDiscountsPageRequested implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class FeesDiscountsPageLoaded implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountsPageLoaded;

  constructor(public payload: { feesDiscounts: FeesDiscountModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class FeesDiscountsPageCancelled implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountsPageCancelled;
}

export class FeesDiscountsPageToggleLoading implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class FeesDiscountActionToggleLoading implements Action {
  readonly type = FeesDiscountActionTypes.FeesDiscountActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type FeesDiscountActions = FeesDiscountOnServerCreated
| FeesDiscountCreated
| FeesDiscountUpdated
| FeesDiscountsStatusUpdated
| OneFeesDiscountDeleted
| ManyFeesDiscountsDeleted
| FeesDiscountsPageRequested
| FeesDiscountsPageLoaded
| FeesDiscountsPageCancelled
| FeesDiscountsPageToggleLoading
| FeesDiscountActionToggleLoading;
