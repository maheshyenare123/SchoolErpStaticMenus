// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectAssignClassTeachersInStore, selectAssignClassTeachersPageLoading,selectAssignClassTeachersShowInitWaitingMessage } from '../_selectors/assign-class-teacher.selectors';

export class AssignClassTeachersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAssignClassTeachersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAssignClassTeachersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAssignClassTeachersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
