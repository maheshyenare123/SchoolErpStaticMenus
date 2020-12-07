// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectLibraryStaffMembersInStore,selectLibraryStaffMembersPageLoading,selectLibraryStaffMembersShowInitWaitingMessage} from '../_selectors/library-staff-member.selectors';

export class LibraryStaffMembersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectLibraryStaffMembersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectLibraryStaffMembersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectLibraryStaffMembersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
