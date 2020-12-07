// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectItemCategorysInStore, selectItemCategorysPageLoading,selectItemCategorysShowInitWaitingMessage } from '../_selectors/item-category.selectors';

export class ItemCategorysDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectItemCategorysPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectItemCategorysShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectItemCategorysInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
