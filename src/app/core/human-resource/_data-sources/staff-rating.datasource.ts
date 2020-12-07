// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStaffRatingsInStore, selectStaffRatingsPageLoading,selectStaffRatingsShowInitWaitingMessage } from '../_selectors/staff-rating.selectors';

export class StaffRatingsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStaffRatingsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStaffRatingsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStaffRatingsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
