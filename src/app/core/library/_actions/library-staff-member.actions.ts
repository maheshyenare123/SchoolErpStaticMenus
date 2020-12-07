// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { LibraryStaffMemberModel } from '../_models/library-staff-member.model';

export enum LibraryStaffMemberActionTypes {
  LibraryStaffMemberOnServerCreated = '[Edit LibraryStaffMember Dialog] LibraryStaffMember On Server Created',
  LibraryStaffMemberCreated = '[Edit LibraryStaffMember Dialog] LibraryStaffMember Created',
  LibraryStaffMemberUpdated = '[Edit LibraryStaffMember Dialog] LibraryStaffMember Updated',
  LibraryStaffMembersStatusUpdated = '[LibraryStaffMember List Page] LibraryStaffMembers Status Updated',
  OneLibraryStaffMemberDeleted = '[LibraryStaffMembers List Page] One LibraryStaffMember Deleted',
  ManyLibraryStaffMembersDeleted = '[LibraryStaffMembers List Page] Many LibraryStaffMember Deleted',
  LibraryStaffMembersPageRequested = '[LibraryStaffMembers List Page] LibraryStaffMembers Page Requested',
  LibraryStaffMembersPageLoaded = '[LibraryStaffMembers API] LibraryStaffMembers Page Loaded',
  LibraryStaffMembersPageCancelled = '[LibraryStaffMembers API] LibraryStaffMembers Page Cancelled',
  LibraryStaffMembersPageToggleLoading = '[LibraryStaffMembers] LibraryStaffMembers Page Toggle Loading',
  LibraryStaffMemberActionToggleLoading = '[LibraryStaffMembers] LibraryStaffMembers Action Toggle Loading'
}

export class LibraryStaffMemberOnServerCreated implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMemberOnServerCreated;
  constructor(public payload: { libraryStaffMember: LibraryStaffMemberModel }) {
  }
}

export class LibraryStaffMemberCreated implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMemberCreated;

  constructor(public payload: { libraryStaffMember: LibraryStaffMemberModel }) {
  }
}

export class LibraryStaffMemberUpdated implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMemberUpdated;

  constructor(public payload: {
    partialLibraryStaffMember: Update<LibraryStaffMemberModel>, // For State update
    libraryStaffMember: LibraryStaffMemberModel // For Server update (through service)
  }) {
  }
}

export class LibraryStaffMembersStatusUpdated implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMembersStatusUpdated;

  constructor(public payload: {
    libraryStaffMembers: LibraryStaffMemberModel[],
    status: number
  }) {
  }
}

export class OneLibraryStaffMemberDeleted implements Action {
  readonly type = LibraryStaffMemberActionTypes.OneLibraryStaffMemberDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyLibraryStaffMembersDeleted implements Action {
  readonly type = LibraryStaffMemberActionTypes.ManyLibraryStaffMembersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class LibraryStaffMembersPageRequested implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMembersPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class LibraryStaffMembersPageLoaded implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMembersPageLoaded;

  constructor(public payload: { libraryStaffMembers: LibraryStaffMemberModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class LibraryStaffMembersPageCancelled implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMembersPageCancelled;
}

export class LibraryStaffMembersPageToggleLoading implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMembersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class LibraryStaffMemberActionToggleLoading implements Action {
  readonly type = LibraryStaffMemberActionTypes.LibraryStaffMemberActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type LibraryStaffMemberActions = LibraryStaffMemberOnServerCreated
| LibraryStaffMemberCreated
| LibraryStaffMemberUpdated
| LibraryStaffMembersStatusUpdated
| OneLibraryStaffMemberDeleted
| ManyLibraryStaffMembersDeleted
| LibraryStaffMembersPageRequested
| LibraryStaffMembersPageLoaded
| LibraryStaffMembersPageCancelled
| LibraryStaffMembersPageToggleLoading
| LibraryStaffMemberActionToggleLoading;
