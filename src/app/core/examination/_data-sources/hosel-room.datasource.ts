// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectHostelRoomsInStore, selectHostelRoomsPageLoading,selectHostelRoomsShowInitWaitingMessage } from '../_selectors/hostel-room.selectors';

export class HostelRoomsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectHostelRoomsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectHostelRoomsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectHostelRoomsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
