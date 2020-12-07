// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ExamSubjectMarksModel } from '../_models/exam-subject-marks.model';

export enum ExamSubjectMarksActionTypes {
  ExamSubjectMarksOnServerCreated = '[Edit ExamSubjectMarks Dialog] ExamSubjectMarks On Server Created',
  ExamSubjectMarksCreated = '[Edit ExamSubjectMarks Dialog] ExamSubjectMarks Created',
  ExamSubjectMarksUpdated = '[Edit ExamSubjectMarks Dialog] ExamSubjectMarks Updated',
  ExamSubjectMarkssStatusUpdated = '[ExamSubjectMarks List Page] ExamSubjectMarkss Status Updated',
  OneExamSubjectMarksDeleted = '[ExamSubjectMarkss List Page] One ExamSubjectMarks Deleted',
  ManyExamSubjectMarkssDeleted = '[ExamSubjectMarkss List Page] Many ExamSubjectMarks Deleted',
  ExamSubjectMarkssPageRequested = '[ExamSubjectMarkss List Page] ExamSubjectMarkss Page Requested',
  ExamSubjectMarkssPageLoaded = '[ExamSubjectMarkss API] ExamSubjectMarkss Page Loaded',
  ExamSubjectMarkssPageCancelled = '[ExamSubjectMarkss API] ExamSubjectMarkss Page Cancelled',
  ExamSubjectMarkssPageToggleLoading = '[ExamSubjectMarkss] ExamSubjectMarkss Page Toggle Loading',
  ExamSubjectMarksActionToggleLoading = '[ExamSubjectMarkss] ExamSubjectMarkss Action Toggle Loading'
}

export class ExamSubjectMarksOnServerCreated implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarksOnServerCreated;
  constructor(public payload: { examSubjectMarks: ExamSubjectMarksModel }) {
  }
}

export class ExamSubjectMarksCreated implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarksCreated;

  constructor(public payload: { examSubjectMarks: ExamSubjectMarksModel }) {
  }
}

export class ExamSubjectMarksUpdated implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarksUpdated;

  constructor(public payload: {
    partialExamSubjectMarks: Update<ExamSubjectMarksModel>, // For State update
    examSubjectMarks: ExamSubjectMarksModel // For Server update (through service)
  }) {
  }
}

export class ExamSubjectMarkssStatusUpdated implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarkssStatusUpdated;

  constructor(public payload: {
    examSubjectMarkss: ExamSubjectMarksModel[],
    status: number
  }) {
  }
}

export class OneExamSubjectMarksDeleted implements Action {
  readonly type = ExamSubjectMarksActionTypes.OneExamSubjectMarksDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyExamSubjectMarkssDeleted implements Action {
  readonly type = ExamSubjectMarksActionTypes.ManyExamSubjectMarkssDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ExamSubjectMarkssPageRequested implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarkssPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number,sessionId:number,examId:number,examSubjectId:number }) {
  }
}

export class ExamSubjectMarkssPageLoaded implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarkssPageLoaded;

  constructor(public payload: { examSubjectMarkss: ExamSubjectMarksModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ExamSubjectMarkssPageCancelled implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarkssPageCancelled;
}

export class ExamSubjectMarkssPageToggleLoading implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarkssPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ExamSubjectMarksActionToggleLoading implements Action {
  readonly type = ExamSubjectMarksActionTypes.ExamSubjectMarksActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ExamSubjectMarksActions = ExamSubjectMarksOnServerCreated
| ExamSubjectMarksCreated
| ExamSubjectMarksUpdated
| ExamSubjectMarkssStatusUpdated
| OneExamSubjectMarksDeleted
| ManyExamSubjectMarkssDeleted
| ExamSubjectMarkssPageRequested
| ExamSubjectMarkssPageLoaded
| ExamSubjectMarkssPageCancelled
| ExamSubjectMarkssPageToggleLoading
| ExamSubjectMarksActionToggleLoading;
