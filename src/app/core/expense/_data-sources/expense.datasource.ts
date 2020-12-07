// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectExpensesInStore, selectExpensesPageLoading,selectExpensesShowInitWaitingMessage } from '../_selectors/expense.selectors';

export class ExpensesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectExpensesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectExpensesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectExpensesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
