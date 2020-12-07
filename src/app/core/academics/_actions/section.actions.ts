// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { SectionDtoModel } from '../_models/sectionDto.model';

export enum SectionActionTypes {
  SectionOnServerCreated = '[Edit Section Dialog] Section On Server Created',
  SectionCreated = '[Edit Section Dialog] Section Created',
  SectionUpdated = '[Edit Section Dialog] Section Updated',
  SectionsStatusUpdated = '[Section List Page] Sections Status Updated',
  OneSectionDeleted = '[Sections List Page] One Section Deleted',
  ManySectionsDeleted = '[Sections List Page] Many Section Deleted',
  SectionsPageRequested = '[Sections List Page] Sections Page Requested',
  SectionsPageLoaded = '[Sections API] Sections Page Loaded',
  SectionsPageCancelled = '[Sections API] Sections Page Cancelled',
  SectionsPageToggleLoading = '[Sections] Sections Page Toggle Loading',
  SectionActionToggleLoading = '[Sections] Sections Action Toggle Loading'
}

export class SectionOnServerCreated implements Action {
  readonly type = SectionActionTypes.SectionOnServerCreated;
  constructor(public payload: { section: SectionDtoModel }) {
  }
}

export class SectionCreated implements Action {
  readonly type = SectionActionTypes.SectionCreated;

  constructor(public payload: { section: SectionDtoModel }) {
  }
}

export class SectionUpdated implements Action {
  readonly type = SectionActionTypes.SectionUpdated;

  constructor(public payload: {
    partialSection: Update<SectionDtoModel>, // For State update
    section: SectionDtoModel // For Server update (through service)
  }) {
  }
}

export class SectionsStatusUpdated implements Action {
  readonly type = SectionActionTypes.SectionsStatusUpdated;

  constructor(public payload: {
    sections: SectionDtoModel[],
    status: number
  }) {
  }
}

export class OneSectionDeleted implements Action {
  readonly type = SectionActionTypes.OneSectionDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManySectionsDeleted implements Action {
  readonly type = SectionActionTypes.ManySectionsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class SectionsPageRequested implements Action {
  readonly type = SectionActionTypes.SectionsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class SectionsPageLoaded implements Action {
  readonly type = SectionActionTypes.SectionsPageLoaded;

  constructor(public payload: { sections: SectionDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class SectionsPageCancelled implements Action {
  readonly type = SectionActionTypes.SectionsPageCancelled;
}

export class SectionsPageToggleLoading implements Action {
  readonly type = SectionActionTypes.SectionsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class SectionActionToggleLoading implements Action {
  readonly type = SectionActionTypes.SectionActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type SectionActions = SectionOnServerCreated
| SectionCreated
| SectionUpdated
| SectionsStatusUpdated
| OneSectionDeleted
| ManySectionsDeleted
| SectionsPageRequested
| SectionsPageLoaded
| SectionsPageCancelled
| SectionsPageToggleLoading
| SectionActionToggleLoading;
