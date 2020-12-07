// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectFeesTypesInStore, selectFeesTypesPageLoading,selectFeesTypesShowInitWaitingMessage } from '../_selectors/fees-type.selectors';

export class FeesTypesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectFeesTypesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectFeesTypesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectFeesTypesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
