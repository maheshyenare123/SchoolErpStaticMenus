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
import {AddItemService} from '../_services/add-item.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  AddItemActionToggleLoading,
  AddItemActionTypes,
  AddItemCreated,
  AddItemOnServerCreated,
  AddItemsPageLoaded,
  AddItemsPageRequested,
  AddItemsPageToggleLoading,
  AddItemsStatusUpdated,
  AddItemUpdated,
  ManyAddItemsDeleted,
  OneAddItemDeleted
} from '../_actions/add-item.actions';

@Injectable()
export class AddItemEffects {
  showPageLoadingDistpatcher = new AddItemsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AddItemActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AddItemActionToggleLoading({isLoading: false});

  @Effect()
  loadAddItemsPage$ = this.actions$.pipe(
    ofType<AddItemsPageRequested>(AddItemActionTypes.AddItemsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.addItemsService.findAddItems(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new AddItemsPageLoaded({
        addItems: data.content,
totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteAddItem$ = this.actions$
    .pipe(
      ofType<OneAddItemDeleted>(AddItemActionTypes.OneAddItemDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.addItemsService.deleteAddItem(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAddItems$ = this.actions$
    .pipe(
      ofType<ManyAddItemsDeleted>(AddItemActionTypes.ManyAddItemsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.addItemsService.deleteAddItems(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAddItem$ = this.actions$
    .pipe(
      ofType<AddItemUpdated>(AddItemActionTypes.AddItemUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.addItemsService.updateAddItem(payload.addItem);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAddItemsStatus$ = this.actions$
    .pipe(
      ofType<AddItemsStatusUpdated>(AddItemActionTypes.AddItemsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.addItemsService.updateStatusForAddItem(payload.addItems, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAddItem$ = this.actions$
    .pipe(
      ofType<AddItemOnServerCreated>(AddItemActionTypes.AddItemOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.addItemsService.createAddItem(payload.addItem).pipe(
          tap(res => {
            this.store.dispatch(new AddItemCreated({addItem: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private addItemsService: AddItemService, private store: Store<AppState>) {
  }
}
