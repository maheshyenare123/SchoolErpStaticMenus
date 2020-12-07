// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ClassTimetableModel } from '../_models/class-timetable.model';

export enum ClassTimetableActionTypes {
  ClassTimetableOnServerCreated = '[Edit ClassTimetable Dialog] ClassTimetable On Server Created',
  ClassTimetableCreated = '[Edit ClassTimetable Dialog] ClassTimetable Created',
  ClassTimetableUpdated = '[Edit ClassTimetable Dialog] ClassTimetable Updated',
  ClassTimetablesStatusUpdated = '[ClassTimetable List Page] ClassTimetables Status Updated',
  OneClassTimetableDeleted = '[ClassTimetables List Page] One ClassTimetable Deleted',
  ManyClassTimetablesDeleted = '[ClassTimetables List Page] Many ClassTimetable Deleted',
  ClassTimetablesPageRequested = '[ClassTimetables List Page] ClassTimetables Page Requested',
  ClassTimetablesPageLoaded = '[ClassTimetables API] ClassTimetables Page Loaded',
  ClassTimetablesPageCancelled = '[ClassTimetables API] ClassTimetables Page Cancelled',
  ClassTimetablesPageToggleLoading = '[ClassTimetables] ClassTimetables Page Toggle Loading',
  ClassTimetableActionToggleLoading = '[ClassTimetables] ClassTimetables Action Toggle Loading'
}

export class ClassTimetableOnServerCreated implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetableOnServerCreated;
  constructor(public payload: { classTimetable: ClassTimetableModel }) {
  }
}

export class ClassTimetableCreated implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetableCreated;

  constructor(public payload: { classTimetable: ClassTimetableModel }) {
  }
}

export class ClassTimetableUpdated implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetableUpdated;

  constructor(public payload: {
    partialClassTimetable: Update<ClassTimetableModel>, // For State update
    classTimetable: ClassTimetableModel // For Server update (through service)
  }) {
  }
}

export class ClassTimetablesStatusUpdated implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetablesStatusUpdated;

  constructor(public payload: {
    classTimetables: ClassTimetableModel[],
    status: number
  }) {
  }
}

export class OneClassTimetableDeleted implements Action {
  readonly type = ClassTimetableActionTypes.OneClassTimetableDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyClassTimetablesDeleted implements Action {
  readonly type = ClassTimetableActionTypes.ManyClassTimetablesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ClassTimetablesPageRequested implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetablesPageRequested;

  constructor(public payload: { page: QueryParamsModel ,classId:number,sectionId:number}) {
  }
}

export class ClassTimetablesPageLoaded implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetablesPageLoaded;

  constructor(public payload: { classTimetables: ClassTimetableModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ClassTimetablesPageCancelled implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetablesPageCancelled;
}

export class ClassTimetablesPageToggleLoading implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetablesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ClassTimetableActionToggleLoading implements Action {
  readonly type = ClassTimetableActionTypes.ClassTimetableActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ClassTimetableActions = ClassTimetableOnServerCreated
| ClassTimetableCreated
| ClassTimetableUpdated
| ClassTimetablesStatusUpdated
| OneClassTimetableDeleted
| ManyClassTimetablesDeleted
| ClassTimetablesPageRequested
| ClassTimetablesPageLoaded
| ClassTimetablesPageCancelled
| ClassTimetablesPageToggleLoading
| ClassTimetableActionToggleLoading;
