// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import {  selectLibraryStudentMembersInStore,selectLibraryStudentMembersPageLoading,selectLibraryStudentMembersShowInitWaitingMessage} from '../_selectors/library-student-member.selectors';

export class LibraryStudentMembersDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectLibraryStudentMembersPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectLibraryStudentMembersShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectLibraryStudentMembersInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
