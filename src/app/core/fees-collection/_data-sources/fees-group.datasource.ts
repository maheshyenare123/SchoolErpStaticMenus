// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectFeesGroupsInStore, selectFeesGroupsPageLoading,selectFeesGroupsShowInitWaitingMessage } from '../_selectors/fees-group.selectors';

export class FeesGroupsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectFeesGroupsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectFeesGroupsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectFeesGroupsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
