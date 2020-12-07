// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectAssignStudentFeemastersInStore, selectAssignStudentFeemastersPageLoading,selectAssignStudentFeemastersShowInitWaitingMessage } from '../_selectors/assign-student-feemaster.selectors';

export class AssignStudentFeemastersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAssignStudentFeemastersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAssignStudentFeemastersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAssignStudentFeemastersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
