// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectItemIssuesInStore, selectItemIssuesPageLoading,selectItemIssuesShowInitWaitingMessage } from '../_selectors/item-issue.selectors';

export class ItemIssuesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectItemIssuesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectItemIssuesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectItemIssuesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
