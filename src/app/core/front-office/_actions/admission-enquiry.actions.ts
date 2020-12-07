// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { EnquiryModel } from '../_models/enquiry.model';

export enum AdmissionEnquiryActionTypes {
  AdmissionEnquiryOnServerCreated = '[Edit AdmissionEnquiry Dialog] AdmissionEnquiry On Server Created',
  AdmissionEnquiryCreated = '[Edit AdmissionEnquiry Dialog] AdmissionEnquiry Created',
  AdmissionEnquiryUpdated = '[Edit AdmissionEnquiry Dialog] AdmissionEnquiry Updated',
  AdmissionEnquirysStatusUpdated = '[AdmissionEnquiry List Page] AdmissionEnquirys Status Updated',
  OneAdmissionEnquiryDeleted = '[AdmissionEnquirys List Page] One AdmissionEnquiry Deleted',
  ManyAdmissionEnquirysDeleted = '[AdmissionEnquirys List Page] Many AdmissionEnquiry Deleted',
  AdmissionEnquirysPageRequested = '[AdmissionEnquirys List Page] AdmissionEnquirys Page Requested',
  AdmissionEnquirysPageLoaded = '[AdmissionEnquirys API] AdmissionEnquirys Page Loaded',
  AdmissionEnquirysPageCancelled = '[AdmissionEnquirys API] AdmissionEnquirys Page Cancelled',
  AdmissionEnquirysPageToggleLoading = '[AdmissionEnquirys] AdmissionEnquirys Page Toggle Loading',
  AdmissionEnquiryActionToggleLoading = '[AdmissionEnquirys] AdmissionEnquirys Action Toggle Loading'
}

export class AdmissionEnquiryOnServerCreated implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquiryOnServerCreated;
  constructor(public payload: { enquiry: EnquiryModel }) {
  }
}

export class AdmissionEnquiryCreated implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquiryCreated;

  constructor(public payload: { enquiry: EnquiryModel }) {
  }
}

export class AdmissionEnquiryUpdated implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquiryUpdated;

  constructor(public payload: {
    partialAdmissionEnquiry: Update<EnquiryModel>, // For State update
    enquiry: EnquiryModel // For Server update (through service)
  }) {
  }
}

export class AdmissionEnquirysStatusUpdated implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquirysStatusUpdated;

  constructor(public payload: {
    enquirys: EnquiryModel[],
    status: number
  }) {
  }
}

export class OneAdmissionEnquiryDeleted implements Action {
  readonly type = AdmissionEnquiryActionTypes.OneAdmissionEnquiryDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyAdmissionEnquirysDeleted implements Action {
  readonly type = AdmissionEnquiryActionTypes.ManyAdmissionEnquirysDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AdmissionEnquirysPageRequested implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquirysPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class AdmissionEnquirysPageLoaded implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquirysPageLoaded;

  constructor(public payload: { enquirys: EnquiryModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AdmissionEnquirysPageCancelled implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquirysPageCancelled;
}

export class AdmissionEnquirysPageToggleLoading implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquirysPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AdmissionEnquiryActionToggleLoading implements Action {
  readonly type = AdmissionEnquiryActionTypes.AdmissionEnquiryActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AdmissionEnquiryActions = AdmissionEnquiryOnServerCreated
| AdmissionEnquiryCreated
| AdmissionEnquiryUpdated
| AdmissionEnquirysStatusUpdated
| OneAdmissionEnquiryDeleted
| ManyAdmissionEnquirysDeleted
| AdmissionEnquirysPageRequested
| AdmissionEnquirysPageLoaded
| AdmissionEnquirysPageCancelled
| AdmissionEnquirysPageToggleLoading
| AdmissionEnquiryActionToggleLoading;
