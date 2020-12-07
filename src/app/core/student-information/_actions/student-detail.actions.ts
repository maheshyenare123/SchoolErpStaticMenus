// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';

export enum StudentDetailActionTypes {
  StudentDetailOnServerCreated = '[Edit StudentDetail Dialog] StudentDetail On Server Created',
  StudentDetailCreated = '[Edit StudentDetail Dialog] StudentDetail Created',
  StudentDetailUpdated = '[Edit StudentDetail Dialog] StudentDetail Updated',
  StudentDetailsStatusUpdated = '[StudentDetail List Page] StudentDetails Status Updated',
  OneStudentDetailDeleted = '[StudentDetails List Page] One StudentDetail Deleted',
  ManyStudentDetailsDeleted = '[StudentDetails List Page] Many StudentDetail Deleted',
  StudentDetailsPageRequested = '[StudentDetails List Page] StudentDetails Page Requested',
  StudentDetailsPageLoaded = '[StudentDetails API] StudentDetails Page Loaded',
  StudentDetailsPageCancelled = '[StudentDetails API] StudentDetails Page Cancelled',
  StudentDetailsPageToggleLoading = '[StudentDetails] StudentDetails Page Toggle Loading',
  StudentDetailActionToggleLoading = '[StudentDetails] StudentDetails Action Toggle Loading'
}

export class StudentDetailOnServerCreated implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailOnServerCreated;
  constructor(public payload: { studentDetail: StudentDtoModel }) {
  }
}

export class StudentDetailCreated implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailCreated;

  constructor(public payload: { studentDetail: StudentDtoModel }) {
  }
}

export class StudentDetailUpdated implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailUpdated;

  constructor(public payload: {
    partialStudentDetails: Update<StudentDtoModel>, // For State update
    studentDetail: StudentDtoModel // For Server update (through service)
  }) {
  }
}

export class StudentDetailsStatusUpdated implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailsStatusUpdated;

  constructor(public payload: {
    studentDetails: StudentDtoModel[],
    status: number
  }) {
  }
}

export class OneStudentDetailDeleted implements Action {
  readonly type = StudentDetailActionTypes.OneStudentDetailDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentDetailsDeleted implements Action {
  readonly type = StudentDetailActionTypes.ManyStudentDetailsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentDetailsPageRequested implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StudentDetailsPageLoaded implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailsPageLoaded;

  constructor(public payload: { studentDetails: StudentDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentDetailsPageCancelled implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailsPageCancelled;
}

export class StudentDetailsPageToggleLoading implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentDetailActionToggleLoading implements Action {
  readonly type = StudentDetailActionTypes.StudentDetailActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentDetailActions = StudentDetailOnServerCreated
| StudentDetailCreated
| StudentDetailUpdated
| StudentDetailsStatusUpdated
| OneStudentDetailDeleted
| ManyStudentDetailsDeleted
| StudentDetailsPageRequested
| StudentDetailsPageLoaded
| StudentDetailsPageCancelled
| StudentDetailsPageToggleLoading
| StudentDetailActionToggleLoading;
