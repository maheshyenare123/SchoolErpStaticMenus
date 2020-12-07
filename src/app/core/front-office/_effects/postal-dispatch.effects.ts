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
import {PostalDispatchService} from '../_services/postal-dispatch.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  PostalDispatchActionToggleLoading,
  PostalDispatchActionTypes,
  PostalDispatchCreated,
  PostalDispatchOnServerCreated,
  PostalDispatchsPageLoaded,
  PostalDispatchsPageRequested,
  PostalDispatchsPageToggleLoading,
  PostalDispatchsStatusUpdated,
  PostalDispatchUpdated,
  ManyPostalDispatchsDeleted,
  OnePostalDispatchDeleted
} from '../_actions/postal-dispatch.actions';

@Injectable()
export class PostalDispatchEffects {
  showPageLoadingDistpatcher = new PostalDispatchsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new PostalDispatchActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new PostalDispatchActionToggleLoading({isLoading: false});

  @Effect()
  loadPostalDispatchsPage$ = this.actions$.pipe(
    ofType<PostalDispatchsPageRequested>(PostalDispatchActionTypes.PostalDispatchsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.postalDispatchsService.findPostalDispatchs(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger;
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new PostalDispatchsPageLoaded({
        postalDispatchs: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  
  @Effect()
  deletePostalDispatch$ = this.actions$
    .pipe(
      ofType<OnePostalDispatchDeleted>(PostalDispatchActionTypes.OnePostalDispatchDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.postalDispatchsService.deletePostalDispatch(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deletePostalDispatchs$ = this.actions$
    .pipe(
      ofType<ManyPostalDispatchsDeleted>(PostalDispatchActionTypes.ManyPostalDispatchsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.postalDispatchsService.deletePostalDispatchs(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updatePostalDispatch$ = this.actions$
    .pipe(
      ofType<PostalDispatchUpdated>(PostalDispatchActionTypes.PostalDispatchUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.postalDispatchsService.updatePostalDispatch(payload.postalDispatch);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updatePostalDispatchsStatus$ = this.actions$
    .pipe(
      ofType<PostalDispatchsStatusUpdated>(PostalDispatchActionTypes.PostalDispatchsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.postalDispatchsService.updateStatusForPostalDispatch(payload.postalDispatchs, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createPostalDispatch$ = this.actions$
    .pipe(
      ofType<PostalDispatchOnServerCreated>(PostalDispatchActionTypes.PostalDispatchOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.postalDispatchsService.createPostalDispatch(payload.postalDispatch).pipe(
          tap(res => {
            this.store.dispatch(new PostalDispatchCreated({postalDispatch: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private postalDispatchsService: PostalDispatchService, private store: Store<AppState>) {
  }
}
