// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectStudentHousesInStore,selectStudentHousesPageLoading,selectStudentHousesShowInitWaitingMessage} from '../_selectors/student-house.selectors';

export class StudentHousesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentHousesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentHousesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentHousesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
