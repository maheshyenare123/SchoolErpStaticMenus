// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ExamModel } from '../_models/exam.model';

export enum ExamActionTypes {
  ExamOnServerCreated = '[Edit Exam Dialog] Exam On Server Created',
  ExamCreated = '[Edit Exam Dialog] Exam Created',
  ExamUpdated = '[Edit Exam Dialog] Exam Updated',
  ExamsStatusUpdated = '[Exam List Page] Exams Status Updated',
  OneExamDeleted = '[Exams List Page] One Exam Deleted',
  ManyExamsDeleted = '[Exams List Page] Many Exam Deleted',
  ExamsPageRequested = '[Exams List Page] Exams Page Requested',
  ExamsPageLoaded = '[Exams API] Exams Page Loaded',
  ExamsPageCancelled = '[Exams API] Exams Page Cancelled',
  ExamsPageToggleLoading = '[Exams] Exams Page Toggle Loading',
  ExamActionToggleLoading = '[Exams] Exams Action Toggle Loading'
}

export class ExamOnServerCreated implements Action {
  readonly type = ExamActionTypes.ExamOnServerCreated;
  constructor(public payload: { exam: ExamModel }) {
  }
}

export class ExamCreated implements Action {
  readonly type = ExamActionTypes.ExamCreated;

  constructor(public payload: { exam: ExamModel }) {
  }
}

export class ExamUpdated implements Action {
  readonly type = ExamActionTypes.ExamUpdated;

  constructor(public payload: {
    partialExam: Update<ExamModel>, // For State update
    exam: ExamModel // For Server update (through service)
  }) {
  }
}

export class ExamsStatusUpdated implements Action {
  readonly type = ExamActionTypes.ExamsStatusUpdated;

  constructor(public payload: {
    exams: ExamModel[],
    status: number
  }) {
  }
}

export class OneExamDeleted implements Action {
  readonly type = ExamActionTypes.OneExamDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyExamsDeleted implements Action {
  readonly type = ExamActionTypes.ManyExamsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ExamsPageRequested implements Action {
  readonly type = ExamActionTypes.ExamsPageRequested;

  constructor(public payload: { page: QueryParamsModel , examGroupId:number }) {
  }
}

export class ExamsPageLoaded implements Action {
  readonly type = ExamActionTypes.ExamsPageLoaded;

  constructor(public payload: { exams: ExamModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ExamsPageCancelled implements Action {
  readonly type = ExamActionTypes.ExamsPageCancelled;
}

export class ExamsPageToggleLoading implements Action {
  readonly type = ExamActionTypes.ExamsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ExamActionToggleLoading implements Action {
  readonly type = ExamActionTypes.ExamActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ExamActions = ExamOnServerCreated
| ExamCreated
| ExamUpdated
| ExamsStatusUpdated
| OneExamDeleted
| ManyExamsDeleted
| ExamsPageRequested
| ExamsPageLoaded
| ExamsPageCancelled
| ExamsPageToggleLoading
| ExamActionToggleLoading;
