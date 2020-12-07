// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectPostalReceivesInStore, selectPostalReceivesPageLoading,selectPostalReceivesShowInitWaitingMessage } from '../_selectors/postal-receive.selectors';

export class PostalReceivesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectPostalReceivesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectPostalReceivesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectPostalReceivesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
