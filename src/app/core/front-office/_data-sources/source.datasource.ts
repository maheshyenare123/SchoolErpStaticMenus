// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectSourcesInStore, selectSourcesPageLoading,selectSourcesShowInitWaitingMessage } from '../_selectors/source.selectors';

export class SourcesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectSourcesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectSourcesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectSourcesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
