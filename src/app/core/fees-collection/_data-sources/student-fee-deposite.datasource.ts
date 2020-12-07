// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStudentFeeDepositesInStore, selectStudentFeeDepositesPageLoading,selectStudentFeeDepositesShowInitWaitingMessage } from '../_selectors/student-fee-deposite.selectors';

export class StudentFeeDepositesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentFeeDepositesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentFeeDepositesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentFeeDepositesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
