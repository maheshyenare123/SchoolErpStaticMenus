// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { LibraryMemberListModel } from '../_models/library-member-list.model';

export enum LibraryMemberListActionTypes {
  LibraryMemberListOnServerCreated = '[Edit LibraryMemberList Dialog] LibraryMemberList On Server Created',
  LibraryMemberListCreated = '[Edit LibraryMemberList Dialog] LibraryMemberList Created',
  LibraryMemberListUpdated = '[Edit LibraryMemberList Dialog] LibraryMemberList Updated',
  LibraryMemberListsStatusUpdated = '[LibraryMemberList List Page] LibraryMemberLists Status Updated',
  OneLibraryMemberListDeleted = '[LibraryMemberLists List Page] One LibraryMemberList Deleted',
  ManyLibraryMemberListsDeleted = '[LibraryMemberLists List Page] Many LibraryMemberList Deleted',
  LibraryMemberListsPageRequested = '[LibraryMemberLists List Page] LibraryMemberLists Page Requested',
  LibraryMemberListsPageLoaded = '[LibraryMemberLists API] LibraryMemberLists Page Loaded',
  LibraryMemberListsPageCancelled = '[LibraryMemberLists API] LibraryMemberLists Page Cancelled',
  LibraryMemberListsPageToggleLoading = '[LibraryMemberLists] LibraryMemberLists Page Toggle Loading',
  LibraryMemberListActionToggleLoading = '[LibraryMemberLists] LibraryMemberLists Action Toggle Loading'
}

export class LibraryMemberListOnServerCreated implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListOnServerCreated;
  constructor(public payload: { libraryMemberList: LibraryMemberListModel }) {
  }
}

export class LibraryMemberListCreated implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListCreated;

  constructor(public payload: { libraryMemberList: LibraryMemberListModel }) {
  }
}

export class LibraryMemberListUpdated implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListUpdated;

  constructor(public payload: {
    partialLibraryMemberList: Update<LibraryMemberListModel>, // For State update
    libraryMemberList: LibraryMemberListModel // For Server update (through service)
  }) {
  }
}

export class LibraryMemberListsStatusUpdated implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListsStatusUpdated;

  constructor(public payload: {
    libraryMemberLists: LibraryMemberListModel[],
    status: number
  }) {
  }
}

export class OneLibraryMemberListDeleted implements Action {
  readonly type = LibraryMemberListActionTypes.OneLibraryMemberListDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyLibraryMemberListsDeleted implements Action {
  readonly type = LibraryMemberListActionTypes.ManyLibraryMemberListsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class LibraryMemberListsPageRequested implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class LibraryMemberListsPageLoaded implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListsPageLoaded;

  constructor(public payload: { libraryMemberLists: LibraryMemberListModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class LibraryMemberListsPageCancelled implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListsPageCancelled;
}

export class LibraryMemberListsPageToggleLoading implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class LibraryMemberListActionToggleLoading implements Action {
  readonly type = LibraryMemberListActionTypes.LibraryMemberListActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type LibraryMemberListActions = LibraryMemberListOnServerCreated
| LibraryMemberListCreated
| LibraryMemberListUpdated
| LibraryMemberListsStatusUpdated
| OneLibraryMemberListDeleted
| ManyLibraryMemberListsDeleted
| LibraryMemberListsPageRequested
| LibraryMemberListsPageLoaded
| LibraryMemberListsPageCancelled
| LibraryMemberListsPageToggleLoading
| LibraryMemberListActionToggleLoading;
