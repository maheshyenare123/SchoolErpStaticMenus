// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectAdmissionEnquirysInStore,selectAdmissionEnquirysPageLoading,selectAdmissionEnquirysShowInitWaitingMessage} from '../_selectors/admission-enquiry.selectors';

export class EnquirysDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectAdmissionEnquirysPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectAdmissionEnquirysShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectAdmissionEnquirysInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
