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
import {BookIssueReturnService} from '../_services/book-issue-retrun.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  BookIssueReturnActionToggleLoading,
  BookIssueReturnActionTypes,
  BookIssueReturnCreated,
  BookIssueReturnOnServerCreated,
  BookIssueReturnsPageLoaded,
  BookIssueReturnsPageRequested,
  BookIssueReturnsPageToggleLoading,
  BookIssueReturnsStatusUpdated,
  BookIssueReturnUpdated,
  ManyBookIssueReturnsDeleted,
  OneBookIssueReturnDeleted
} from '../_actions/book-issue-retrun.actions';

@Injectable()
export class BookIssueReturnEffects {
  showPageLoadingDistpatcher = new BookIssueReturnsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new BookIssueReturnActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new BookIssueReturnActionToggleLoading({isLoading: false});

  @Effect()
  loadBookIssueReturnsPage$ = this.actions$.pipe(
    ofType<BookIssueReturnsPageRequested>(BookIssueReturnActionTypes.BookIssueReturnsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.bookIssueReturnsService.findBookIssueReturns(payload.page,payload.id);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data1=result['data'];
      const data : FindResultsModel= data1['issuedBook'];
      
      
      return new BookIssueReturnsPageLoaded({
        bookIssueReturns: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteBookIssueReturn$ = this.actions$
    .pipe(
      ofType<OneBookIssueReturnDeleted>(BookIssueReturnActionTypes.OneBookIssueReturnDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.bookIssueReturnsService.deleteBookIssueReturn(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteBookIssueReturns$ = this.actions$
    .pipe(
      ofType<ManyBookIssueReturnsDeleted>(BookIssueReturnActionTypes.ManyBookIssueReturnsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.bookIssueReturnsService.deleteBookIssueReturns(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateBookIssueReturn$ = this.actions$
    .pipe(
      ofType<BookIssueReturnUpdated>(BookIssueReturnActionTypes.BookIssueReturnUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.bookIssueReturnsService.updateBookIssueReturn(payload.bookIssueReturn);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateBookIssueReturnsStatus$ = this.actions$
    .pipe(
      ofType<BookIssueReturnsStatusUpdated>(BookIssueReturnActionTypes.BookIssueReturnsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.bookIssueReturnsService.updateStatusForBookIssueReturn(payload.bookIssueReturns, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createBookIssueReturn$ = this.actions$
    .pipe(
      ofType<BookIssueReturnOnServerCreated>(BookIssueReturnActionTypes.BookIssueReturnOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.bookIssueReturnsService.createBookIssueReturn(payload.bookIssueReturn).pipe(
          tap(res => {
            this.store.dispatch(new BookIssueReturnCreated({bookIssueReturn: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private bookIssueReturnsService: BookIssueReturnService, private store: Store<AppState>) {
  }
}
