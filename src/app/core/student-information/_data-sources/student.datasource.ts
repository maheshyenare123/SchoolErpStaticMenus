// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectStudentsInStore,selectStudentsPageLoading,selectStudentsShowInitWaitingMessage} from '../_selectors/student.selectors';

export class StudentsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectStudentsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectStudentsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectStudentsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
