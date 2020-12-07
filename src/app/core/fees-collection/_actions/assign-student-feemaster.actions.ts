// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AssignFeemasterStudentRequestDtoModel } from '../_models/assign-feemaster-student-request-dto.model';

export enum AssignStudentFeemasterActionTypes {
  AssignStudentFeemasterOnServerCreated = '[Edit AssignStudentFeemaster Dialog] AssignStudentFeemaster On Server Created',
  AssignStudentFeemasterCreated = '[Edit AssignStudentFeemaster Dialog] AssignStudentFeemaster Created',
  AssignStudentFeemasterUpdated = '[Edit AssignStudentFeemaster Dialog] AssignStudentFeemaster Updated',
  AssignStudentFeemastersStatusUpdated = '[AssignStudentFeemaster List Page] AssignStudentFeemasters Status Updated',
  OneAssignStudentFeemasterDeleted = '[AssignStudentFeemasters List Page] One AssignStudentFeemaster Deleted',
  ManyAssignStudentFeemastersDeleted = '[AssignStudentFeemasters List Page] Many AssignStudentFeemaster Deleted',
  AssignStudentFeemastersPageRequested = '[AssignStudentFeemasters List Page] AssignStudentFeemasters Page Requested',
  AssignStudentFeemastersPageLoaded = '[AssignStudentFeemasters API] AssignStudentFeemasters Page Loaded',
  AssignStudentFeemastersPageCancelled = '[AssignStudentFeemasters API] AssignStudentFeemasters Page Cancelled',
  AssignStudentFeemastersPageToggleLoading = '[AssignStudentFeemasters] AssignStudentFeemasters Page Toggle Loading',
  AssignStudentFeemasterActionToggleLoading = '[AssignStudentFeemasters] AssignStudentFeemasters Action Toggle Loading'
}

export class AssignStudentFeemasterOnServerCreated implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemasterOnServerCreated;
  constructor(public payload: { assignStudentFeemaster: AssignFeemasterStudentRequestDtoModel }) {
  }
}// AssignFeemasterStudentRequestDtoModel

export class AssignStudentFeemasterCreated implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemasterCreated;

  constructor(public payload: { assignStudentFeemaster: AssignFeemasterStudentRequestDtoModel }) {
  }
}

export class AssignStudentFeemasterUpdated implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemasterUpdated;

  constructor(public payload: {
    partialAssignStudentFeemaster: Update<AssignFeemasterStudentRequestDtoModel>, // For State update
    assignStudentFeemaster: AssignFeemasterStudentRequestDtoModel // For Server update (through service)
  }) {
  }
}

export class AssignStudentFeemastersStatusUpdated implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemastersStatusUpdated;

  constructor(public payload: {
    assignStudentFeemasters: AssignFeemasterStudentRequestDtoModel[],
    status: number
  }) {
  }
}

export class OneAssignStudentFeemasterDeleted implements Action {
  readonly type = AssignStudentFeemasterActionTypes.OneAssignStudentFeemasterDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyAssignStudentFeemastersDeleted implements Action {
  readonly type = AssignStudentFeemasterActionTypes.ManyAssignStudentFeemastersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AssignStudentFeemastersPageRequested implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageRequested;

  constructor(public payload: { page: QueryParamsModel ,classId:number,sectionId:number,category:number,gender:string,rte:string,feeGroupId:number}) {
  }
}

export class AssignStudentFeemastersPageLoaded implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageLoaded;

  constructor(public payload: { assignStudentFeemasters: AssignFeemasterStudentRequestDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AssignStudentFeemastersPageCancelled implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageCancelled;
}

export class AssignStudentFeemastersPageToggleLoading implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AssignStudentFeemasterActionToggleLoading implements Action {
  readonly type = AssignStudentFeemasterActionTypes.AssignStudentFeemasterActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AssignStudentFeemasterActions = AssignStudentFeemasterOnServerCreated
| AssignStudentFeemasterCreated
| AssignStudentFeemasterUpdated
| AssignStudentFeemastersStatusUpdated
| OneAssignStudentFeemasterDeleted
| ManyAssignStudentFeemastersDeleted
| AssignStudentFeemastersPageRequested
| AssignStudentFeemastersPageLoaded
| AssignStudentFeemastersPageCancelled
| AssignStudentFeemastersPageToggleLoading
| AssignStudentFeemasterActionToggleLoading;
