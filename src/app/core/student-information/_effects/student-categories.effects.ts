import {QueryParamsModel} from '../../_base/crud/models/query-models/query-params.model';
import {forkJoin, of} from 'rxjs';
// Angular
import {Injectable} from '@angular/core';
// RxJS
import {map, mergeMap, tap} from 'rxjs/operators';
// NGRX
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
// CRUD
import {QueryResultsModel, FindResultsModel} from '../../_base/crud';
// Services
import {CategoryService} from '../_services/student-categories.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  CategoryActionToggleLoading,
  CategoryActionTypes,
  CategoryCreated,
  CategoryOnServerCreated,
  CategorysPageLoaded,
  CategorysPageRequested,
  CategorysPageToggleLoading,
  CategorysStatusUpdated,
  CategoryUpdated,
  ManyCategorysDeleted,
  OneCategoryDeleted
} from '../_actions/student-categories.actions';

@Injectable()
export class CategoryEffects {
  showPageLoadingDistpatcher = new CategorysPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new CategoryActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new CategoryActionToggleLoading({isLoading: false});

  @Effect()
  loadCategorysPage$ = this.actions$.pipe(
    ofType<CategorysPageRequested>(CategoryActionTypes.CategorysPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.categorysService.findCategorys(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new CategorysPageLoaded({
        categorys: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteCategory$ = this.actions$
    .pipe(
      ofType<OneCategoryDeleted>(CategoryActionTypes.OneCategoryDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.categorysService.deleteCategory(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteCategorys$ = this.actions$
    .pipe(
      ofType<ManyCategorysDeleted>(CategoryActionTypes.ManyCategorysDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.categorysService.deleteCategorys(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateCategory$ = this.actions$
    .pipe(
      ofType<CategoryUpdated>(CategoryActionTypes.CategoryUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.categorysService.updateCategory(payload.category);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateCategorysStatus$ = this.actions$
    .pipe(
      ofType<CategorysStatusUpdated>(CategoryActionTypes.CategorysStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.categorysService.updateStatusForCategory(payload.categorys, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createCategory$ = this.actions$
    .pipe(
      ofType<CategoryOnServerCreated>(CategoryActionTypes.CategoryOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.categorysService.createCategory(payload.category).pipe(
          tap(res => {
            this.store.dispatch(new CategoryCreated({category: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private categorysService: CategoryService, private store: Store<AppState>) {
  }
}
