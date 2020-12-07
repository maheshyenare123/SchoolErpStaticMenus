// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectHostelsInStore, selectHostelsPageLoading,selectHostelsShowInitWaitingMessage } from '../_selectors/hostel.selectors';

export class HostelsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectHostelsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectHostelsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectHostelsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
