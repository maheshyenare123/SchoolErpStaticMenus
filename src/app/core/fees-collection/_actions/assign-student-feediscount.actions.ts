// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AssignFeediscountStudentRequestDtoModel } from '../_models/assign-feediscount-student-request-dto.model';

export enum AssignStudentFeediscountActionTypes {
  AssignStudentFeediscountOnServerCreated = '[Edit AssignStudentFeediscount Dialog] AssignStudentFeediscount On Server Created',
  AssignStudentFeediscountCreated = '[Edit AssignStudentFeediscount Dialog] AssignStudentFeediscount Created',
  AssignStudentFeediscountUpdated = '[Edit AssignStudentFeediscount Dialog] AssignStudentFeediscount Updated',
  AssignStudentFeediscountsStatusUpdated = '[AssignStudentFeediscount List Page] AssignStudentFeediscounts Status Updated',
  OneAssignStudentFeediscountDeleted = '[AssignStudentFeediscounts List Page] One AssignStudentFeediscount Deleted',
  ManyAssignStudentFeediscountsDeleted = '[AssignStudentFeediscounts List Page] Many AssignStudentFeediscount Deleted',
  AssignStudentFeediscountsPageRequested = '[AssignStudentFeediscounts List Page] AssignStudentFeediscounts Page Requested',
  AssignStudentFeediscountsPageLoaded = '[AssignStudentFeediscounts API] AssignStudentFeediscounts Page Loaded',
  AssignStudentFeediscountsPageCancelled = '[AssignStudentFeediscounts API] AssignStudentFeediscounts Page Cancelled',
  AssignStudentFeediscountsPageToggleLoading = '[AssignStudentFeediscounts] AssignStudentFeediscounts Page Toggle Loading',
  AssignStudentFeediscountActionToggleLoading = '[AssignStudentFeediscounts] AssignStudentFeediscounts Action Toggle Loading'
}

export class AssignStudentFeediscountOnServerCreated implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountOnServerCreated;
  constructor(public payload: { assignStudentFeediscount: AssignFeediscountStudentRequestDtoModel }) {
  }
}// AssignFeediscountStudentRequestDtoModel

export class AssignStudentFeediscountCreated implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountCreated;

  constructor(public payload: { assignStudentFeediscount: AssignFeediscountStudentRequestDtoModel }) {
  }
}

export class AssignStudentFeediscountUpdated implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountUpdated;

  constructor(public payload: {
    partialAssignStudentFeediscount: Update<AssignFeediscountStudentRequestDtoModel>, // For State update
    assignStudentFeediscount: AssignFeediscountStudentRequestDtoModel // For Server update (through service)
  }) {
  }
}

export class AssignStudentFeediscountsStatusUpdated implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountsStatusUpdated;

  constructor(public payload: {
    assignStudentFeediscounts: AssignFeediscountStudentRequestDtoModel[],
    status: number
  }) {
  }
}

export class OneAssignStudentFeediscountDeleted implements Action {
  readonly type = AssignStudentFeediscountActionTypes.OneAssignStudentFeediscountDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyAssignStudentFeediscountsDeleted implements Action {
  readonly type = AssignStudentFeediscountActionTypes.ManyAssignStudentFeediscountsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AssignStudentFeediscountsPageRequested implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageRequested;

  constructor(public payload: { page: QueryParamsModel ,classId:number,sectionId:number,category:number,gender:string,rte:string,feeGroupId:number}) {
  }
}

export class AssignStudentFeediscountsPageLoaded implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageLoaded;

  constructor(public payload: { assignStudentFeediscounts: AssignFeediscountStudentRequestDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AssignStudentFeediscountsPageCancelled implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageCancelled;
}

export class AssignStudentFeediscountsPageToggleLoading implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AssignStudentFeediscountActionToggleLoading implements Action {
  readonly type = AssignStudentFeediscountActionTypes.AssignStudentFeediscountActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AssignStudentFeediscountActions = AssignStudentFeediscountOnServerCreated
| AssignStudentFeediscountCreated
| AssignStudentFeediscountUpdated
| AssignStudentFeediscountsStatusUpdated
| OneAssignStudentFeediscountDeleted
| ManyAssignStudentFeediscountsDeleted
| AssignStudentFeediscountsPageRequested
| AssignStudentFeediscountsPageLoaded
| AssignStudentFeediscountsPageCancelled
| AssignStudentFeediscountsPageToggleLoading
| AssignStudentFeediscountActionToggleLoading;
