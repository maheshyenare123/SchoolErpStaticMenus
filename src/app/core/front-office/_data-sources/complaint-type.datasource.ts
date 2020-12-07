// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectComplaintTypesInStore, selectComplaintTypesPageLoading,selectComplaintTypesShowInitWaitingMessage } from '../_selectors/complaint-type.selectors';

export class ComplainTypesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectComplaintTypesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectComplaintTypesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectComplaintTypesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
