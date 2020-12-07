// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectExpenseHeadsInStore, selectExpenseHeadsPageLoading,selectExpenseHeadsShowInitWaitingMessage } from '../_selectors/expense-head.selectors';

export class ExpenseHeadsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectExpenseHeadsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectExpenseHeadsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectExpenseHeadsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
