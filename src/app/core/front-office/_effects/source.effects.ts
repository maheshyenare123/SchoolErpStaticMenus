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
import {SourceService} from '../_services/source.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  SourceActionToggleLoading,
  SourceActionTypes,
  SourceCreated,
  SourceOnServerCreated,
  SourcesPageLoaded,
  SourcesPageRequested,
  SourcesPageToggleLoading,
  SourcesStatusUpdated,
  SourceUpdated,
  ManySourcesDeleted,
  OneSourceDeleted
} from '../_actions/source.actions';

@Injectable()
export class SourceEffects {
  showPageLoadingDistpatcher = new SourcesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new SourceActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new SourceActionToggleLoading({isLoading: false});

  @Effect()
  loadSourcesPage$ = this.actions$.pipe(
    ofType<SourcesPageRequested>(SourceActionTypes.SourcesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.sourcesService.findSources(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new SourcesPageLoaded({
        sources: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteSource$ = this.actions$
    .pipe(
      ofType<OneSourceDeleted>(SourceActionTypes.OneSourceDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.sourcesService.deleteSource(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteSources$ = this.actions$
    .pipe(
      ofType<ManySourcesDeleted>(SourceActionTypes.ManySourcesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.sourcesService.deleteSources(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateSource$ = this.actions$
    .pipe(
      ofType<SourceUpdated>(SourceActionTypes.SourceUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sourcesService.updateSource(payload.source);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateSourcesStatus$ = this.actions$
    .pipe(
      ofType<SourcesStatusUpdated>(SourceActionTypes.SourcesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sourcesService.updateStatusForSource(payload.sources, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createSource$ = this.actions$
    .pipe(
      ofType<SourceOnServerCreated>(SourceActionTypes.SourceOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sourcesService.createSource(payload.source).pipe(
          tap(res => {
            this.store.dispatch(new SourceCreated({source: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private sourcesService: SourceService, private store: Store<AppState>) {
  }
}
