// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectFeesMastersInStore, selectFeesMastersPageLoading,selectFeesMastersShowInitWaitingMessage } from '../_selectors/fees-master.selectors';

export class FeesMastersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectFeesMastersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectFeesMastersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectFeesMastersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
