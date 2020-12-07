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
import {OnlineAdmissionService} from '../_services/online-admission.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  OnlineAdmissionActionToggleLoading,
  OnlineAdmissionActionTypes,
  OnlineAdmissionCreated,
  OnlineAdmissionOnServerCreated,
  OnlineAdmissionsPageLoaded,
  OnlineAdmissionsPageRequested,
  OnlineAdmissionsPageToggleLoading,
  OnlineAdmissionsStatusUpdated,
  OnlineAdmissionUpdated,
  ManyOnlineAdmissionsDeleted,
  OneOnlineAdmissionDeleted
} from '../_actions/online-admission.actions';

@Injectable()
export class OnlineAdmissionEffects {
  showPageLoadingDistpatcher = new OnlineAdmissionsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new OnlineAdmissionActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new OnlineAdmissionActionToggleLoading({isLoading: false});

  @Effect()
  loadOnlineAdmissionsPage$ = this.actions$.pipe(
    ofType<OnlineAdmissionsPageRequested>(OnlineAdmissionActionTypes.OnlineAdmissionsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.onlineAdmissionsService.findOnlineAdmissions(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new OnlineAdmissionsPageLoaded({
        onlineAdmissions: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteOnlineAdmission$ = this.actions$
    .pipe(
      ofType<OneOnlineAdmissionDeleted>(OnlineAdmissionActionTypes.OneOnlineAdmissionDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.onlineAdmissionsService.deleteOnlineAdmission(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteOnlineAdmissions$ = this.actions$
    .pipe(
      ofType<ManyOnlineAdmissionsDeleted>(OnlineAdmissionActionTypes.ManyOnlineAdmissionsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.onlineAdmissionsService.deleteOnlineAdmissions(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateOnlineAdmission$ = this.actions$
    .pipe(
      ofType<OnlineAdmissionUpdated>(OnlineAdmissionActionTypes.OnlineAdmissionUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.onlineAdmissionsService.updateOnlineAdmission(payload.onlineAdmission);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateOnlineAdmissionsStatus$ = this.actions$
    .pipe(
      ofType<OnlineAdmissionsStatusUpdated>(OnlineAdmissionActionTypes.OnlineAdmissionsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.onlineAdmissionsService.updateStatusForOnlineAdmission(payload.onlineAdmissions, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createOnlineAdmission$ = this.actions$
    .pipe(
      ofType<OnlineAdmissionOnServerCreated>(OnlineAdmissionActionTypes.OnlineAdmissionOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.onlineAdmissionsService.createOnlineAdmission(payload.onlineAdmission).pipe(
          tap(res => {
            this.store.dispatch(new OnlineAdmissionCreated({onlineAdmission: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private onlineAdmissionsService: OnlineAdmissionService, private store: Store<AppState>) {
  }
}
