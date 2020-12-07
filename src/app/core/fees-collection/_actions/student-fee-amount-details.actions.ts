// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentFeeAmountDetailsModel } from '../_models/student-fee-amount-details.model';

export enum StudentFeeAmountDetailsActionTypes {
  StudentFeeAmountDetailsOnServerCreated = '[Edit StudentFeeAmountDetails Dialog] StudentFeeAmountDetails On Server Created',
  StudentFeeAmountDetailsCreated = '[Edit StudentFeeAmountDetails Dialog] StudentFeeAmountDetails Created',
  StudentFeeAmountDetailsUpdated = '[Edit StudentFeeAmountDetails Dialog] StudentFeeAmountDetails Updated',
  StudentFeeAmountDetailssStatusUpdated = '[StudentFeeAmountDetails List Page] StudentFeeAmountDetailss Status Updated',
  OneStudentFeeAmountDetailsDeleted = '[StudentFeeAmountDetailss List Page] One StudentFeeAmountDetails Deleted',
  ManyStudentFeeAmountDetailssDeleted = '[StudentFeeAmountDetailss List Page] Many StudentFeeAmountDetails Deleted',
  StudentFeeAmountDetailssPageRequested = '[StudentFeeAmountDetailss List Page] StudentFeeAmountDetailss Page Requested',
  StudentFeeAmountDetailssPageLoaded = '[StudentFeeAmountDetailss API] StudentFeeAmountDetailss Page Loaded',
  StudentFeeAmountDetailssPageCancelled = '[StudentFeeAmountDetailss API] StudentFeeAmountDetailss Page Cancelled',
  StudentFeeAmountDetailssPageToggleLoading = '[StudentFeeAmountDetailss] StudentFeeAmountDetailss Page Toggle Loading',
  StudentFeeAmountDetailsActionToggleLoading = '[StudentFeeAmountDetailss] StudentFeeAmountDetailss Action Toggle Loading'
}

export class StudentFeeAmountDetailsOnServerCreated implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsOnServerCreated;
  constructor(public payload: { studentFeeAmountDetails: StudentFeeAmountDetailsModel }) {
  }
}

export class StudentFeeAmountDetailsCreated implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsCreated;

  constructor(public payload: { studentFeeAmountDetails: StudentFeeAmountDetailsModel }) {
  }
}

export class StudentFeeAmountDetailsUpdated implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsUpdated;

  constructor(public payload: {
    partialStudentFeeAmountDetails: Update<StudentFeeAmountDetailsModel>, // For State update
    studentFeeAmountDetails: StudentFeeAmountDetailsModel // For Server update (through service)
  }) {
  }
}

export class StudentFeeAmountDetailssStatusUpdated implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssStatusUpdated;

  constructor(public payload: {
    studentFeeAmountDetailss: StudentFeeAmountDetailsModel[],
    status: number
  }) {
  }
}

export class OneStudentFeeAmountDetailsDeleted implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.OneStudentFeeAmountDetailsDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentFeeAmountDetailssDeleted implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.ManyStudentFeeAmountDetailssDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentFeeAmountDetailssPageRequested implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number,searchText:string }) {
  }
}

export class StudentFeeAmountDetailssPageLoaded implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageLoaded;

  constructor(public payload: { studentFeeAmountDetailss: StudentFeeAmountDetailsModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentFeeAmountDetailssPageCancelled implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageCancelled;
}

export class StudentFeeAmountDetailssPageToggleLoading implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentFeeAmountDetailsActionToggleLoading implements Action {
  readonly type = StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentFeeAmountDetailsActions = StudentFeeAmountDetailsOnServerCreated
| StudentFeeAmountDetailsCreated
| StudentFeeAmountDetailsUpdated
| StudentFeeAmountDetailssStatusUpdated
| OneStudentFeeAmountDetailsDeleted
| ManyStudentFeeAmountDetailssDeleted
| StudentFeeAmountDetailssPageRequested
| StudentFeeAmountDetailssPageLoaded
| StudentFeeAmountDetailssPageCancelled
| StudentFeeAmountDetailssPageToggleLoading
| StudentFeeAmountDetailsActionToggleLoading;
