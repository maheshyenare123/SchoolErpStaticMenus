// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectExamSubjectMarkssInStore, selectExamSubjectMarkssPageLoading,selectExamSubjectMarkssShowInitWaitingMessage } from '../_selectors/exam-subject-marks.selectors';

export class ExamSubjectMarkssDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectExamSubjectMarkssPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectExamSubjectMarkssShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectExamSubjectMarkssInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
