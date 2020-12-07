// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectVisitorBooksInStore, selectVisitorBooksPageLoading,selectVisitorBooksShowInitWaitingMessage } from '../_selectors/visitor-book.selectors';

export class VisitorBooksDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectVisitorBooksPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectVisitorBooksShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectVisitorBooksInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
