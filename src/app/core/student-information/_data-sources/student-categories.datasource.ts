// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectCategorysInStore,selectCategorysPageLoading,selectCategorysShowInitWaitingMessage} from '../_selectors/student-categories.selectors';

export class CategorysDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectCategorysPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectCategorysShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectCategorysInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
