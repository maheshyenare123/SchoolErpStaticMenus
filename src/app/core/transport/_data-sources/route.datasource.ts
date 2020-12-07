// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectRoutesInStore, selectRoutesPageLoading,selectRoutesShowInitWaitingMessage } from '../_selectors/route.selectors';

export class RoutesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectRoutesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectRoutesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectRoutesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
