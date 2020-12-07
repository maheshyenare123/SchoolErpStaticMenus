// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectBooksInStore,selectBooksPageLoading,selectBooksShowInitWaitingMessage} from '../_selectors/book.selectors';

export class BooksDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectBooksPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectBooksShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectBooksInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
