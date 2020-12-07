// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStaffsInStore, selectStaffsPageLoading,selectStaffsShowInitWaitingMessage } from '../_selectors/staff.selectors';

export class StaffsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStaffsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStaffsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStaffsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
