// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectNoticeBoardsInStore, selectNoticeBoardsPageLoading,selectNoticeBoardsShowInitWaitingMessage } from '../_selectors/notice-board.selectors';

export class NoticeBoardsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectNoticeBoardsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectNoticeBoardsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectNoticeBoardsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
