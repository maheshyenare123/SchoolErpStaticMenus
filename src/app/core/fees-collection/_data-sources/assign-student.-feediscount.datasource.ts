// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectAssignStudentFeediscountsInStore, selectAssignStudentFeediscountsPageLoading,selectAssignStudentFeediscountsShowInitWaitingMessage } from '../_selectors/assign-student-feediscount.selectors';

export class AssignStudentFeediscountsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAssignStudentFeediscountsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAssignStudentFeediscountsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAssignStudentFeediscountsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
