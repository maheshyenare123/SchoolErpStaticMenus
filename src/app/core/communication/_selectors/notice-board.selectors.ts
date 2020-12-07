// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { NoticeBoardsState } from '../_reducers/notice-board.reducers';
import { NoticeBoardModel } from '../_models/notice-board.model';

export const selectNoticeBoardsState = createFeatureSelector<NoticeBoardsState>('noticeBoards');

export const selectNoticeBoardById = (noticeBoardId: number) => createSelector(
    selectNoticeBoardsState,
    noticeBoardsState => noticeBoardsState.entities[noticeBoardId]
);

export const selectNoticeBoardsPageLoading = createSelector(
    selectNoticeBoardsState,
    noticeBoardsState => noticeBoardsState.listLoading
);

export const selectNoticeBoardsActionLoading = createSelector(
    selectNoticeBoardsState,
    noticeBoardsState => noticeBoardsState.actionsloading
);

export const selectLastCreatedNoticeBoardId = createSelector(
    selectNoticeBoardsState,
    noticeBoardsState => noticeBoardsState.lastCreatedNoticeBoardId
);

export const selectNoticeBoardsShowInitWaitingMessage = createSelector(
    selectNoticeBoardsState,
    noticeBoardsState => noticeBoardsState.showInitWaitingMessage
);

export const selectNoticeBoardsInStore = createSelector(
    selectNoticeBoardsState,
    noticeBoardsState => {
      const items: NoticeBoardModel[] = [];
      each(noticeBoardsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: NoticeBoardModel[] =
        httpExtension.sortArray(items, noticeBoardsState.lastQuery.sortField, noticeBoardsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, noticeBoardsState.totalCount, '');
    }
);
