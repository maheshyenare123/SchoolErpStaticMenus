// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { FeesGroupModel } from '../_models/fees-group.model';

export enum FeesGroupActionTypes {
  FeesGroupOnServerCreated = '[Edit FeesGroup Dialog] FeesGroup On Server Created',
  FeesGroupCreated = '[Edit FeesGroup Dialog] FeesGroup Created',
  FeesGroupUpdated = '[Edit FeesGroup Dialog] FeesGroup Updated',
  FeesGroupsStatusUpdated = '[FeesGroup List Page] FeesGroups Status Updated',
  OneFeesGroupDeleted = '[FeesGroups List Page] One FeesGroup Deleted',
  ManyFeesGroupsDeleted = '[FeesGroups List Page] Many FeesGroup Deleted',
  FeesGroupsPageRequested = '[FeesGroups List Page] FeesGroups Page Requested',
  FeesGroupsPageLoaded = '[FeesGroups API] FeesGroups Page Loaded',
  FeesGroupsPageCancelled = '[FeesGroups API] FeesGroups Page Cancelled',
  FeesGroupsPageToggleLoading = '[FeesGroups] FeesGroups Page Toggle Loading',
  FeesGroupActionToggleLoading = '[FeesGroups] FeesGroups Action Toggle Loading'
}

export class FeesGroupOnServerCreated implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupOnServerCreated;
  constructor(public payload: { feesGroup: FeesGroupModel }) {
  }
}

export class FeesGroupCreated implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupCreated;

  constructor(public payload: { feesGroup: FeesGroupModel }) {
  }
}

export class FeesGroupUpdated implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupUpdated;

  constructor(public payload: {
    partialFeesGroup: Update<FeesGroupModel>, // For State update
    feesGroup: FeesGroupModel // For Server update (through service)
  }) {
  }
}

export class FeesGroupsStatusUpdated implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupsStatusUpdated;

  constructor(public payload: {
    feesGroups: FeesGroupModel[],
    status: number
  }) {
  }
}

export class OneFeesGroupDeleted implements Action {
  readonly type = FeesGroupActionTypes.OneFeesGroupDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyFeesGroupsDeleted implements Action {
  readonly type = FeesGroupActionTypes.ManyFeesGroupsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class FeesGroupsPageRequested implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class FeesGroupsPageLoaded implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupsPageLoaded;

  constructor(public payload: { feesGroups: FeesGroupModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class FeesGroupsPageCancelled implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupsPageCancelled;
}

export class FeesGroupsPageToggleLoading implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class FeesGroupActionToggleLoading implements Action {
  readonly type = FeesGroupActionTypes.FeesGroupActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type FeesGroupActions = FeesGroupOnServerCreated
| FeesGroupCreated
| FeesGroupUpdated
| FeesGroupsStatusUpdated
| OneFeesGroupDeleted
| ManyFeesGroupsDeleted
| FeesGroupsPageRequested
| FeesGroupsPageLoaded
| FeesGroupsPageCancelled
| FeesGroupsPageToggleLoading
| FeesGroupActionToggleLoading;
