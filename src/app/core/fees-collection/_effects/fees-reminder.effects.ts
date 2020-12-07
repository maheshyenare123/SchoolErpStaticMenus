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
import {FeesReminderService} from '../_services/fees-reminder.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  FeesReminderActionToggleLoading,
  FeesReminderActionTypes,
  FeesReminderCreated,
  FeesReminderOnServerCreated,
  FeesRemindersPageLoaded,
  FeesRemindersPageRequested,
  FeesRemindersPageToggleLoading,
  FeesRemindersStatusUpdated,
  FeesReminderUpdated,
  ManyFeesRemindersDeleted,
  OneFeesReminderDeleted
} from '../_actions/fees-reminder.actions';

@Injectable()
export class FeesReminderEffects {
  showPageLoadingDistpatcher = new FeesRemindersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new FeesReminderActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new FeesReminderActionToggleLoading({isLoading: false});

  @Effect()
  loadFeesRemindersPage$ = this.actions$.pipe(
    ofType<FeesRemindersPageRequested>(FeesReminderActionTypes.FeesRemindersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.feesRemindersService.findFeesReminders(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new FeesRemindersPageLoaded({
        feesReminders: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteFeesReminder$ = this.actions$
    .pipe(
      ofType<OneFeesReminderDeleted>(FeesReminderActionTypes.OneFeesReminderDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesRemindersService.deleteFeesReminder(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteFeesReminders$ = this.actions$
    .pipe(
      ofType<ManyFeesRemindersDeleted>(FeesReminderActionTypes.ManyFeesRemindersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesRemindersService.deleteFeesReminders(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateFeesReminder$ = this.actions$
    .pipe(
      ofType<FeesReminderUpdated>(FeesReminderActionTypes.FeesReminderUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesRemindersService.updateFeesReminder(payload.feesReminder);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateFeesRemindersStatus$ = this.actions$
    .pipe(
      ofType<FeesRemindersStatusUpdated>(FeesReminderActionTypes.FeesRemindersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesRemindersService.updateStatusForFeesReminder(payload.feesReminders, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createFeesReminder$ = this.actions$
    .pipe(
      ofType<FeesReminderOnServerCreated>(FeesReminderActionTypes.FeesReminderOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesRemindersService.createFeesReminder(payload.feesReminder).pipe(
          tap(res => {
            this.store.dispatch(new FeesReminderCreated({feesReminder: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private feesRemindersService: FeesReminderService, private store: Store<AppState>) {
  }
}
