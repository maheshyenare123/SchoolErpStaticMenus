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
import {VisitorPurposeService} from '../_services/visitor-purpose.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  VisitorPurposeActionToggleLoading,
  VisitorPurposeActionTypes,
  VisitorPurposeCreated,
  VisitorPurposeOnServerCreated,
  VisitorPurposesPageLoaded,
  VisitorPurposesPageRequested,
  VisitorPurposesPageToggleLoading,
  VisitorPurposesStatusUpdated,
  VisitorPurposeUpdated,
  ManyVisitorPurposesDeleted,
  OneVisitorPurposeDeleted
} from '../_actions/visitor-purpose.actions';

@Injectable()
export class VisitorPurposeEffects {
  showPageLoadingDistpatcher = new VisitorPurposesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new VisitorPurposeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new VisitorPurposeActionToggleLoading({isLoading: false});

  @Effect()
  loadVisitorPurposesPage$ = this.actions$.pipe(
    ofType<VisitorPurposesPageRequested>(VisitorPurposeActionTypes.VisitorPurposesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.visitorPurposesService.findVisitorPurposes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new VisitorPurposesPageLoaded({
        visitorPurposes: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteVisitorPurpose$ = this.actions$
    .pipe(
      ofType<OneVisitorPurposeDeleted>(VisitorPurposeActionTypes.OneVisitorPurposeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.visitorPurposesService.deleteVisitorPurpose(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteVisitorPurposes$ = this.actions$
    .pipe(
      ofType<ManyVisitorPurposesDeleted>(VisitorPurposeActionTypes.ManyVisitorPurposesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.visitorPurposesService.deleteVisitorPurposes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateVisitorPurpose$ = this.actions$
    .pipe(
      ofType<VisitorPurposeUpdated>(VisitorPurposeActionTypes.VisitorPurposeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.visitorPurposesService.updateVisitorPurpose(payload.visitorPurpose);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateVisitorPurposesStatus$ = this.actions$
    .pipe(
      ofType<VisitorPurposesStatusUpdated>(VisitorPurposeActionTypes.VisitorPurposesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.visitorPurposesService.updateStatusForVisitorPurpose(payload.visitorPurposes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createVisitorPurpose$ = this.actions$
    .pipe(
      ofType<VisitorPurposeOnServerCreated>(VisitorPurposeActionTypes.VisitorPurposeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.visitorPurposesService.createVisitorPurpose(payload.visitorPurpose).pipe(
          tap(res => {
            this.store.dispatch(new VisitorPurposeCreated({visitorPurpose: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private visitorPurposesService: VisitorPurposeService, private store: Store<AppState>) {
  }
}
