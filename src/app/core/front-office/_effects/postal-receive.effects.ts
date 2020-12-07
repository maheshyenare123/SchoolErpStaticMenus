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
import {PostalReceiveService} from '../_services/postal-receive.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  PostalReceiveActionToggleLoading,
  PostalReceiveActionTypes,
  PostalReceiveCreated,
  PostalReceiveOnServerCreated,
  PostalReceivesPageLoaded,
  PostalReceivesPageRequested,
  PostalReceivesPageToggleLoading,
  PostalReceivesStatusUpdated,
  PostalReceiveUpdated,
  ManyPostalReceivesDeleted,
  OnePostalReceiveDeleted
} from '../_actions/postal-receive.actions';

@Injectable()
export class PostalReceiveEffects {
  showPageLoadingDistpatcher = new PostalReceivesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new PostalReceiveActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new PostalReceiveActionToggleLoading({isLoading: false});

  @Effect()
  loadPostalReceivesPage$ = this.actions$.pipe(
    ofType<PostalReceivesPageRequested>(PostalReceiveActionTypes.PostalReceivesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.postalReceivesService.findPostalReceives(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger;
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new PostalReceivesPageLoaded({
        postalReceives: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

 
  @Effect()
  deletePostalReceive$ = this.actions$
    .pipe(
      ofType<OnePostalReceiveDeleted>(PostalReceiveActionTypes.OnePostalReceiveDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.postalReceivesService.deletePostalReceive(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deletePostalReceives$ = this.actions$
    .pipe(
      ofType<ManyPostalReceivesDeleted>(PostalReceiveActionTypes.ManyPostalReceivesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.postalReceivesService.deletePostalReceives(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updatePostalReceive$ = this.actions$
    .pipe(
      ofType<PostalReceiveUpdated>(PostalReceiveActionTypes.PostalReceiveUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.postalReceivesService.updatePostalReceive(payload.postalReceive);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updatePostalReceivesStatus$ = this.actions$
    .pipe(
      ofType<PostalReceivesStatusUpdated>(PostalReceiveActionTypes.PostalReceivesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.postalReceivesService.updateStatusForPostalReceive(payload.postalReceives, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createPostalReceive$ = this.actions$
    .pipe(
      ofType<PostalReceiveOnServerCreated>(PostalReceiveActionTypes.PostalReceiveOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.postalReceivesService.createPostalReceive(payload.postalReceive).pipe(
          tap(res => {
            this.store.dispatch(new PostalReceiveCreated({postalReceive: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private postalReceivesService: PostalReceiveService, private store: Store<AppState>) {
  }
}
