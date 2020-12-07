// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectStaffDesignationsInStore, selectStaffDesignationsPageLoading,selectStaffDesignationsShowInitWaitingMessage } from '../_selectors/designation.selectors';

export class StaffDesignationsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStaffDesignationsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStaffDesignationsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStaffDesignationsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
