// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectClasssInStore, selectClasssPageLoading,selectClasssShowInitWaitingMessage } from '../_selectors/Class.selectors';

export class ClasssDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectClasssPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectClasssShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectClasssInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
