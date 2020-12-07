// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectExamSubjectInStore, selectExamSubjectPageLoading,selectExamSubjectShowInitWaitingMessage } from '../_selectors/exam-subject.selectors';

export class ExamSubjectsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectExamSubjectPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectExamSubjectShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectExamSubjectInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
