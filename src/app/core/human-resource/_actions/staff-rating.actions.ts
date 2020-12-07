// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StaffRatingModel } from '../_models/staff-rating.model';

export enum StaffRatingActionTypes {
  StaffRatingOnServerCreated = '[Edit StaffRating Dialog] StaffRating On Server Created',
  StaffRatingCreated = '[Edit StaffRating Dialog] StaffRating Created',
  StaffRatingUpdated = '[Edit StaffRating Dialog] StaffRating Updated',
  StaffRatingsStatusUpdated = '[StaffRating List Page] StaffRatings Status Updated',
  OneStaffRatingDeleted = '[StaffRatings List Page] One StaffRating Deleted',
  ManyStaffRatingsDeleted = '[StaffRatings List Page] Many StaffRating Deleted',
  StaffRatingsPageRequested = '[StaffRatings List Page] StaffRatings Page Requested',
  StaffRatingsPageLoaded = '[StaffRatings API] StaffRatings Page Loaded',
  StaffRatingsPageCancelled = '[StaffRatings API] StaffRatings Page Cancelled',
  StaffRatingsPageToggleLoading = '[StaffRatings] StaffRatings Page Toggle Loading',
  StaffRatingActionToggleLoading = '[StaffRatings] StaffRatings Action Toggle Loading'
}

export class StaffRatingOnServerCreated implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingOnServerCreated;
  constructor(public payload: { staffRating: StaffRatingModel }) {
  }
}

export class StaffRatingCreated implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingCreated;

  constructor(public payload: { staffRating: StaffRatingModel }) {
  }
}

export class StaffRatingUpdated implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingUpdated;

  constructor(public payload: {
    partialStaffRating: Update<StaffRatingModel>, // For State update
    staffRating: StaffRatingModel // For Server update (through service)
  }) {
  }
}

export class StaffRatingsStatusUpdated implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingsStatusUpdated;

  constructor(public payload: {
    staffRatings: StaffRatingModel[],
    status: number
  }) {
  }
}

export class OneStaffRatingDeleted implements Action {
  readonly type = StaffRatingActionTypes.OneStaffRatingDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStaffRatingsDeleted implements Action {
  readonly type = StaffRatingActionTypes.ManyStaffRatingsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StaffRatingsPageRequested implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StaffRatingsPageLoaded implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingsPageLoaded;

  constructor(public payload: { staffRatings: StaffRatingModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StaffRatingsPageCancelled implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingsPageCancelled;
}

export class StaffRatingsPageToggleLoading implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StaffRatingActionToggleLoading implements Action {
  readonly type = StaffRatingActionTypes.StaffRatingActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StaffRatingActions = StaffRatingOnServerCreated
| StaffRatingCreated
| StaffRatingUpdated
| StaffRatingsStatusUpdated
| OneStaffRatingDeleted
| ManyStaffRatingsDeleted
| StaffRatingsPageRequested
| StaffRatingsPageLoaded
| StaffRatingsPageCancelled
| StaffRatingsPageToggleLoading
| StaffRatingActionToggleLoading;
