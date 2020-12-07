// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectItemStocksInStore, selectItemStocksPageLoading,selectItemStocksShowInitWaitingMessage } from '../_selectors/item-stock.selectors';

export class ItemStocksDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectItemStocksPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectItemStocksShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectItemStocksInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
