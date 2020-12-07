// import { selectProductsInitWaitingMessage } from './../_selectors/product.selectors';
// RxJS
import { delay, distinctUntilChanged } from 'rxjs/operators';
// CRUD
import { QueryResultsModel, BaseDataSource } from '../../_base/crud';
// State
import { Store, select } from '@ngrx/store';
import { AppState } from '../../reducers';
// Selectors
import { selectSectionsInStore, selectSectionsPageLoading,selectSectionsShowInitWaitingMessage } from '../_selectors/section.selectors';

export class SectionsDataSource extends BaseDataSource {
  constructor(private store: Store<AppState>) {
    super();
    this.loading$ = this.store.pipe(
      select(selectSectionsPageLoading)
    );

    this.isPreloadTextViewed$ = this.store.pipe(
      select(selectSectionsShowInitWaitingMessage)
    );

    this.store.pipe(
      select(selectSectionsInStore)
    ).subscribe((response: QueryResultsModel) => {
      this.paginatorTotalSubject.next(response.totalCount);
      this.entitySubject.next(response.items);
    });
  }
}
