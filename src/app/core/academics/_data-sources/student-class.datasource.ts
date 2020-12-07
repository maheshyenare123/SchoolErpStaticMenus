// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStudentClasssInStore, selectStudentClasssPageLoading,selectStudentClasssShowInitWaitingMessage } from '../_selectors/student-class.selectors';

export class StudentClasssDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentClasssPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentClasssShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentClasssInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
