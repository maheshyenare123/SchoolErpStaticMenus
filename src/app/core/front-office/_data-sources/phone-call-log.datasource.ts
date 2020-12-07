// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectPhoneCallLogsInStore, selectPhoneCallLogsPageLoading,selectPhoneCallLogsShowInitWaitingMessage } from '../_selectors/phone-call-log.selectors';

export class PhoneCallLogsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectPhoneCallLogsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectPhoneCallLogsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectPhoneCallLogsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
