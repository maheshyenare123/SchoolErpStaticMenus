// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectBookIssueReturnsInStore,selectBookIssueReturnsPageLoading,selectBookIssueReturnsShowInitWaitingMessage} from '../_selectors/book-issue-retrun.selectors';

export class BookIssueReturnsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectBookIssueReturnsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectBookIssueReturnsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectBookIssueReturnsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
