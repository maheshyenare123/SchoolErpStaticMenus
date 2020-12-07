import {QueryParamsModel} from './../../_base/crud/models/query-models/query-params.model';
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
import {VisitorBookService} from '../_services/visitor-book.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  VisitorBookActionToggleLoading,
  VisitorBookActionTypes,
  VisitorBookCreated,
  VisitorBookOnServerCreated,
  VisitorBooksPageLoaded,
  VisitorBooksPageRequested,
  VisitorBooksPageToggleLoading,
  VisitorBooksStatusUpdated,
  VisitorBookUpdated,
  ManyVisitorBooksDeleted,
  OneVisitorBookDeleted
} from '../_actions/visitor-book.actions';

@Injectable()
export class VisitorBookEffects {
  showPageLoadingDistpatcher = new VisitorBooksPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new VisitorBookActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new VisitorBookActionToggleLoading({isLoading: false});

  @Effect()
  loadVisitorBooksPage$ = this.actions$.pipe(
    ofType<VisitorBooksPageRequested>(VisitorBookActionTypes.VisitorBooksPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.visitorBooksService.findVisitorBooks(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new VisitorBooksPageLoaded({
        visitorBooks: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  

  @Effect()
  deleteVisitorBook$ = this.actions$
    .pipe(
      ofType<OneVisitorBookDeleted>(VisitorBookActionTypes.OneVisitorBookDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.visitorBooksService.deleteVisitorBook(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteVisitorBooks$ = this.actions$
    .pipe(
      ofType<ManyVisitorBooksDeleted>(VisitorBookActionTypes.ManyVisitorBooksDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.visitorBooksService.deleteVisitorBooks(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateVisitorBook$ = this.actions$
    .pipe(
      ofType<VisitorBookUpdated>(VisitorBookActionTypes.VisitorBookUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.visitorBooksService.updateVisitorBook(payload.visitorBook);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateVisitorBooksStatus$ = this.actions$
    .pipe(
      ofType<VisitorBooksStatusUpdated>(VisitorBookActionTypes.VisitorBooksStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.visitorBooksService.updateStatusForVisitorBook(payload.visitorBooks, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createVisitorBook$ = this.actions$
    .pipe(
      ofType<VisitorBookOnServerCreated>(VisitorBookActionTypes.VisitorBookOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.visitorBooksService.createVisitorBook(payload.visitorBook).pipe(
          tap(res => {
            this.store.dispatch(new VisitorBookCreated({visitorBook: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private visitorBooksService: VisitorBookService, private store: Store<AppState>) {
  }
}
