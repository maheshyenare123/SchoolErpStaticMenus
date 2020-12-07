// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';

export enum DisabledStudentActionTypes {
  DisabledStudentOnServerCreated = '[Edit DisabledStudent Dialog] DisabledStudent On Server Created',
  DisabledStudentCreated = '[Edit DisabledStudent Dialog] DisabledStudent Created',
  DisabledStudentUpdated = '[Edit DisabledStudent Dialog] DisabledStudent Updated',
  DisabledStudentsStatusUpdated = '[DisabledStudent List Page] DisabledStudents Status Updated',
  OneDisabledStudentDeleted = '[DisabledStudents List Page] One DisabledStudent Deleted',
  ManyDisabledStudentsDeleted = '[DisabledStudents List Page] Many DisabledStudent Deleted',
  DisabledStudentsPageRequested = '[DisabledStudents List Page] DisabledStudents Page Requested',
  DisabledStudentsPageLoaded = '[DisabledStudents API] DisabledStudents Page Loaded',
  DisabledStudentsPageCancelled = '[DisabledStudents API] DisabledStudents Page Cancelled',
  DisabledStudentsPageToggleLoading = '[DisabledStudents] DisabledStudents Page Toggle Loading',
  DisabledStudentActionToggleLoading = '[DisabledStudents] DisabledStudents Action Toggle Loading'
}

export class DisabledStudentOnServerCreated implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentOnServerCreated;
  constructor(public payload: { disabledStudent: StudentDtoModel }) {
  }
}

export class DisabledStudentCreated implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentCreated;

  constructor(public payload: { disabledStudent: StudentDtoModel }) {
  }
}

export class DisabledStudentUpdated implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentUpdated;

  constructor(public payload: {
    partialDisabledStudent: Update<StudentDtoModel>, // For State update
    disabledStudent: StudentDtoModel // For Server update (through service)
  }) {
  }
}

export class DisabledStudentsStatusUpdated implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentsStatusUpdated;

  constructor(public payload: {
    disabledStudents: StudentDtoModel[],
    status: number
  }) {
  }
}

export class OneDisabledStudentDeleted implements Action {
  readonly type = DisabledStudentActionTypes.OneDisabledStudentDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyDisabledStudentsDeleted implements Action {
  readonly type = DisabledStudentActionTypes.ManyDisabledStudentsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class DisabledStudentsPageRequested implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentsPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number }) {
  }
}

export class DisabledStudentsPageLoaded implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentsPageLoaded;

  constructor(public payload: { disabledStudents: StudentDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class DisabledStudentsPageCancelled implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentsPageCancelled;
}

export class DisabledStudentsPageToggleLoading implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class DisabledStudentActionToggleLoading implements Action {
  readonly type = DisabledStudentActionTypes.DisabledStudentActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type DisabledStudentActions = DisabledStudentOnServerCreated
| DisabledStudentCreated
| DisabledStudentUpdated
| DisabledStudentsStatusUpdated
| OneDisabledStudentDeleted
| ManyDisabledStudentsDeleted
| DisabledStudentsPageRequested
| DisabledStudentsPageLoaded
| DisabledStudentsPageCancelled
| DisabledStudentsPageToggleLoading
| DisabledStudentActionToggleLoading;
