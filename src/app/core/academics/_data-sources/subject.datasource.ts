// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectSubjectsInStore, selectSubjectsPageLoading,selectSubjectsShowInitWaitingMessage } from '../_selectors/subject.selectors';

export class SubjectsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectSubjectsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectSubjectsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectSubjectsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
