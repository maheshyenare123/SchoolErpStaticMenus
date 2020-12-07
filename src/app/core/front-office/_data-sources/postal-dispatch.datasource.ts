// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectPostalDispatchsInStore, selectPostalDispatchsPageLoading,selectPostalDispatchsShowInitWaitingMessage } from '../_selectors/postal-dispatch.selectors';

export class PostalDispatchsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectPostalDispatchsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectPostalDispatchsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectPostalDispatchsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
