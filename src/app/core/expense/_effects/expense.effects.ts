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
import {ExpenseService} from '../_services/expense.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ExpenseActionToggleLoading,
  ExpenseActionTypes,
  ExpenseCreated,
  ExpenseOnServerCreated,
  ExpensesPageLoaded,
  ExpensesPageRequested,
  ExpensesPageToggleLoading,
  ExpensesStatusUpdated,
  ExpenseUpdated,
  ManyExpensesDeleted,
  OneExpenseDeleted
} from '../_actions/expense.actions';

@Injectable()
export class ExpenseEffects {
  showPageLoadingDistpatcher = new ExpensesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ExpenseActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ExpenseActionToggleLoading({isLoading: false});

  @Effect()
  loadExpensesPage$ = this.actions$.pipe(
    ofType<ExpensesPageRequested>(ExpenseActionTypes.ExpensesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.expensesService.findExpenses(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ExpensesPageLoaded({
        expenses: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteExpense$ = this.actions$
    .pipe(
      ofType<OneExpenseDeleted>(ExpenseActionTypes.OneExpenseDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.expensesService.deleteExpense(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteExpenses$ = this.actions$
    .pipe(
      ofType<ManyExpensesDeleted>(ExpenseActionTypes.ManyExpensesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.expensesService.deleteExpenses(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateExpense$ = this.actions$
    .pipe(
      ofType<ExpenseUpdated>(ExpenseActionTypes.ExpenseUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.expensesService.updateExpense(payload.expense);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateExpensesStatus$ = this.actions$
    .pipe(
      ofType<ExpensesStatusUpdated>(ExpenseActionTypes.ExpensesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.expensesService.updateStatusForExpense(payload.expenses, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createExpense$ = this.actions$
    .pipe(
      ofType<ExpenseOnServerCreated>(ExpenseActionTypes.ExpenseOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.expensesService.createExpense(payload.expense).pipe(
          tap(res => {
            this.store.dispatch(new ExpenseCreated({expense: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private expensesService: ExpenseService, private store: Store<AppState>) {
  }
}
