// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectFeesRemindersInStore, selectFeesRemindersPageLoading,selectFeesRemindersShowInitWaitingMessage } from '../_selectors/fees-reminder.selectors';

export class FeesRemindersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectFeesRemindersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectFeesRemindersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectFeesRemindersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
