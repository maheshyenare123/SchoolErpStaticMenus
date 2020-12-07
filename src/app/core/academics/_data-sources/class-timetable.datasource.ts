// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectClassTimetablesInStore, selectClassTimetablesPageLoading,selectClassTimetablesShowInitWaitingMessage } from '../_selectors/class-timetable.selectors';

export class ClassTimetablesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectClassTimetablesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectClassTimetablesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectClassTimetablesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
