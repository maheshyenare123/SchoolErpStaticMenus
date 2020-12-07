// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectDepartmentsInStore, selectDepartmentsPageLoading,selectDepartmentsShowInitWaitingMessage } from '../_selectors/department.selectors';

export class DepartmentsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectDepartmentsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectDepartmentsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectDepartmentsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
