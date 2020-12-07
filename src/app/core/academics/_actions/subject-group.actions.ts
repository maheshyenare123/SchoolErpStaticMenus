// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { SubjectGroupDtoModel } from '../_models/subjectGroupDto.model';

export enum SubjectGroupActionTypes {
  SubjectGroupOnServerCreated = '[Edit SubjectGroup Dialog] SubjectGroup On Server Created',
  SubjectGroupCreated = '[Edit SubjectGroup Dialog] SubjectGroup Created',
  SubjectGroupUpdated = '[Edit SubjectGroup Dialog] SubjectGroup Updated',
  SubjectGroupsStatusUpdated = '[SubjectGroup List Page] SubjectGroups Status Updated',
  OneSubjectGroupDeleted = '[SubjectGroups List Page] One SubjectGroup Deleted',
  ManySubjectGroupsDeleted = '[SubjectGroups List Page] Many SubjectGroup Deleted',
  SubjectGroupsPageRequested = '[SubjectGroups List Page] SubjectGroups Page Requested',
  SubjectGroupsPageLoaded = '[SubjectGroups API] SubjectGroups Page Loaded',
  SubjectGroupsPageCancelled = '[SubjectGroups API] SubjectGroups Page Cancelled',
  SubjectGroupsPageToggleLoading = '[SubjectGroups] SubjectGroups Page Toggle Loading',
  SubjectGroupActionToggleLoading = '[SubjectGroups] SubjectGroups Action Toggle Loading'
}

export class SubjectGroupOnServerCreated implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupOnServerCreated;
  constructor(public payload: { subjectGroup: SubjectGroupDtoModel }) {
  }
}

export class SubjectGroupCreated implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupCreated;

  constructor(public payload: { subjectGroup: SubjectGroupDtoModel }) {
  }
}

export class SubjectGroupUpdated implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupUpdated;

  constructor(public payload: {
    partialSubjectGroup: Update<SubjectGroupDtoModel>, // For State update
    subjectGroup: SubjectGroupDtoModel // For Server update (through service)
  }) {
  }
}

export class SubjectGroupsStatusUpdated implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupsStatusUpdated;

  constructor(public payload: {
    subjectGroups: SubjectGroupDtoModel[],
    status: number
  }) {
  }
}

export class OneSubjectGroupDeleted implements Action {
  readonly type = SubjectGroupActionTypes.OneSubjectGroupDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManySubjectGroupsDeleted implements Action {
  readonly type = SubjectGroupActionTypes.ManySubjectGroupsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class SubjectGroupsPageRequested implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class SubjectGroupsPageLoaded implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupsPageLoaded;

  constructor(public payload: { subjectGroups: SubjectGroupDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class SubjectGroupsPageCancelled implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupsPageCancelled;
}

export class SubjectGroupsPageToggleLoading implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class SubjectGroupActionToggleLoading implements Action {
  readonly type = SubjectGroupActionTypes.SubjectGroupActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type SubjectGroupActions = SubjectGroupOnServerCreated
| SubjectGroupCreated
| SubjectGroupUpdated
| SubjectGroupsStatusUpdated
| OneSubjectGroupDeleted
| ManySubjectGroupsDeleted
| SubjectGroupsPageRequested
| SubjectGroupsPageLoaded
| SubjectGroupsPageCancelled
| SubjectGroupsPageToggleLoading
| SubjectGroupActionToggleLoading;
