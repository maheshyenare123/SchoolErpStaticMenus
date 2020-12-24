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
import {DisableReasonService} from '../_services/disable-reason.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  DisableReasonActionToggleLoading,
  DisableReasonActionTypes,
  DisableReasonCreated,
  DisableReasonOnServerCreated,
  DisableReasonsPageLoaded,
  DisableReasonsPageRequested,
  DisableReasonsPageToggleLoading,
  DisableReasonsStatusUpdated,
  DisableReasonUpdated,
  ManyDisableReasonsDeleted,
  OneDisableReasonDeleted
} from '../_actions/disable-reason.actions';

@Injectable()
export class DisableReasonEffects {
  showPageLoadingDistpatcher = new DisableReasonsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new DisableReasonActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new DisableReasonActionToggleLoading({isLoading: false});

  @Effect()
  loadDisableReasonsPage$ = this.actions$.pipe(
    ofType<DisableReasonsPageRequested>(DisableReasonActionTypes.DisableReasonsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.disableReasonsService.findDisableReasons(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new DisableReasonsPageLoaded({
        disableReasons: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );


  @Effect()
  deleteDisableReason$ = this.actions$
    .pipe(
      ofType<OneDisableReasonDeleted>(DisableReasonActionTypes.OneDisableReasonDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.disableReasonsService.deleteDisableReason(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteDisableReasons$ = this.actions$
    .pipe(
      ofType<ManyDisableReasonsDeleted>(DisableReasonActionTypes.ManyDisableReasonsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.disableReasonsService.deleteDisableReasons(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateDisableReason$ = this.actions$
    .pipe(
      ofType<DisableReasonUpdated>(DisableReasonActionTypes.DisableReasonUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.disableReasonsService.updateDisableReason(payload.disableReason);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateDisableReasonsStatus$ = this.actions$
    .pipe(
      ofType<DisableReasonsStatusUpdated>(DisableReasonActionTypes.DisableReasonsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.disableReasonsService.updateStatusForDisableReason(payload.disableReasons, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createDisableReason$ = this.actions$
    .pipe(
      ofType<DisableReasonOnServerCreated>(DisableReasonActionTypes.DisableReasonOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.disableReasonsService.createDisableReason(payload.disableReason).pipe(
          tap(res => {
            this.store.dispatch(new DisableReasonCreated({disableReason: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private disableReasonsService: DisableReasonService, private store: Store<AppState>) {
  }
}
