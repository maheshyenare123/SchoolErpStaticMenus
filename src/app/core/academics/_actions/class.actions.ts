// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { ClassDtoModel } from '../_models/classDto.model';

export enum ClassActionTypes {
  ClassOnServerCreated = '[Edit Class Dialog] Class On Server Created',
  ClassCreated = '[Edit Class Dialog] Class Created',
  ClassUpdated = '[Edit Class Dialog] Class Updated',
  ClasssStatusUpdated = '[Class List Page] Classs Status Updated',
  OneClassDeleted = '[Classs List Page] One Class Deleted',
  ManyClasssDeleted = '[Classs List Page] Many Class Deleted',
  ClasssPageRequested = '[Classs List Page] Classs Page Requested',
  ClasssPageLoaded = '[Classs API] Classs Page Loaded',
  ClasssPageCancelled = '[Classs API] Classs Page Cancelled',
  ClasssPageToggleLoading = '[Classs] Classs Page Toggle Loading',
  ClassActionToggleLoading = '[Classs] Classs Action Toggle Loading'
}

export class ClassOnServerCreated implements Action {
  readonly type = ClassActionTypes.ClassOnServerCreated;
  constructor(public payload: { class: ClassDtoModel }) {
  }
}

export class ClassCreated implements Action {
  readonly type = ClassActionTypes.ClassCreated;

  constructor(public payload: { class: ClassDtoModel }) {
  }
}

export class ClassUpdated implements Action {
  readonly type = ClassActionTypes.ClassUpdated;

  constructor(public payload: {
    partialClass: Update<ClassDtoModel>, // For State update
    class: ClassDtoModel // For Server update (through service)
  }) {
  }
}

export class ClasssStatusUpdated implements Action {
  readonly type = ClassActionTypes.ClasssStatusUpdated;

  constructor(public payload: {
    classs: ClassDtoModel[],
    status: number
  }) {
  }
}

export class OneClassDeleted implements Action {
  readonly type = ClassActionTypes.OneClassDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyClasssDeleted implements Action {
  readonly type = ClassActionTypes.ManyClasssDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class ClasssPageRequested implements Action {
  readonly type = ClassActionTypes.ClasssPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class ClasssPageLoaded implements Action {
  readonly type = ClassActionTypes.ClasssPageLoaded;

  constructor(public payload: { classs: ClassDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class ClasssPageCancelled implements Action {
  readonly type = ClassActionTypes.ClasssPageCancelled;
}

export class ClasssPageToggleLoading implements Action {
  readonly type = ClassActionTypes.ClasssPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class ClassActionToggleLoading implements Action {
  readonly type = ClassActionTypes.ClassActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type ClassActions = ClassOnServerCreated
| ClassCreated
| ClassUpdated
| ClasssStatusUpdated
| OneClassDeleted
| ManyClasssDeleted
| ClasssPageRequested
| ClasssPageLoaded
| ClasssPageCancelled
| ClasssPageToggleLoading
| ClassActionToggleLoading;
