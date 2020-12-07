// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectDisabledStudentsInStore,selectDisabledStudentsPageLoading,selectDisabledStudentsShowInitWaitingMessage} from '../_selectors/disabled-student.selectors';

export class DisabledStudentsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectDisabledStudentsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectDisabledStudentsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectDisabledStudentsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
