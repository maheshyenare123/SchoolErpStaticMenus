// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStaffAttendancesInStore, selectStaffAttendancesPageLoading,selectStaffAttendancesShowInitWaitingMessage } from '../_selectors/staff-attendance.selectors';

export class StaffAttendancesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStaffAttendancesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStaffAttendancesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStaffAttendancesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
