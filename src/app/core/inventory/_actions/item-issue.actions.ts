// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ItemIssueModel } from '../_models/item-issue.model';

export enum ItemIssueActionTypes {
  ItemIssueOnServerCreated = '[Edit ItemIssue Dialog] ItemIssue On Server Created',
  ItemIssueCreated = '[Edit ItemIssue Dialog] ItemIssue Created',
  ItemIssueUpdated = '[Edit ItemIssue Dialog] ItemIssue Updated',
  ItemIssuesStatusUpdated = '[ItemIssue List Page] ItemIssues Status Updated',
  OneItemIssueDeleted = '[ItemIssues List Page] One ItemIssue Deleted',
  ManyItemIssuesDeleted = '[ItemIssues List Page] Many ItemIssue Deleted',
  ItemIssuesPageRequested = '[ItemIssues List Page] ItemIssues Page Requested',
  ItemIssuesPageLoaded = '[ItemIssues API] ItemIssues Page Loaded',
  ItemIssuesPageCancelled = '[ItemIssues API] ItemIssues Page Cancelled',
  ItemIssuesPageToggleLoading = '[ItemIssues] ItemIssues Page Toggle Loading',
  ItemIssueActionToggleLoading = '[ItemIssues] ItemIssues Action Toggle Loading'
}

export class ItemIssueOnServerCreated implements Action {
  readonly type = ItemIssueActionTypes.ItemIssueOnServerCreated;
  constructor(public payload: { itemIssue: ItemIssueModel }) {
  }
}

export class ItemIssueCreated implements Action {
  readonly type = ItemIssueActionTypes.ItemIssueCreated;

  constructor(public payload: { itemIssue: ItemIssueModel }) {
  }
}

export class ItemIssueUpdated implements Action {
  readonly type = ItemIssueActionTypes.ItemIssueUpdated;

  constructor(public payload: {
    partialItemIssue: Update<ItemIssueModel>, // For State update
    itemIssue: ItemIssueModel // For Server update (through service)
  }) {
  }
}

export class ItemIssuesStatusUpdated implements Action {
  readonly type = ItemIssueActionTypes.ItemIssuesStatusUpdated;

  constructor(public payload: {
    itemIssues: ItemIssueModel[],
    status: number
  }) {
  }
}

export class OneItemIssueDeleted implements Action {
  readonly type = ItemIssueActionTypes.OneItemIssueDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyItemIssuesDeleted implements Action {
  readonly type = ItemIssueActionTypes.ManyItemIssuesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ItemIssuesPageRequested implements Action {
  readonly type = ItemIssueActionTypes.ItemIssuesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ItemIssuesPageLoaded implements Action {
  readonly type = ItemIssueActionTypes.ItemIssuesPageLoaded;

  constructor(public payload: { itemIssues: ItemIssueModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ItemIssuesPageCancelled implements Action {
  readonly type = ItemIssueActionTypes.ItemIssuesPageCancelled;
}

export class ItemIssuesPageToggleLoading implements Action {
  readonly type = ItemIssueActionTypes.ItemIssuesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ItemIssueActionToggleLoading implements Action {
  readonly type = ItemIssueActionTypes.ItemIssueActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ItemIssueActions = ItemIssueOnServerCreated
| ItemIssueCreated
| ItemIssueUpdated
| ItemIssuesStatusUpdated
| OneItemIssueDeleted
| ManyItemIssuesDeleted
| ItemIssuesPageRequested
| ItemIssuesPageLoaded
| ItemIssuesPageCancelled
| ItemIssuesPageToggleLoading
| ItemIssueActionToggleLoading;
