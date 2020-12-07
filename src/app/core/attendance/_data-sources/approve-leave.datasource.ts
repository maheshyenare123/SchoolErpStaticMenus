// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectApproveLeavesInStore, selectApproveLeavesPageLoading,selectApproveLeavesShowInitWaitingMessage } from '../_selectors/approve-leave.selectors';

export class ApproveLeavesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectApproveLeavesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectApproveLeavesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectApproveLeavesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
