// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStudentFeeAmountDetailssInStore, selectStudentFeeAmountDetailssPageLoading,selectStudentFeeAmountDetailssShowInitWaitingMessage } from '../_selectors/student-fee-amount-details.selectors';

export class StudentFeeAmountDetailssDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentFeeAmountDetailssPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentFeeAmountDetailssShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentFeeAmountDetailssInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
