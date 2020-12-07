// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectRoomTypesInStore, selectRoomTypesPageLoading,selectRoomTypesShowInitWaitingMessage } from '../_selectors/room-type.selectors';

export class RoomTypesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectRoomTypesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectRoomTypesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectRoomTypesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
