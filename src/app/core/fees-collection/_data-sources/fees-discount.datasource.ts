// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectFeesDiscountsInStore, selectFeesDiscountsPageLoading,selectFeesDiscountsShowInitWaitingMessage } from '../_selectors/fees-discount.selectors';

export class FeesDiscountsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectFeesDiscountsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectFeesDiscountsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectFeesDiscountsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
