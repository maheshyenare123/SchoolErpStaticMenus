// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';

export enum OnlineAdmissionActionTypes {
  OnlineAdmissionOnServerCreated = '[Edit OnlineAdmission Dialog] OnlineAdmission On Server Created',
  OnlineAdmissionCreated = '[Edit OnlineAdmission Dialog] OnlineAdmission Created',
  OnlineAdmissionUpdated = '[Edit OnlineAdmission Dialog] OnlineAdmission Updated',
  OnlineAdmissionsStatusUpdated = '[OnlineAdmission List Page] OnlineAdmissions Status Updated',
  OneOnlineAdmissionDeleted = '[OnlineAdmissions List Page] One OnlineAdmission Deleted',
  ManyOnlineAdmissionsDeleted = '[OnlineAdmissions List Page] Many OnlineAdmission Deleted',
  OnlineAdmissionsPageRequested = '[OnlineAdmissions List Page] OnlineAdmissions Page Requested',
  OnlineAdmissionsPageLoaded = '[OnlineAdmissions API] OnlineAdmissions Page Loaded',
  OnlineAdmissionsPageCancelled = '[OnlineAdmissions API] OnlineAdmissions Page Cancelled',
  OnlineAdmissionsPageToggleLoading = '[OnlineAdmissions] OnlineAdmissions Page Toggle Loading',
  OnlineAdmissionActionToggleLoading = '[OnlineAdmissions] OnlineAdmissions Action Toggle Loading'
}

export class OnlineAdmissionOnServerCreated implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionOnServerCreated;
  constructor(public payload: { onlineAdmission: StudentDtoModel }) {
  }
}

export class OnlineAdmissionCreated implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionCreated;

  constructor(public payload: { onlineAdmission: StudentDtoModel }) {
  }
}

export class OnlineAdmissionUpdated implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionUpdated;

  constructor(public payload: {
    partialOnlineAdmission: Update<StudentDtoModel>, // For State update
    onlineAdmission: StudentDtoModel // For Server update (through service)
  }) {
  }
}

export class OnlineAdmissionsStatusUpdated implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionsStatusUpdated;

  constructor(public payload: {
    onlineAdmissions: StudentDtoModel[],
    status: number
  }) {
  }
}

export class OneOnlineAdmissionDeleted implements Action {
  readonly type = OnlineAdmissionActionTypes.OneOnlineAdmissionDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyOnlineAdmissionsDeleted implements Action {
  readonly type = OnlineAdmissionActionTypes.ManyOnlineAdmissionsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class OnlineAdmissionsPageRequested implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class OnlineAdmissionsPageLoaded implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionsPageLoaded;

  constructor(public payload: { onlineAdmissions: StudentDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class OnlineAdmissionsPageCancelled implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionsPageCancelled;
}

export class OnlineAdmissionsPageToggleLoading implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class OnlineAdmissionActionToggleLoading implements Action {
  readonly type = OnlineAdmissionActionTypes.OnlineAdmissionActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type OnlineAdmissionActions = OnlineAdmissionOnServerCreated
| OnlineAdmissionCreated
| OnlineAdmissionUpdated
| OnlineAdmissionsStatusUpdated
| OneOnlineAdmissionDeleted
| ManyOnlineAdmissionsDeleted
| OnlineAdmissionsPageRequested
| OnlineAdmissionsPageLoaded
| OnlineAdmissionsPageCancelled
| OnlineAdmissionsPageToggleLoading
| OnlineAdmissionActionToggleLoading;
