// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectHomeworksInStore, selectHomeworksPageLoading,selectHomeworksShowInitWaitingMessage } from '../_selectors/homework.selectors';

export class HomeworksDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectHomeworksPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectHomeworksShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectHomeworksInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
