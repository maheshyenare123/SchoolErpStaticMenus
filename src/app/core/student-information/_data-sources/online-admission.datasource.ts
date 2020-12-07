// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectOnlineAdmissionsInStore,selectOnlineAdmissionsPageLoading,selectOnlineAdmissionsShowInitWaitingMessage} from '../_selectors/online-admission.selectors';

export class OnlineAdmissionsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectOnlineAdmissionsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectOnlineAdmissionsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectOnlineAdmissionsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
