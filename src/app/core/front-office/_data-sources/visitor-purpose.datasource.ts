// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectVisitorPurposesInStore, selectVisitorPurposesPageLoading,selectVisitorPurposesShowInitWaitingMessage } from '../_selectors/visitor-purpose.selectors';

export class VisitorPurposesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectVisitorPurposesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectVisitorPurposesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectVisitorPurposesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
