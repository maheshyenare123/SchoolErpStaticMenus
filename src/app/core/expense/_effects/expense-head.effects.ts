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
import {ExpenseHeadService} from '../_services/expense-head.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ExpenseHeadActionToggleLoading,
  ExpenseHeadActionTypes,
  ExpenseHeadCreated,
  ExpenseHeadOnServerCreated,
  ExpenseHeadsPageLoaded,
  ExpenseHeadsPageRequested,
  ExpenseHeadsPageToggleLoading,
  ExpenseHeadsStatusUpdated,
  ExpenseHeadUpdated,
  ManyExpenseHeadsDeleted,
  OneExpenseHeadDeleted
} from '../_actions/expense-head.actions';

@Injectable()
export class ExpenseHeadEffects {
  showPageLoadingDistpatcher = new ExpenseHeadsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ExpenseHeadActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ExpenseHeadActionToggleLoading({isLoading: false});

  @Effect()
  loadExpenseHeadsPage$ = this.actions$.pipe(
    ofType<ExpenseHeadsPageRequested>(ExpenseHeadActionTypes.ExpenseHeadsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.expenseHeadsService.findExpenseHeads(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ExpenseHeadsPageLoaded({
        expenseHeads: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteExpenseHead$ = this.actions$
    .pipe(
      ofType<OneExpenseHeadDeleted>(ExpenseHeadActionTypes.OneExpenseHeadDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.expenseHeadsService.deleteExpenseHead(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteExpenseHeads$ = this.actions$
    .pipe(
      ofType<ManyExpenseHeadsDeleted>(ExpenseHeadActionTypes.ManyExpenseHeadsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.expenseHeadsService.deleteExpenseHeads(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateExpenseHead$ = this.actions$
    .pipe(
      ofType<ExpenseHeadUpdated>(ExpenseHeadActionTypes.ExpenseHeadUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.expenseHeadsService.updateExpenseHead(payload.expenseHead);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateExpenseHeadsStatus$ = this.actions$
    .pipe(
      ofType<ExpenseHeadsStatusUpdated>(ExpenseHeadActionTypes.ExpenseHeadsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.expenseHeadsService.updateStatusForExpenseHead(payload.expenseHeads, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createExpenseHead$ = this.actions$
    .pipe(
      ofType<ExpenseHeadOnServerCreated>(ExpenseHeadActionTypes.ExpenseHeadOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.expenseHeadsService.createExpenseHead(payload.expenseHead).pipe(
          tap(res => {
            this.store.dispatch(new ExpenseHeadCreated({expenseHead: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private expenseHeadsService: ExpenseHeadService, private store: Store<AppState>) {
  }
}
