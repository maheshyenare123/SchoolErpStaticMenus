// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectVehiclesInStore, selectVehiclesPageLoading,selectVehiclesShowInitWaitingMessage } from '../_selectors/vehicle.selectors';

export class VehiclesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectVehiclesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectVehiclesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectVehiclesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
