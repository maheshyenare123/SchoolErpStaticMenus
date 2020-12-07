// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { GeneralCallModel } from '../_models/general-call.model';

export enum PhoneCallLogActionTypes {
  PhoneCallLogOnServerCreated = '[Edit Phone Call Log Dialog] PhoneCallLog On Server Created',
  PhoneCallLogCreated = '[Edit Phone Call Log Dialog] Phone Call Log Created',
  PhoneCallLogUpdated = '[Edit Phone Call Log Dialog] PhoneCallLog Updated',
  PhoneCallLogsStatusUpdated = '[PhoneCallLog List Page] PhoneCallLogs Status Updated',
  OnePhoneCallLogDeleted = '[PhoneCallLogs List Page] One PhoneCallLog Deleted',
  ManyPhoneCallLogsDeleted = '[PhoneCallLogs List Page] Many PhoneCallLog Deleted',
  PhoneCallLogsPageRequested = '[PhoneCallLogs List Page] PhoneCallLogs Page Requested',
  PhoneCallLogsPageLoaded = '[PhoneCallLogs API] PhoneCallLogs Page Loaded',
  PhoneCallLogsPageCancelled = '[PhoneCallLogs API] PhoneCallLogs Page Cancelled',
  PhoneCallLogsPageToggleLoading = '[PhoneCallLogs] PhoneCallLogs Page Toggle Loading',
  PhoneCallLogActionToggleLoading = '[PhoneCallLogs] PhoneCallLogs Action Toggle Loading'
}

export class PhoneCallLogOnServerCreated implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogOnServerCreated;
  constructor(public payload: { phoneCallLog: GeneralCallModel }) {
  }
}

export class PhoneCallLogCreated implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogCreated;

  constructor(public payload: { phoneCallLog: GeneralCallModel }) {
  }
}

export class PhoneCallLogUpdated implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogUpdated;

  constructor(public payload: {
    partialPhoneCallLog: Update<GeneralCallModel>, // For State update
    phoneCallLog: GeneralCallModel // For Server update (through service)
  }) {
  }
}

export class PhoneCallLogsStatusUpdated implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogsStatusUpdated;

  constructor(public payload: {
    phoneCallLogs: GeneralCallModel[],
    status: number
  }) {
  }
}

export class OnePhoneCallLogDeleted implements Action {
  readonly type = PhoneCallLogActionTypes.OnePhoneCallLogDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyPhoneCallLogsDeleted implements Action {
  readonly type = PhoneCallLogActionTypes.ManyPhoneCallLogsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class PhoneCallLogsPageRequested implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class PhoneCallLogsPageLoaded implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogsPageLoaded;

  constructor(public payload: { phoneCallLogs: GeneralCallModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class PhoneCallLogsPageCancelled implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogsPageCancelled;
}

export class PhoneCallLogsPageToggleLoading implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class PhoneCallLogActionToggleLoading implements Action {
  readonly type = PhoneCallLogActionTypes.PhoneCallLogActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type PhoneCallLogActions = PhoneCallLogOnServerCreated
| PhoneCallLogCreated
| PhoneCallLogUpdated
| PhoneCallLogsStatusUpdated
| OnePhoneCallLogDeleted
| ManyPhoneCallLogsDeleted
| PhoneCallLogsPageRequested
| PhoneCallLogsPageLoaded
| PhoneCallLogsPageCancelled
| PhoneCallLogsPageToggleLoading
| PhoneCallLogActionToggleLoading;
