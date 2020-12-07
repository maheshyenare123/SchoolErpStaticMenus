// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectStudentDetailsInStore,selectStudentDetailsPageLoading,selectStudentDetailsShowInitWaitingMessage} from '../_selectors/student-detail.selectors';

export class StudentDetailsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentDetailsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentDetailsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentDetailsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
