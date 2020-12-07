// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentClassModel } from '../_models/student-class.model';

export enum StudentClassActionTypes {
  StudentClassOnServerCreated = '[Edit StudentClass Dialog] StudentClass On Server Created',
  StudentClassCreated = '[Edit StudentClass Dialog] StudentClass Created',
  StudentClassUpdated = '[Edit StudentClass Dialog] StudentClass Updated',
  StudentClasssStatusUpdated = '[StudentClass List Page] StudentClasss Status Updated',
  OneStudentClassDeleted = '[StudentClasss List Page] One StudentClass Deleted',
  ManyStudentClasssDeleted = '[StudentClasss List Page] Many StudentClass Deleted',
  StudentClasssPageRequested = '[StudentClasss List Page] StudentClasss Page Requested',
  StudentClasssPageLoaded = '[StudentClasss API] StudentClasss Page Loaded',
  StudentClasssPageCancelled = '[StudentClasss API] StudentClasss Page Cancelled',
  StudentClasssPageToggleLoading = '[StudentClasss] StudentClasss Page Toggle Loading',
  StudentClassActionToggleLoading = '[StudentClasss] StudentClasss Action Toggle Loading'
}

export class StudentClassOnServerCreated implements Action {
  readonly type = StudentClassActionTypes.StudentClassOnServerCreated;
  constructor(public payload: { studentClass: StudentClassModel }) {
  }
}

export class StudentClassCreated implements Action {
  readonly type = StudentClassActionTypes.StudentClassCreated;

  constructor(public payload: { studentClass: StudentClassModel }) {
  }
}

export class StudentClassUpdated implements Action {
  readonly type = StudentClassActionTypes.StudentClassUpdated;

  constructor(public payload: {
    partialStudentClass: Update<StudentClassModel>, // For State update
    studentClass: StudentClassModel // For Server update (through service)
  }) {
  }
}

export class StudentClasssStatusUpdated implements Action {
  readonly type = StudentClassActionTypes.StudentClasssStatusUpdated;

  constructor(public payload: {
    studentClasss: StudentClassModel[],
    status: number
  }) {
  }
}

export class OneStudentClassDeleted implements Action {
  readonly type = StudentClassActionTypes.OneStudentClassDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentClasssDeleted implements Action {
  readonly type = StudentClassActionTypes.ManyStudentClasssDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentClasssPageRequested implements Action {
  readonly type = StudentClassActionTypes.StudentClasssPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StudentClasssPageLoaded implements Action {
  readonly type = StudentClassActionTypes.StudentClasssPageLoaded;

  constructor(public payload: { studentClasss: StudentClassModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentClasssPageCancelled implements Action {
  readonly type = StudentClassActionTypes.StudentClasssPageCancelled;
}

export class StudentClasssPageToggleLoading implements Action {
  readonly type = StudentClassActionTypes.StudentClasssPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentClassActionToggleLoading implements Action {
  readonly type = StudentClassActionTypes.StudentClassActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentClassActions = StudentClassOnServerCreated
| StudentClassCreated
| StudentClassUpdated
| StudentClasssStatusUpdated
| OneStudentClassDeleted
| ManyStudentClasssDeleted
| StudentClasssPageRequested
| StudentClasssPageLoaded
| StudentClasssPageCancelled
| StudentClasssPageToggleLoading
| StudentClassActionToggleLoading;
