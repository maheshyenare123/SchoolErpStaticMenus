// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentFeeDepositeModel } from '../_models/student-fee-deposite.model';

export enum StudentFeeDepositeActionTypes {
  StudentFeeDepositeOnServerCreated = '[Edit StudentFeeDeposite Dialog] StudentFeeDeposite On Server Created',
  StudentFeeDepositeCreated = '[Edit StudentFeeDeposite Dialog] StudentFeeDeposite Created',
  StudentFeeDepositeUpdated = '[Edit StudentFeeDeposite Dialog] StudentFeeDeposite Updated',
  StudentFeeDepositesStatusUpdated = '[StudentFeeDeposite List Page] StudentFeeDeposites Status Updated',
  OneStudentFeeDepositeDeleted = '[StudentFeeDeposites List Page] One StudentFeeDeposite Deleted',
  ManyStudentFeeDepositesDeleted = '[StudentFeeDeposites List Page] Many StudentFeeDeposite Deleted',
  StudentFeeDepositesPageRequested = '[StudentFeeDeposites List Page] StudentFeeDeposites Page Requested',
  StudentFeeDepositesPageLoaded = '[StudentFeeDeposites API] StudentFeeDeposites Page Loaded',
  StudentFeeDepositesPageCancelled = '[StudentFeeDeposites API] StudentFeeDeposites Page Cancelled',
  StudentFeeDepositesPageToggleLoading = '[StudentFeeDeposites] StudentFeeDeposites Page Toggle Loading',
  StudentFeeDepositeActionToggleLoading = '[StudentFeeDeposites] StudentFeeDeposites Action Toggle Loading'
}

export class StudentFeeDepositeOnServerCreated implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositeOnServerCreated;
  constructor(public payload: { studentFeeDeposite: StudentFeeDepositeModel }) {
  }
}

export class StudentFeeDepositeCreated implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositeCreated;

  constructor(public payload: { studentFeeDeposite: StudentFeeDepositeModel }) {
  }
}

export class StudentFeeDepositeUpdated implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositeUpdated;

  constructor(public payload: {
    partialStudentFeeDeposite: Update<StudentFeeDepositeModel>, // For State update
    studentFeeDeposite: StudentFeeDepositeModel // For Server update (through service)
  }) {
  }
}

export class StudentFeeDepositesStatusUpdated implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositesStatusUpdated;

  constructor(public payload: {
    studentFeeDeposites: StudentFeeDepositeModel[],
    status: number
  }) {
  }
}

export class OneStudentFeeDepositeDeleted implements Action {
  readonly type = StudentFeeDepositeActionTypes.OneStudentFeeDepositeDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentFeeDepositesDeleted implements Action {
  readonly type = StudentFeeDepositeActionTypes.ManyStudentFeeDepositesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentFeeDepositesPageRequested implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositesPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number,searchText:string }) {
  }
}

export class StudentFeeDepositesPageLoaded implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositesPageLoaded;

  constructor(public payload: { studentFeeDeposites: StudentFeeDepositeModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentFeeDepositesPageCancelled implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositesPageCancelled;
}

export class StudentFeeDepositesPageToggleLoading implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentFeeDepositeActionToggleLoading implements Action {
  readonly type = StudentFeeDepositeActionTypes.StudentFeeDepositeActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentFeeDepositeActions = StudentFeeDepositeOnServerCreated
| StudentFeeDepositeCreated
| StudentFeeDepositeUpdated
| StudentFeeDepositesStatusUpdated
| OneStudentFeeDepositeDeleted
| ManyStudentFeeDepositesDeleted
| StudentFeeDepositesPageRequested
| StudentFeeDepositesPageLoaded
| StudentFeeDepositesPageCancelled
| StudentFeeDepositesPageToggleLoading
| StudentFeeDepositeActionToggleLoading;
