// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectDisableReasonsInStore,selectDisableReasonsPageLoading,selectDisableReasonsShowInitWaitingMessage} from '../_selectors/disable-reason.selectors';

export class DisableReasonsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectDisableReasonsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectDisableReasonsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectDisableReasonsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
