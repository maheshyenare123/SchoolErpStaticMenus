// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AssignExamStudentRequestDtoModel } from '../_models/assign-exam-student-request-dto.model';

export enum AssignStudentExamActionTypes {
  AssignStudentExamOnServerCreated = '[Edit AssignStudentExam Dialog] AssignStudentExam On Server Created',
  AssignStudentExamCreated = '[Edit AssignStudentExam Dialog] AssignStudentExam Created',
  AssignStudentExamUpdated = '[Edit AssignStudentExam Dialog] AssignStudentExam Updated',
  AssignStudentExamsStatusUpdated = '[AssignStudentExam List Page] AssignStudentExams Status Updated',
  OneAssignStudentExamDeleted = '[AssignStudentExams List Page] One AssignStudentExam Deleted',
  ManyAssignStudentExamsDeleted = '[AssignStudentExams List Page] Many AssignStudentExam Deleted',
  AssignStudentExamsPageRequested = '[AssignStudentExams List Page] AssignStudentExams Page Requested',
  AssignStudentExamsPageLoaded = '[AssignStudentExams API] AssignStudentExams Page Loaded',
  AssignStudentExamsPageCancelled = '[AssignStudentExams API] AssignStudentExams Page Cancelled',
  AssignStudentExamsPageToggleLoading = '[AssignStudentExams] AssignStudentExams Page Toggle Loading',
  AssignStudentExamActionToggleLoading = '[AssignStudentExams] AssignStudentExams Action Toggle Loading'
}

export class AssignStudentExamOnServerCreated implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamOnServerCreated;
  constructor(public payload: { assignStudentExam: AssignExamStudentRequestDtoModel }) {
  }
}// AssignExamStudentRequestDtoModel

export class AssignStudentExamCreated implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamCreated;

  constructor(public payload: { assignStudentExam: AssignExamStudentRequestDtoModel }) {
  }
}

export class AssignStudentExamUpdated implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamUpdated;

  constructor(public payload: {
    partialAssignStudentExam: Update<AssignExamStudentRequestDtoModel>, // For State update
    assignStudentExam: AssignExamStudentRequestDtoModel // For Server update (through service)
  }) {
  }
}

export class AssignStudentExamsStatusUpdated implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamsStatusUpdated;

  constructor(public payload: {
    assignStudentExams: AssignExamStudentRequestDtoModel[],
    status: number
  }) {
  }
}

export class OneAssignStudentExamDeleted implements Action {
  readonly type = AssignStudentExamActionTypes.OneAssignStudentExamDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyAssignStudentExamsDeleted implements Action {
  readonly type = AssignStudentExamActionTypes.ManyAssignStudentExamsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AssignStudentExamsPageRequested implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamsPageRequested;

  constructor(public payload: { page: QueryParamsModel ,classId:number,sectionId:number,examId:number}) {
  }
}

export class AssignStudentExamsPageLoaded implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamsPageLoaded;

  constructor(public payload: { assignStudentExams: AssignExamStudentRequestDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AssignStudentExamsPageCancelled implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamsPageCancelled;
}

export class AssignStudentExamsPageToggleLoading implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AssignStudentExamActionToggleLoading implements Action {
  readonly type = AssignStudentExamActionTypes.AssignStudentExamActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AssignStudentExamActions = AssignStudentExamOnServerCreated
| AssignStudentExamCreated
| AssignStudentExamUpdated
| AssignStudentExamsStatusUpdated
| OneAssignStudentExamDeleted
| ManyAssignStudentExamsDeleted
| AssignStudentExamsPageRequested
| AssignStudentExamsPageLoaded
| AssignStudentExamsPageCancelled
| AssignStudentExamsPageToggleLoading
| AssignStudentExamActionToggleLoading;
