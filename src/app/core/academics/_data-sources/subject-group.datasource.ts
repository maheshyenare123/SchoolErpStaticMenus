// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectSubjectGroupsInStore, selectSubjectGroupsPageLoading,selectSubjectGroupsShowInitWaitingMessage } from '../_selectors/subject-group.selectors';

export class SubjectGroupsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectSubjectGroupsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectSubjectGroupsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectSubjectGroupsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
