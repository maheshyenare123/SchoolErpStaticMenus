// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectSessionInStore, selectSessionPageLoading,selectSessionShowInitWaitingMessage } from '../_selectors/Session.selectors';

export class SessionsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectSessionPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectSessionShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectSessionInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
