// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { FeesReminderModel } from '../_models/fees-reminder.model';

export enum FeesReminderActionTypes {
  FeesReminderOnServerCreated = '[Edit FeesReminder Dialog] FeesReminder On Server Created',
  FeesReminderCreated = '[Edit FeesReminder Dialog] FeesReminder Created',
  FeesReminderUpdated = '[Edit FeesReminder Dialog] FeesReminder Updated',
  FeesRemindersStatusUpdated = '[FeesReminder List Page] FeesReminders Status Updated',
  OneFeesReminderDeleted = '[FeesReminders List Page] One FeesReminder Deleted',
  ManyFeesRemindersDeleted = '[FeesReminders List Page] Many FeesReminder Deleted',
  FeesRemindersPageRequested = '[FeesReminders List Page] FeesReminders Page Requested',
  FeesRemindersPageLoaded = '[FeesReminders API] FeesReminders Page Loaded',
  FeesRemindersPageCancelled = '[FeesReminders API] FeesReminders Page Cancelled',
  FeesRemindersPageToggleLoading = '[FeesReminders] FeesReminders Page Toggle Loading',
  FeesReminderActionToggleLoading = '[FeesReminders] FeesReminders Action Toggle Loading'
}

export class FeesReminderOnServerCreated implements Action {
  readonly type = FeesReminderActionTypes.FeesReminderOnServerCreated;
  constructor(public payload: { feesReminder: FeesReminderModel }) {
  }
}

export class FeesReminderCreated implements Action {
  readonly type = FeesReminderActionTypes.FeesReminderCreated;

  constructor(public payload: { feesReminder: FeesReminderModel }) {
  }
}

export class FeesReminderUpdated implements Action {
  readonly type = FeesReminderActionTypes.FeesReminderUpdated;

  constructor(public payload: {
    partialFeesReminder: Update<FeesReminderModel>, // For State update
    feesReminder: FeesReminderModel // For Server update (through service)
  }) {
  }
}

export class FeesRemindersStatusUpdated implements Action {
  readonly type = FeesReminderActionTypes.FeesRemindersStatusUpdated;

  constructor(public payload: {
    feesReminders: FeesReminderModel[],
    status: number
  }) {
  }
}

export class OneFeesReminderDeleted implements Action {
  readonly type = FeesReminderActionTypes.OneFeesReminderDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyFeesRemindersDeleted implements Action {
  readonly type = FeesReminderActionTypes.ManyFeesRemindersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class FeesRemindersPageRequested implements Action {
  readonly type = FeesReminderActionTypes.FeesRemindersPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class FeesRemindersPageLoaded implements Action {
  readonly type = FeesReminderActionTypes.FeesRemindersPageLoaded;

  constructor(public payload: { feesReminders: FeesReminderModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class FeesRemindersPageCancelled implements Action {
  readonly type = FeesReminderActionTypes.FeesRemindersPageCancelled;
}

export class FeesRemindersPageToggleLoading implements Action {
  readonly type = FeesReminderActionTypes.FeesRemindersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class FeesReminderActionToggleLoading implements Action {
  readonly type = FeesReminderActionTypes.FeesReminderActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type FeesReminderActions = FeesReminderOnServerCreated
| FeesReminderCreated
| FeesReminderUpdated
| FeesRemindersStatusUpdated
| OneFeesReminderDeleted
| ManyFeesRemindersDeleted
| FeesRemindersPageRequested
| FeesRemindersPageLoaded
| FeesRemindersPageCancelled
| FeesRemindersPageToggleLoading
| FeesReminderActionToggleLoading;
