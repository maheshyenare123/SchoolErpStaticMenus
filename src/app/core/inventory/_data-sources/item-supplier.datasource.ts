// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectItemSuppliersInStore, selectItemSuppliersPageLoading,selectItemSuppliersShowInitWaitingMessage } from '../_selectors/item-supplier.selectors';

export class ItemSuppliersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectItemSuppliersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectItemSuppliersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectItemSuppliersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
