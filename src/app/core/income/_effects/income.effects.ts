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
import {IncomeService} from '../_services/income.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  IncomeActionToggleLoading,
  IncomeActionTypes,
  IncomeCreated,
  IncomeOnServerCreated,
  IncomesPageLoaded,
  IncomesPageRequested,
  IncomesPageToggleLoading,
  IncomesStatusUpdated,
  IncomeUpdated,
  ManyIncomesDeleted,
  OneIncomeDeleted
} from '../_actions/income.actions';

@Injectable()
export class IncomeEffects {
  showPageLoadingDistpatcher = new IncomesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new IncomeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new IncomeActionToggleLoading({isLoading: false});

  @Effect()
  loadIncomesPage$ = this.actions$.pipe(
    ofType<IncomesPageRequested>(IncomeActionTypes.IncomesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.incomesService.findIncomes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new IncomesPageLoaded({
        incomes: data.content,
totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteIncome$ = this.actions$
    .pipe(
      ofType<OneIncomeDeleted>(IncomeActionTypes.OneIncomeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.incomesService.deleteIncome(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteIncomes$ = this.actions$
    .pipe(
      ofType<ManyIncomesDeleted>(IncomeActionTypes.ManyIncomesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.incomesService.deleteIncomes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateIncome$ = this.actions$
    .pipe(
      ofType<IncomeUpdated>(IncomeActionTypes.IncomeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.incomesService.updateIncome(payload.income);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateIncomesStatus$ = this.actions$
    .pipe(
      ofType<IncomesStatusUpdated>(IncomeActionTypes.IncomesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.incomesService.updateStatusForIncome(payload.incomes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createIncome$ = this.actions$
    .pipe(
      ofType<IncomeOnServerCreated>(IncomeActionTypes.IncomeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.incomesService.createIncome(payload.income).pipe(
          tap(res => {
            this.store.dispatch(new IncomeCreated({income: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private incomesService: IncomeService, private store: Store<AppState>) {
  }
}
