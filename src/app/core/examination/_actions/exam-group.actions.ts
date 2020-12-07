// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ExamGroupModel } from '../_models/exam-group.model';

export enum ExamGroupActionTypes {
  ExamGroupOnServerCreated = '[Edit ExamGroup Dialog] ExamGroup On Server Created',
  ExamGroupCreated = '[Edit ExamGroup Dialog] ExamGroup Created',
  ExamGroupUpdated = '[Edit ExamGroup Dialog] ExamGroup Updated',
  ExamGroupsStatusUpdated = '[ExamGroup List Page] ExamGroups Status Updated',
  OneExamGroupDeleted = '[ExamGroups List Page] One ExamGroup Deleted',
  ManyExamGroupsDeleted = '[ExamGroups List Page] Many ExamGroup Deleted',
  ExamGroupsPageRequested = '[ExamGroups List Page] ExamGroups Page Requested',
  ExamGroupsPageLoaded = '[ExamGroups API] ExamGroups Page Loaded',
  ExamGroupsPageCancelled = '[ExamGroups API] ExamGroups Page Cancelled',
  ExamGroupsPageToggleLoading = '[ExamGroups] ExamGroups Page Toggle Loading',
  ExamGroupActionToggleLoading = '[ExamGroups] ExamGroups Action Toggle Loading'
}

export class ExamGroupOnServerCreated implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupOnServerCreated;
  constructor(public payload: { examGroup: ExamGroupModel }) {
  }
}

export class ExamGroupCreated implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupCreated;

  constructor(public payload: { examGroup: ExamGroupModel }) {
  }
}

export class ExamGroupUpdated implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupUpdated;

  constructor(public payload: {
    partialExamGroup: Update<ExamGroupModel>, // For State update
    examGroup: ExamGroupModel // For Server update (through service)
  }) {
  }
}

export class ExamGroupsStatusUpdated implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupsStatusUpdated;

  constructor(public payload: {
    examGroups: ExamGroupModel[],
    status: number
  }) {
  }
}

export class OneExamGroupDeleted implements Action {
  readonly type = ExamGroupActionTypes.OneExamGroupDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyExamGroupsDeleted implements Action {
  readonly type = ExamGroupActionTypes.ManyExamGroupsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ExamGroupsPageRequested implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ExamGroupsPageLoaded implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupsPageLoaded;

  constructor(public payload: { examGroups: ExamGroupModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ExamGroupsPageCancelled implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupsPageCancelled;
}

export class ExamGroupsPageToggleLoading implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ExamGroupActionToggleLoading implements Action {
  readonly type = ExamGroupActionTypes.ExamGroupActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ExamGroupActions = ExamGroupOnServerCreated
| ExamGroupCreated
| ExamGroupUpdated
| ExamGroupsStatusUpdated
| OneExamGroupDeleted
| ManyExamGroupsDeleted
| ExamGroupsPageRequested
| ExamGroupsPageLoaded
| ExamGroupsPageCancelled
| ExamGroupsPageToggleLoading
| ExamGroupActionToggleLoading;
