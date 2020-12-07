// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectAssignStudentExamInStore, selectAssignStudentExamPageLoading,selectAssignStudentExamShowInitWaitingMessage } from '../_selectors/assign-student-exam.selectors';

export class AssignStudentExamsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAssignStudentExamPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAssignStudentExamShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAssignStudentExamInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
