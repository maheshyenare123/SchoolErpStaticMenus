// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentAttendenceDtoModel } from '../_models/studentAttendenceDto.model';

export enum StudentAttendenceActionTypes {
  StudentAttendenceOnServerCreated = '[Edit StudentAttendence Dialog] StudentAttendence On Server Created',
  StudentAttendenceCreated = '[Edit StudentAttendence Dialog] StudentAttendence Created',
  StudentAttendenceUpdated = '[Edit StudentAttendence Dialog] StudentAttendence Updated',
  StudentAttendencesStatusUpdated = '[StudentAttendence List Page] StudentAttendences Status Updated',
  OneStudentAttendenceDeleted = '[StudentAttendences List Page] One StudentAttendence Deleted',
  ManyStudentAttendencesDeleted = '[StudentAttendences List Page] Many StudentAttendence Deleted',
  StudentAttendencesPageRequested = '[StudentAttendences List Page] StudentAttendences Page Requested',
  StudentAttendencesPageLoaded = '[StudentAttendences API] StudentAttendences Page Loaded',
  StudentAttendencesPageCancelled = '[StudentAttendences API] StudentAttendences Page Cancelled',
  StudentAttendencesPageToggleLoading = '[StudentAttendences] StudentAttendences Page Toggle Loading',
  StudentAttendenceActionToggleLoading = '[StudentAttendences] StudentAttendences Action Toggle Loading'
}

export class StudentAttendenceOnServerCreated implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendenceOnServerCreated;
  constructor(public payload: { studentAttendence: StudentAttendenceDtoModel }) {
  }
}

export class StudentAttendenceCreated implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendenceCreated;

  constructor(public payload: { studentAttendence: StudentAttendenceDtoModel }) {
  }
}

export class StudentAttendenceUpdated implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendenceUpdated;

  constructor(public payload: {
    partialStudentAttendence: Update<StudentAttendenceDtoModel>, // For State update
    studentAttendence: StudentAttendenceDtoModel // For Server update (through service)
  }) {
  }
}

export class StudentAttendencesStatusUpdated implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendencesStatusUpdated;

  constructor(public payload: {
    studentAttendences: StudentAttendenceDtoModel[],
    status: number
  }) {
  }
}

export class OneStudentAttendenceDeleted implements Action {
  readonly type = StudentAttendenceActionTypes.OneStudentAttendenceDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentAttendencesDeleted implements Action {
  readonly type = StudentAttendenceActionTypes.ManyStudentAttendencesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentAttendencesPageRequested implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendencesPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number,date:string }) {
  }
}

export class StudentAttendencesPageLoaded implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendencesPageLoaded;

  constructor(public payload: { studentAttendences: StudentAttendenceDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentAttendencesPageCancelled implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendencesPageCancelled;
}

export class StudentAttendencesPageToggleLoading implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendencesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentAttendenceActionToggleLoading implements Action {
  readonly type = StudentAttendenceActionTypes.StudentAttendenceActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentAttendenceActions = StudentAttendenceOnServerCreated
| StudentAttendenceCreated
| StudentAttendenceUpdated
| StudentAttendencesStatusUpdated
| OneStudentAttendenceDeleted
| ManyStudentAttendencesDeleted
| StudentAttendencesPageRequested
| StudentAttendencesPageLoaded
| StudentAttendencesPageCancelled
| StudentAttendencesPageToggleLoading
| StudentAttendenceActionToggleLoading;
