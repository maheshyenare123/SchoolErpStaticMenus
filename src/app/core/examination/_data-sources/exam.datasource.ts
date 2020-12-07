// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectExamsInStore, selectExamsPageLoading,selectExamsShowInitWaitingMessage } from '../_selectors/exam.selectors';

export class ExamsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectExamsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectExamsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectExamsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
