// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStudentAttendencesInStore, selectStudentAttendencesPageLoading,selectStudentAttendencesShowInitWaitingMessage } from '../_selectors/student-attendance.selectors';

export class StudentAttendencesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentAttendencesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentAttendencesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentAttendencesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
