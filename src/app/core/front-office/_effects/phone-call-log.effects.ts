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
import {PhoneCallLogService} from '../_services/phone-call-log.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  PhoneCallLogActionToggleLoading,
  PhoneCallLogActionTypes,
  PhoneCallLogCreated,
  PhoneCallLogOnServerCreated,
  PhoneCallLogsPageLoaded,
  PhoneCallLogsPageRequested,
  PhoneCallLogsPageToggleLoading,
  PhoneCallLogsStatusUpdated,
  PhoneCallLogUpdated,
  ManyPhoneCallLogsDeleted,
  OnePhoneCallLogDeleted
} from '../_actions/phone-call-log.actions';

@Injectable()
export class PhoneCallLogEffects {
  showPageLoadingDistpatcher = new PhoneCallLogsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new PhoneCallLogActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new PhoneCallLogActionToggleLoading({isLoading: false});

  @Effect()
  loadPhoneCallLogsPage$ = this.actions$.pipe(
    ofType<PhoneCallLogsPageRequested>(PhoneCallLogActionTypes.PhoneCallLogsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.phoneCallLogsService.findPhoneCallLogs(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new PhoneCallLogsPageLoaded({
        phoneCallLogs: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deletePhoneCallLog$ = this.actions$
    .pipe(
      ofType<OnePhoneCallLogDeleted>(PhoneCallLogActionTypes.OnePhoneCallLogDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.phoneCallLogsService.deletePhoneCallLog(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deletePhoneCallLogs$ = this.actions$
    .pipe(
      ofType<ManyPhoneCallLogsDeleted>(PhoneCallLogActionTypes.ManyPhoneCallLogsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.phoneCallLogsService.deletePhoneCallLogs(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updatePhoneCallLog$ = this.actions$
    .pipe(
      ofType<PhoneCallLogUpdated>(PhoneCallLogActionTypes.PhoneCallLogUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.phoneCallLogsService.updatePhoneCallLog(payload.phoneCallLog);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updatePhoneCallLogsStatus$ = this.actions$
    .pipe(
      ofType<PhoneCallLogsStatusUpdated>(PhoneCallLogActionTypes.PhoneCallLogsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.phoneCallLogsService.updateStatusForPhoneCallLog(payload.phoneCallLogs, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createPhoneCallLog$ = this.actions$
    .pipe(
      ofType<PhoneCallLogOnServerCreated>(PhoneCallLogActionTypes.PhoneCallLogOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.phoneCallLogsService.createPhoneCallLog(payload.phoneCallLog).pipe(
          tap(res => {
            this.store.dispatch(new PhoneCallLogCreated({phoneCallLog: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private phoneCallLogsService: PhoneCallLogService, private store: Store<AppState>) {
  }
}
