// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { AssignClassTeacherModel } from '../_models/assign-class-teacher.model';

export enum AssignClassTeacherActionTypes {
  AssignClassTeacherOnServerCreated = '[Edit AssignClassTeacher Dialog] AssignClassTeacher On Server Created',
  AssignClassTeacherCreated = '[Edit AssignClassTeacher Dialog] AssignClassTeacher Created',
  AssignClassTeacherUpdated = '[Edit AssignClassTeacher Dialog] AssignClassTeacher Updated',
  AssignClassTeachersStatusUpdated = '[AssignClassTeacher List Page] AssignClassTeachers Status Updated',
  OneAssignClassTeacherDeleted = '[AssignClassTeachers List Page] One AssignClassTeacher Deleted',
  ManyAssignClassTeachersDeleted = '[AssignClassTeachers List Page] Many AssignClassTeacher Deleted',
  AssignClassTeachersPageRequested = '[AssignClassTeachers List Page] AssignClassTeachers Page Requested',
  AssignClassTeachersPageLoaded = '[AssignClassTeachers API] AssignClassTeachers Page Loaded',
  AssignClassTeachersPageCancelled = '[AssignClassTeachers API] AssignClassTeachers Page Cancelled',
  AssignClassTeachersPageToggleLoading = '[AssignClassTeachers] AssignClassTeachers Page Toggle Loading',
  AssignClassTeacherActionToggleLoading = '[AssignClassTeachers] AssignClassTeachers Action Toggle Loading'
}

export class AssignClassTeacherOnServerCreated implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeacherOnServerCreated;
  constructor(public payload: { assignClassTeacher: AssignClassTeacherModel }) {
  }
}

export class AssignClassTeacherCreated implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeacherCreated;

  constructor(public payload: { assignClassTeacher: AssignClassTeacherModel }) {
  }
}

export class AssignClassTeacherUpdated implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeacherUpdated;

  constructor(public payload: {
    partialAssignClassTeacher: Update<AssignClassTeacherModel>, // For State update
    assignClassTeacher: AssignClassTeacherModel // For Server update (through service)
  }) {
  }
}

export class AssignClassTeachersStatusUpdated implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeachersStatusUpdated;

  constructor(public payload: {
    assignClassTeachers: AssignClassTeacherModel[],
    status: number
  }) {
  }
}

export class OneAssignClassTeacherDeleted implements Action {
  readonly type = AssignClassTeacherActionTypes.OneAssignClassTeacherDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyAssignClassTeachersDeleted implements Action {
  readonly type = AssignClassTeacherActionTypes.ManyAssignClassTeachersDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class AssignClassTeachersPageRequested implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeachersPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class AssignClassTeachersPageLoaded implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeachersPageLoaded;

  constructor(public payload: { assignClassTeachers: AssignClassTeacherModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class AssignClassTeachersPageCancelled implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeachersPageCancelled;
}

export class AssignClassTeachersPageToggleLoading implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeachersPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class AssignClassTeacherActionToggleLoading implements Action {
  readonly type = AssignClassTeacherActionTypes.AssignClassTeacherActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type AssignClassTeacherActions = AssignClassTeacherOnServerCreated
| AssignClassTeacherCreated
| AssignClassTeacherUpdated
| AssignClassTeachersStatusUpdated
| OneAssignClassTeacherDeleted
| ManyAssignClassTeachersDeleted
| AssignClassTeachersPageRequested
| AssignClassTeachersPageLoaded
| AssignClassTeachersPageCancelled
| AssignClassTeachersPageToggleLoading
| AssignClassTeacherActionToggleLoading;
