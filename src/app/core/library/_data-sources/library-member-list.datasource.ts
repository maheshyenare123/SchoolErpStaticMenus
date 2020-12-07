// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectLibraryMemberListsInStore,selectLibraryMemberListsPageLoading,selectLibraryMemberListsShowInitWaitingMessage} from '../_selectors/library-member-list.selectors';

export class LibraryMemberListsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectLibraryMemberListsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectLibraryMemberListsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectLibraryMemberListsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
