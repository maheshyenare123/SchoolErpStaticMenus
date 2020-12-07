// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectIncomeHeadsInStore, selectIncomeHeadsPageLoading,selectIncomeHeadsShowInitWaitingMessage } from '../_selectors/income-head.selectors';

export class IncomeHeadsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectIncomeHeadsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectIncomeHeadsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectIncomeHeadsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
