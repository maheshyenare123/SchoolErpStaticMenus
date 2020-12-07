// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';

export enum StudentActionTypes {
  StudentOnServerCreated = '[Edit Student Dialog] Student On Server Created',
  StudentCreated = '[Edit Student Dialog] Student Created',
  StudentUpdated = '[Edit Student Dialog] Student Updated',
  StudentsStatusUpdated = '[Student List Page] Students Status Updated',
  OneStudentDeleted = '[Students List Page] One Student Deleted',
  ManyStudentsDeleted = '[Students List Page] Many Student Deleted',
  StudentsPageRequested = '[Students List Page] Students Page Requested',
  DisableStudentsPageRequested= '[ Disable Students List Page] Students Page Requested',
  StudentsuserPageRequested= '[Students User List Page] Students Page Requested',
  StudentsPageLoaded = '[Students API] Students Page Loaded',
  StudentsPageCancelled = '[Students API] Students Page Cancelled',
  StudentsPageToggleLoading = '[Students] Students Page Toggle Loading',
  StudentActionToggleLoading = '[Students] Students Action Toggle Loading'
}

export class StudentOnServerCreated implements Action {
  readonly type = StudentActionTypes.StudentOnServerCreated;
  constructor(public payload: { student: StudentDtoModel }) {
  }
}

export class StudentCreated implements Action {
  readonly type = StudentActionTypes.StudentCreated;

  constructor(public payload: { student: StudentDtoModel }) {
  }
}

export class StudentUpdated implements Action {
  readonly type = StudentActionTypes.StudentUpdated;

  constructor(public payload: {
    partialStudent: Update<StudentDtoModel>, // For State update
    student: StudentDtoModel // For Server update (through service)
  }) {
  }
}

export class StudentsStatusUpdated implements Action {
  readonly type = StudentActionTypes.StudentsStatusUpdated;

  constructor(public payload: {
    students: StudentDtoModel[],
    status: number
  }) {
  }
}

export class OneStudentDeleted implements Action {
  readonly type = StudentActionTypes.OneStudentDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentsDeleted implements Action {
  readonly type = StudentActionTypes.ManyStudentsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentsPageRequested implements Action {
  readonly type = StudentActionTypes.StudentsPageRequested;
  
  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number  }) {
  }
}

export class StudentsuserPageRequested implements Action {
  readonly type = StudentActionTypes.StudentsuserPageRequested;
  
  constructor(public payload: { page: QueryParamsModel,role:string  }) {
  }
}

export class DisableStudentsPageRequested implements Action {
  readonly type = StudentActionTypes.DisableStudentsPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number }) {
  }
}




export class StudentsPageLoaded implements Action {
  readonly type = StudentActionTypes.StudentsPageLoaded;

  constructor(public payload: { students: StudentDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentsPageCancelled implements Action {
  readonly type = StudentActionTypes.StudentsPageCancelled;
}

export class StudentsPageToggleLoading implements Action {
  readonly type = StudentActionTypes.StudentsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentActionToggleLoading implements Action {
  readonly type = StudentActionTypes.StudentActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentActions = StudentOnServerCreated
| StudentCreated
| StudentUpdated
| StudentsStatusUpdated
| OneStudentDeleted
| ManyStudentsDeleted
| StudentsPageRequested
| StudentsPageLoaded
| StudentsPageCancelled
| StudentsPageToggleLoading
| StudentActionToggleLoading
| DisableStudentsPageRequested;
