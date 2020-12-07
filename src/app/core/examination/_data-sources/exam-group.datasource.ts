// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectExamGroupsInStore, selectExamGroupsPageLoading,selectExamGroupsShowInitWaitingMessage } from '../_selectors/exam-group.selectors';

export class ExamGroupsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectExamGroupsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectExamGroupsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectExamGroupsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
