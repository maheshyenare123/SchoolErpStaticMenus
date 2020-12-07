// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectAddItemsInStore, selectAddItemsPageLoading,selectAddItemsShowInitWaitingMessage } from '../_selectors/add-item.selectors';

export class AddItemsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAddItemsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAddItemsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAddItemsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
