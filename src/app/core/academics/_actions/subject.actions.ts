// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { SubjectDtoModel } from '../_models/subjectDto.model';

export enum SubjectActionTypes {
  SubjectOnServerCreated = '[Edit Subject Dialog] Subject On Server Created',
  SubjectCreated = '[Edit Subject Dialog] Subject Created',
  SubjectUpdated = '[Edit Subject Dialog] Subject Updated',
  SubjectsStatusUpdated = '[Subject List Page] Subjects Status Updated',
  OneSubjectDeleted = '[Subjects List Page] One Subject Deleted',
  ManySubjectsDeleted = '[Subjects List Page] Many Subject Deleted',
  SubjectsPageRequested = '[Subjects List Page] Subjects Page Requested',
  SubjectsPageLoaded = '[Subjects API] Subjects Page Loaded',
  SubjectsPageCancelled = '[Subjects API] Subjects Page Cancelled',
  SubjectsPageToggleLoading = '[Subjects] Subjects Page Toggle Loading',
  SubjectActionToggleLoading = '[Subjects] Subjects Action Toggle Loading'
}

export class SubjectOnServerCreated implements Action {
  readonly type = SubjectActionTypes.SubjectOnServerCreated;
  constructor(public payload: { subject: SubjectDtoModel }) {
  }
}

export class SubjectCreated implements Action {
  readonly type = SubjectActionTypes.SubjectCreated;

  constructor(public payload: { subject: SubjectDtoModel }) {
  }
}

export class SubjectUpdated implements Action {
  readonly type = SubjectActionTypes.SubjectUpdated;

  constructor(public payload: {
    partialSubject: Update<SubjectDtoModel>, // For State update
    subject: SubjectDtoModel // For Server update (through service)
  }) {
  }
}

export class SubjectsStatusUpdated implements Action {
  readonly type = SubjectActionTypes.SubjectsStatusUpdated;

  constructor(public payload: {
    subjects: SubjectDtoModel[],
    status: number
  }) {
  }
}

export class OneSubjectDeleted implements Action {
  readonly type = SubjectActionTypes.OneSubjectDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManySubjectsDeleted implements Action {
  readonly type = SubjectActionTypes.ManySubjectsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class SubjectsPageRequested implements Action {
  readonly type = SubjectActionTypes.SubjectsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class SubjectsPageLoaded implements Action {
  readonly type = SubjectActionTypes.SubjectsPageLoaded;

  constructor(public payload: { subjects: SubjectDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class SubjectsPageCancelled implements Action {
  readonly type = SubjectActionTypes.SubjectsPageCancelled;
}

export class SubjectsPageToggleLoading implements Action {
  readonly type = SubjectActionTypes.SubjectsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class SubjectActionToggleLoading implements Action {
  readonly type = SubjectActionTypes.SubjectActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type SubjectActions = SubjectOnServerCreated
| SubjectCreated
| SubjectUpdated
| SubjectsStatusUpdated
| OneSubjectDeleted
| ManySubjectsDeleted
| SubjectsPageRequested
| SubjectsPageLoaded
| SubjectsPageCancelled
| SubjectsPageToggleLoading
| SubjectActionToggleLoading;
