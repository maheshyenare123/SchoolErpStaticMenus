// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ComplaintModel } from '../_models/complaint.model';

export enum ComplaintActionTypes {
  ComplaintOnServerCreated = '[Edit Complaint Dialog] Complaint On Server Created',
  ComplaintCreated = '[Edit Complaint Dialog] Complaint Created',
  ComplaintUpdated = '[Edit Complaint Dialog] Complaint Updated',
  ComplaintsStatusUpdated = '[Complaint List Page] Complaints Status Updated',
  OneComplaintDeleted = '[Complaints List Page] One Complaint Deleted',
  ManyComplaintsDeleted = '[Complaints List Page] Many Complaint Deleted',
  ComplaintsPageRequested = '[Complaints List Page] Complaints Page Requested',
  ComplaintsPageLoaded = '[Complaints API] Complaints Page Loaded',
  ComplaintsPageCancelled = '[Complaints API] Complaints Page Cancelled',
  ComplaintsPageToggleLoading = '[Complaints] Complaints Page Toggle Loading',
  ComplaintActionToggleLoading = '[Complaints] Complaints Action Toggle Loading'
}

export class ComplaintOnServerCreated implements Action {
  readonly type = ComplaintActionTypes.ComplaintOnServerCreated;
  constructor(public payload: { complaint: ComplaintModel }) {
  }
}

export class ComplaintCreated implements Action {
  readonly type = ComplaintActionTypes.ComplaintCreated;

  constructor(public payload: { complaint: ComplaintModel }) {
  }
}

export class ComplaintUpdated implements Action {
  readonly type = ComplaintActionTypes.ComplaintUpdated;

  constructor(public payload: {
    partialComplaint: Update<ComplaintModel>, // For State update
    complaint: ComplaintModel // For Server update (through service)
  }) {
  }
}

export class ComplaintsStatusUpdated implements Action {
  readonly type = ComplaintActionTypes.ComplaintsStatusUpdated;

  constructor(public payload: {
    complaints: ComplaintModel[],
    status: number
  }) {
  }
}

export class OneComplaintDeleted implements Action {
  readonly type = ComplaintActionTypes.OneComplaintDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyComplaintsDeleted implements Action {
  readonly type = ComplaintActionTypes.ManyComplaintsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ComplaintsPageRequested implements Action {
  readonly type = ComplaintActionTypes.ComplaintsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ComplaintsPageLoaded implements Action {
  readonly type = ComplaintActionTypes.ComplaintsPageLoaded;

  constructor(public payload: { complaints: ComplaintModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ComplaintsPageCancelled implements Action {
  readonly type = ComplaintActionTypes.ComplaintsPageCancelled;
}

export class ComplaintsPageToggleLoading implements Action {
  readonly type = ComplaintActionTypes.ComplaintsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ComplaintActionToggleLoading implements Action {
  readonly type = ComplaintActionTypes.ComplaintActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ComplaintActions = ComplaintOnServerCreated
| ComplaintCreated
| ComplaintUpdated
| ComplaintsStatusUpdated
| OneComplaintDeleted
| ManyComplaintsDeleted
| ComplaintsPageRequested
| ComplaintsPageLoaded
| ComplaintsPageCancelled
| ComplaintsPageToggleLoading
| ComplaintActionToggleLoading;
