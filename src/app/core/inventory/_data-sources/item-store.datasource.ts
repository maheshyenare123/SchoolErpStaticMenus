// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectItemStoresInStore, selectItemStoresPageLoading,selectItemStoresShowInitWaitingMessage } from '../_selectors/item-store.selectors';

export class ItemStoresDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectItemStoresPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectItemStoresShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectItemStoresInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
