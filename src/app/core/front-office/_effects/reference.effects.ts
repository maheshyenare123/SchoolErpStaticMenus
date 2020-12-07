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
import {ReferenceService} from '../_services/reference.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  ReferenceActionToggleLoading,
  ReferenceActionTypes,
  ReferenceCreated,
  ReferenceOnServerCreated,
  ReferencesPageLoaded,
  ReferencesPageRequested,
  ReferencesPageToggleLoading,
  ReferencesStatusUpdated,
  ReferenceUpdated,
  ManyReferencesDeleted,
  OneReferenceDeleted
} from '../_actions/reference.actions';

@Injectable()
export class ReferenceEffects {
  showPageLoadingDistpatcher = new ReferencesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ReferenceActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ReferenceActionToggleLoading({isLoading: false});

  @Effect()
  loadReferencesPage$ = this.actions$.pipe(
    ofType<ReferencesPageRequested>(ReferenceActionTypes.ReferencesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.referencesService.findReferences(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ReferencesPageLoaded({
        references: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteReference$ = this.actions$
    .pipe(
      ofType<OneReferenceDeleted>(ReferenceActionTypes.OneReferenceDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.referencesService.deleteReference(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteReferences$ = this.actions$
    .pipe(
      ofType<ManyReferencesDeleted>(ReferenceActionTypes.ManyReferencesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.referencesService.deleteReferences(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateReference$ = this.actions$
    .pipe(
      ofType<ReferenceUpdated>(ReferenceActionTypes.ReferenceUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.referencesService.updateReference(payload.reference);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateReferencesStatus$ = this.actions$
    .pipe(
      ofType<ReferencesStatusUpdated>(ReferenceActionTypes.ReferencesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.referencesService.updateStatusForReference(payload.references, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createReference$ = this.actions$
    .pipe(
      ofType<ReferenceOnServerCreated>(ReferenceActionTypes.ReferenceOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.referencesService.createReference(payload.reference).pipe(
          tap(res => {
            this.store.dispatch(new ReferenceCreated({reference: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private referencesService: ReferenceService, private store: Store<AppState>) {
  }
}
