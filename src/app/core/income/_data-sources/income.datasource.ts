// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectIncomesInStore, selectIncomesPageLoading,selectIncomesShowInitWaitingMessage } from '../_selectors/income.selectors';

export class IncomesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectIncomesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectIncomesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectIncomesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
