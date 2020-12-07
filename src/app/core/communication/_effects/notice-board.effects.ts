import {QueryParamsModel} from '../../_base/crud/models/query-models/query-params.model';
import {forkJoin, of} from 'rxjs';
// Angular
import {Injectable} from '@angular/core';
// RxJS
import {map, mergeMap, tap} from 'rxjs/operators';
// NGRX
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
// CRUD
import {QueryResultsModel, FindResultsModel} from '../../_base/crud';
// Services
import {NoticeBoardService} from '../_services/notice-board.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  NoticeBoardActionToggleLoading,
  NoticeBoardActionTypes,
  NoticeBoardCreated,
  NoticeBoardOnServerCreated,
  NoticeBoardsPageLoaded,
  NoticeBoardsPageRequested,
  NoticeBoardsPageToggleLoading,
  NoticeBoardsStatusUpdated,
  NoticeBoardUpdated,
  ManyNoticeBoardsDeleted,
  OneNoticeBoardDeleted
} from '../_actions/notice-board.actions';

@Injectable()
export class NoticeBoardEffects {
  showPageLoadingDistpatcher = new NoticeBoardsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new NoticeBoardActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new NoticeBoardActionToggleLoading({isLoading: false});

  @Effect()
  loadNoticeBoardsPage$ = this.actions$.pipe(
    ofType<NoticeBoardsPageRequested>(NoticeBoardActionTypes.NoticeBoardsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.noticeBoardsService.findNoticeBoards(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new NoticeBoardsPageLoaded({
        noticeBoards: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteNoticeBoard$ = this.actions$
    .pipe(
      ofType<OneNoticeBoardDeleted>(NoticeBoardActionTypes.OneNoticeBoardDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.noticeBoardsService.deleteNoticeBoard(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteNoticeBoards$ = this.actions$
    .pipe(
      ofType<ManyNoticeBoardsDeleted>(NoticeBoardActionTypes.ManyNoticeBoardsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.noticeBoardsService.deleteNoticeBoards(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateNoticeBoard$ = this.actions$
    .pipe(
      ofType<NoticeBoardUpdated>(NoticeBoardActionTypes.NoticeBoardUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.noticeBoardsService.updateNoticeBoard(payload.noticeBoard);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateNoticeBoardsStatus$ = this.actions$
    .pipe(
      ofType<NoticeBoardsStatusUpdated>(NoticeBoardActionTypes.NoticeBoardsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.noticeBoardsService.updateStatusForNoticeBoard(payload.noticeBoards, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createNoticeBoard$ = this.actions$
    .pipe(
      ofType<NoticeBoardOnServerCreated>(NoticeBoardActionTypes.NoticeBoardOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.noticeBoardsService.createNoticeBoard(payload.noticeBoard).pipe(
          tap(res => {
            this.store.dispatch(new NoticeBoardCreated({noticeBoard: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private noticeBoardsService: NoticeBoardService, private store: Store<AppState>) {
  }
}
