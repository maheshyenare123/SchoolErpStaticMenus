// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStaffPayslipsInStore, selectStaffPayslipsPageLoading,selectStaffPayslipsShowInitWaitingMessage } from '../_selectors/staff-payslip.selectors';

export class StaffPayslipsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStaffPayslipsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStaffPayslipsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStaffPayslipsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
