// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStaffLeaveRequestsInStore, selectStaffLeaveRequestsPageLoading,selectStaffLeaveRequestsShowInitWaitingMessage } from '../_selectors/staff-leave-request.selectors';

export class StaffLeaveRequestsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStaffLeaveRequestsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStaffLeaveRequestsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStaffLeaveRequestsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
