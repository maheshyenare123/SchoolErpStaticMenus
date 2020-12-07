// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectBulkDeletesInStore,selectBulkDeletesPageLoading,selectBulkDeletesShowInitWaitingMessage} from '../_selectors/bulk-delete.selectors';

export class BulkDeletesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectBulkDeletesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectBulkDeletesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectBulkDeletesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
