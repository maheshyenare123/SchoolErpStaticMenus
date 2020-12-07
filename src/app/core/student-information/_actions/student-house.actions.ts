// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { SchoolHousModel } from '../_models/schoolHous.model';

export enum StudentHouseActionTypes {
  StudentHouseOnServerCreated = '[Edit StudentHouse Dialog] StudentHouse On Server Created',
  StudentHouseCreated = '[Edit StudentHouse Dialog] StudentHouse Created',
  StudentHouseUpdated = '[Edit StudentHouse Dialog] StudentHouse Updated',
  StudentHousesStatusUpdated = '[StudentHouse List Page] StudentHouses Status Updated',
  OneStudentHouseDeleted = '[StudentHouses List Page] One StudentHouse Deleted',
  ManyStudentHousesDeleted = '[StudentHouses List Page] Many StudentHouse Deleted',
  StudentHousesPageRequested = '[StudentHouses List Page] StudentHouses Page Requested',
  StudentHousesPageLoaded = '[StudentHouses API] StudentHouses Page Loaded',
  StudentHousesPageCancelled = '[StudentHouses API] StudentHouses Page Cancelled',
  StudentHousesPageToggleLoading = '[StudentHouses] StudentHouses Page Toggle Loading',
  StudentHouseActionToggleLoading = '[StudentHouses] StudentHouses Action Toggle Loading'
}

export class StudentHouseOnServerCreated implements Action {
  readonly type = StudentHouseActionTypes.StudentHouseOnServerCreated;
  constructor(public payload: { studentHouse: SchoolHousModel }) {
  }
}

export class StudentHouseCreated implements Action {
  readonly type = StudentHouseActionTypes.StudentHouseCreated;

  constructor(public payload: { studentHouse: SchoolHousModel }) {
  }
}

export class StudentHouseUpdated implements Action {
  readonly type = StudentHouseActionTypes.StudentHouseUpdated;

  constructor(public payload: {
    partialStudentHouse: Update<SchoolHousModel>, // For State update
    studentHouse: SchoolHousModel // For Server update (through service)
  }) {
  }
}

export class StudentHousesStatusUpdated implements Action {
  readonly type = StudentHouseActionTypes.StudentHousesStatusUpdated;

  constructor(public payload: {
    studentHouses: SchoolHousModel[],
    status: number
  }) {
  }
}

export class OneStudentHouseDeleted implements Action {
  readonly type = StudentHouseActionTypes.OneStudentHouseDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyStudentHousesDeleted implements Action {
  readonly type = StudentHouseActionTypes.ManyStudentHousesDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class StudentHousesPageRequested implements Action {
  readonly type = StudentHouseActionTypes.StudentHousesPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class StudentHousesPageLoaded implements Action {
  readonly type = StudentHouseActionTypes.StudentHousesPageLoaded;

  constructor(public payload: { studentHouses: SchoolHousModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class StudentHousesPageCancelled implements Action {
  readonly type = StudentHouseActionTypes.StudentHousesPageCancelled;
}

export class StudentHousesPageToggleLoading implements Action {
  readonly type = StudentHouseActionTypes.StudentHousesPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class StudentHouseActionToggleLoading implements Action {
  readonly type = StudentHouseActionTypes.StudentHouseActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type StudentHouseActions = StudentHouseOnServerCreated
| StudentHouseCreated
| StudentHouseUpdated
| StudentHousesStatusUpdated
| OneStudentHouseDeleted
| ManyStudentHousesDeleted
| StudentHousesPageRequested
| StudentHousesPageLoaded
| StudentHousesPageCancelled
| StudentHousesPageToggleLoading
| StudentHouseActionToggleLoading;
