// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { HomeworkDtoModel } from '../_models/homeworkDto.model';

export enum HomeworkActionTypes {
  HomeworkOnServerCreated = '[Edit Homework Dialog] Homework On Server Created',
  HomeworkCreated = '[Edit Homework Dialog] Homework Created',
  HomeworkUpdated = '[Edit Homework Dialog] Homework Updated',
  HomeworksStatusUpdated = '[Homework List Page] Homeworks Status Updated',
  OneHomeworkDeleted = '[Homeworks List Page] One Homework Deleted',
  ManyHomeworksDeleted = '[Homeworks List Page] Many Homework Deleted',
  HomeworksPageRequested = '[Homeworks List Page] Homeworks Page Requested',
  HomeworksPageLoaded = '[Homeworks API] Homeworks Page Loaded',
  HomeworksPageCancelled = '[Homeworks API] Homeworks Page Cancelled',
  HomeworksPageToggleLoading = '[Homeworks] Homeworks Page Toggle Loading',
  HomeworkActionToggleLoading = '[Homeworks] Homeworks Action Toggle Loading'
}

export class HomeworkOnServerCreated implements Action {
  readonly type = HomeworkActionTypes.HomeworkOnServerCreated;
  constructor(public payload: { homework: HomeworkDtoModel }) {
  }
}

export class HomeworkCreated implements Action {
  readonly type = HomeworkActionTypes.HomeworkCreated;

  constructor(public payload: { homework: HomeworkDtoModel }) {
  }
}

export class HomeworkUpdated implements Action {
  readonly type = HomeworkActionTypes.HomeworkUpdated;

  constructor(public payload: {
    partialHomework: Update<HomeworkDtoModel>, // For State update
    homework: HomeworkDtoModel // For Server update (through service)
  }) {
  }
}

export class HomeworksStatusUpdated implements Action {
  readonly type = HomeworkActionTypes.HomeworksStatusUpdated;

  constructor(public payload: {
    homeworks: HomeworkDtoModel[],
    status: number
  }) {
  }
}

export class OneHomeworkDeleted implements Action {
  readonly type = HomeworkActionTypes.OneHomeworkDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyHomeworksDeleted implements Action {
  readonly type = HomeworkActionTypes.ManyHomeworksDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class HomeworksPageRequested implements Action {
  readonly type = HomeworkActionTypes.HomeworksPageRequested;

  constructor(public payload: { page: QueryParamsModel,classId:number,sectionId:number,subjectGroupSubjectId:number,subjectId:number }) {
  }
}

export class HomeworksPageLoaded implements Action {
  readonly type = HomeworkActionTypes.HomeworksPageLoaded;

  constructor(public payload: { homeworks: HomeworkDtoModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class HomeworksPageCancelled implements Action {
  readonly type = HomeworkActionTypes.HomeworksPageCancelled;
}

export class HomeworksPageToggleLoading implements Action {
  readonly type = HomeworkActionTypes.HomeworksPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class HomeworkActionToggleLoading implements Action {
  readonly type = HomeworkActionTypes.HomeworkActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type HomeworkActions = HomeworkOnServerCreated
| HomeworkCreated
| HomeworkUpdated
| HomeworksStatusUpdated
| OneHomeworkDeleted
| ManyHomeworksDeleted
| HomeworksPageRequested
| HomeworksPageLoaded
| HomeworksPageCancelled
| HomeworksPageToggleLoading
| HomeworkActionToggleLoading;
