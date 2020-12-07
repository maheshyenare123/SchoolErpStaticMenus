// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ExamSubjectDtoModel } from '../_models/exam-subject-dto.model';

export enum ExamSubjectActionTypes {
  ExamSubjectOnServerCreated = '[Edit ExamSubject Dialog] ExamSubject On Server Created',
  ExamSubjectCreated = '[Edit ExamSubject Dialog] ExamSubject Created',
  ExamSubjectUpdated = '[Edit ExamSubject Dialog] ExamSubject Updated',
  ExamSubjectsStatusUpdated = '[ExamSubject List Page] ExamSubjects Status Updated',
  OneExamSubjectDeleted = '[ExamSubjects List Page] One ExamSubject Deleted',
  ManyExamSubjectsDeleted = '[ExamSubjects List Page] Many ExamSubject Deleted',
  ExamSubjectsPageRequested = '[ExamSubjects List Page] ExamSubjects Page Requested',
  ExamSubjectsPageLoaded = '[ExamSubjects API] ExamSubjects Page Loaded',
  ExamSubjectsPageCancelled = '[ExamSubjects API] ExamSubjects Page Cancelled',
  ExamSubjectsPageToggleLoading = '[ExamSubjects] ExamSubjects Page Toggle Loading',
  ExamSubjectActionToggleLoading = '[ExamSubjects] ExamSubjects Action Toggle Loading'
}

export class ExamSubjectOnServerCreated implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectOnServerCreated;
  constructor(public payload: { examSubject: ExamSubjectDtoModel }) {
  }
}// ExamSubjectDtoModel

export class ExamSubjectCreated implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectCreated;

  constructor(public payload: { examSubject: ExamSubjectDtoModel }) {
  }
}

export class ExamSubjectUpdated implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectUpdated;

  constructor(public payload: {
    partialExamSubject: Update<ExamSubjectDtoModel>, // For State update
    examSubject: ExamSubjectDtoModel // For Server update (through service)
  }) {
  }
}

export class ExamSubjectsStatusUpdated implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectsStatusUpdated;

  constructor(public payload: {
    examSubjects: ExamSubjectDtoModel[],
    status: number
  }) {
  }
}

export class OneExamSubjectDeleted implements Action {
  readonly type = ExamSubjectActionTypes.OneExamSubjectDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyExamSubjectsDeleted implements Action {
  readonly type = ExamSubjectActionTypes.ManyExamSubjectsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ExamSubjectsPageRequested implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectsPageRequested;

  constructor(public payload: { page: QueryParamsModel,examId:number}) {
  }
}

export class ExamSubjectsPageLoaded implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectsPageLoaded;

  constructor(public payload: { examSubjects: ExamSubjectDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ExamSubjectsPageCancelled implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectsPageCancelled;
}

export class ExamSubjectsPageToggleLoading implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ExamSubjectActionToggleLoading implements Action {
  readonly type = ExamSubjectActionTypes.ExamSubjectActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ExamSubjectActions = ExamSubjectOnServerCreated
| ExamSubjectCreated
| ExamSubjectUpdated
| ExamSubjectsStatusUpdated
| OneExamSubjectDeleted
| ManyExamSubjectsDeleted
| ExamSubjectsPageRequested
| ExamSubjectsPageLoaded
| ExamSubjectsPageCancelled
| ExamSubjectsPageToggleLoading
| ExamSubjectActionToggleLoading;
