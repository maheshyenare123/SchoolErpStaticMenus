// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectReferencesInStore, selectReferencesPageLoading,selectReferencesShowInitWaitingMessage } from '../_selectors/reference.selectors';

export class ReferencesDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectReferencesPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectReferencesShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectReferencesInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
