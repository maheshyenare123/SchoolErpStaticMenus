// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { LibraryStudentMemberModel } from '../_models/library-student-member.model';

export enum LibraryStudentMemberActionTypes {
  LibraryStudentMemberOnServerCreated = '[Edit LibraryStudentMember Dialog] LibraryStudentMember On Server Created',
  LibraryStudentMemberCreated = '[Edit LibraryStudentMember Dialog] LibraryStudentMember Created',
  LibraryStudentMemberUpdated = '[Edit LibraryStudentMember Dialog] LibraryStudentMember Updated',
  LibraryStudentMembersStatusUpdated = '[LibraryStudentMember List Page] LibraryStudentMembers Status Updated',
  OneLibraryStudentMemberDeleted = '[LibraryStudentMembers List Page] One LibraryStudentMember Deleted',
  ManyLibraryStudentMembersDeleted = '[LibraryStudentMembers List Page] Many LibraryStudentMember Deleted',
  LibraryStudentMembersPageRequested = '[LibraryStudentMembers List Page] LibraryStudentMembers Page Requested',
  LibraryStudentMembersPageLoaded = '[LibraryStudentMembers API] LibraryStudentMembers Page Loaded',
  LibraryStudentMembersPageCancelled = '[LibraryStudentMembers API] LibraryStudentMembers Page Cancelled',
  LibraryStudentMembersPageToggleLoading = '[LibraryStudentMembers] LibraryStudentMembers Page Toggle Loading',
  LibraryStudentMemberActionToggleLoading = '[LibraryStudentMembers] LibraryStudentMembers Action Toggle Loading'
}

export class LibraryStudentMemberOnServerCreated implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMemberOnServerCreated;
  constructor(public payload: { libraryStudentMember: LibraryStudentMemberModel }) {
  }
}

export class LibraryStudentMemberCreated implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMemberCreated;

  constructor(public payload: { libraryStudentMember: LibraryStudentMemberModel }) {
  }
}

export class LibraryStudentMemberUpdated implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMemberUpdated;

  constructor(public payload: {
    partialLibraryStudentMember: Update<LibraryStudentMemberModel>, // For State update
    libraryStudentMember: LibraryStudentMemberModel // For Server update (through service)
  }) {
  }
}

export class LibraryStudentMembersStatusUpdated implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMembersStatusUpdated;

  constructor(public payload: {
    libraryStudentMembers: LibraryStudentMemberModel[],
    status: number
  }) {
  }
}

export class OneLibraryStudentMemberDeleted implements Action {
  readonly type = LibraryStudentMemberActionTypes.OneLibraryStudentMemberDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyLibraryStudentMembersDeleted implements Action {
  readonly type = LibraryStudentMemberActionTypes.ManyLibraryStudentMembersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class LibraryStudentMembersPageRequested implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMembersPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number }) {
  }
}

export class LibraryStudentMembersPageLoaded implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMembersPageLoaded;

  constructor(public payload: { libraryStudentMembers: LibraryStudentMemberModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class LibraryStudentMembersPageCancelled implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMembersPageCancelled;
}

export class LibraryStudentMembersPageToggleLoading implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMembersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class LibraryStudentMemberActionToggleLoading implements Action {
  readonly type = LibraryStudentMemberActionTypes.LibraryStudentMemberActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type LibraryStudentMemberActions = LibraryStudentMemberOnServerCreated
| LibraryStudentMemberCreated
| LibraryStudentMemberUpdated
| LibraryStudentMembersStatusUpdated
| OneLibraryStudentMemberDeleted
| ManyLibraryStudentMembersDeleted
| LibraryStudentMembersPageRequested
| LibraryStudentMembersPageLoaded
| LibraryStudentMembersPageCancelled
| LibraryStudentMembersPageToggleLoading
| LibraryStudentMemberActionToggleLoading;
