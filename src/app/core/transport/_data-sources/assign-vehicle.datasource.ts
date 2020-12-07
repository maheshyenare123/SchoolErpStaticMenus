// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectAssignVehiclesInStore, selectAssignVehiclesPageLoading,selectAssignVehiclesShowInitWaitingMessage } from '../_selectors/assign-vehicle.selectors';

export class AssignVehiclesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAssignVehiclesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAssignVehiclesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAssignVehiclesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
