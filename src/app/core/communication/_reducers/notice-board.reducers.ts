// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { NoticeBoardActions, NoticeBoardActionTypes } from '../_actions/notice-board.actions';
// Models
import { NoticeBoardModel } from '../_models/notice-board.model';
import { QueryParamsModel } from '../../_base/crud';

export interface NoticeBoardsState extends EntityState<NoticeBoardModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedNoticeBoardId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<NoticeBoardModel> = createEntityAdapter<NoticeBoardModel>();

export const initialNoticeBoardsState: NoticeBoardsState = adapter.getInitialState({
  noticeBoardForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedNoticeBoardId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});


export function noticeBoardsReducer(state = initialNoticeBoardsState, action: NoticeBoardActions): NoticeBoardsState {
  switch (action.type) {
    case NoticeBoardActionTypes.NoticeBoardsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedNoticeBoardId: undefined
      };
    }
    case NoticeBoardActionTypes.NoticeBoardActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case NoticeBoardActionTypes.NoticeBoardOnServerCreated:
      return {
        ...state
      };
    case NoticeBoardActionTypes.NoticeBoardCreated:
      return adapter.addOne(action.payload.noticeBoard, {
        ...state, lastCreatedNoticeBoardId: action.payload.noticeBoard.id
      });
    case NoticeBoardActionTypes.NoticeBoardUpdated:
      return adapter.updateOne(action.payload.partialNoticeBoard, state);
    // case NoticeBoardActionTypes.NoticeBoardsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialNoticeBoards: Update<NoticeBoardModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.noticeBoards.length; i++) {
    //     _partialNoticeBoards.push({
    //       id: action.payload.noticeBoards[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialNoticeBoards, state);
    // }
    case NoticeBoardActionTypes.OneNoticeBoardDeleted:
      return adapter.removeOne(action.payload.id, state);
    case NoticeBoardActionTypes.ManyNoticeBoardsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case NoticeBoardActionTypes.NoticeBoardsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case NoticeBoardActionTypes.NoticeBoardsPageLoaded: {
      return adapter.addMany(action.payload.noticeBoards, {
        ...initialNoticeBoardsState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    }
    default:
      return state;
  }
}

export const getNoticeBoardState = createFeatureSelector<NoticeBoardModel>('noticeBoards');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
