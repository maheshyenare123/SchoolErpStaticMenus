// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { NoticeBoardModel } from '../_models/notice-board.model';

export enum NoticeBoardActionTypes {
  NoticeBoardOnServerCreated = '[Edit NoticeBoard Dialog] NoticeBoard On Server Created',
  NoticeBoardCreated = '[Edit NoticeBoard Dialog] NoticeBoard Created',
  NoticeBoardUpdated = '[Edit NoticeBoard Dialog] NoticeBoard Updated',
  NoticeBoardsStatusUpdated = '[NoticeBoard List Page] NoticeBoards Status Updated',
  OneNoticeBoardDeleted = '[NoticeBoards List Page] One NoticeBoard Deleted',
  ManyNoticeBoardsDeleted = '[NoticeBoards List Page] Many NoticeBoard Deleted',
  NoticeBoardsPageRequested = '[NoticeBoards List Page] NoticeBoards Page Requested',
  NoticeBoardsPageLoaded = '[NoticeBoards API] NoticeBoards Page Loaded',
  NoticeBoardsPageCancelled = '[NoticeBoards API] NoticeBoards Page Cancelled',
  NoticeBoardsPageToggleLoading = '[NoticeBoards] NoticeBoards Page Toggle Loading',
  NoticeBoardActionToggleLoading = '[NoticeBoards] NoticeBoards Action Toggle Loading'
}

export class NoticeBoardOnServerCreated implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardOnServerCreated;
  constructor(public payload: { noticeBoard: NoticeBoardModel }) {
  }
}

export class NoticeBoardCreated implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardCreated;

  constructor(public payload: { noticeBoard: NoticeBoardModel }) {
  }
}

export class NoticeBoardUpdated implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardUpdated;

  constructor(public payload: {
    partialNoticeBoard: Update<NoticeBoardModel>, // For State update
    noticeBoard: NoticeBoardModel // For Server update (through service)
  }) {
  }
}

export class NoticeBoardsStatusUpdated implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardsStatusUpdated;

  constructor(public payload: {
    noticeBoards: NoticeBoardModel[],
    status: number
  }) {
  }
}

export class OneNoticeBoardDeleted implements Action {
  readonly type = NoticeBoardActionTypes.OneNoticeBoardDeleted;

  constructor(public payload: { id: number }) {
  }
}

export class ManyNoticeBoardsDeleted implements Action {
  readonly type = NoticeBoardActionTypes.ManyNoticeBoardsDeleted;

  constructor(public payload: { ids: number[] }) {
  }
}

export class NoticeBoardsPageRequested implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardsPageRequested;

  constructor(public payload: { page: QueryParamsModel }) {
  }
}

export class NoticeBoardsPageLoaded implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardsPageLoaded;

  constructor(public payload: { noticeBoards: NoticeBoardModel[], totalCount: number, page: QueryParamsModel }) {
  }
}

export class NoticeBoardsPageCancelled implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardsPageCancelled;
}

export class NoticeBoardsPageToggleLoading implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardsPageToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export class NoticeBoardActionToggleLoading implements Action {
  readonly type = NoticeBoardActionTypes.NoticeBoardActionToggleLoading;

  constructor(public payload: { isLoading: boolean }) {
  }
}

export type NoticeBoardActions = NoticeBoardOnServerCreated
| NoticeBoardCreated
| NoticeBoardUpdated
| NoticeBoardsStatusUpdated
| OneNoticeBoardDeleted
| ManyNoticeBoardsDeleted
| NoticeBoardsPageRequested
| NoticeBoardsPageLoaded
| NoticeBoardsPageCancelled
| NoticeBoardsPageToggleLoading
| NoticeBoardActionToggleLoading;
