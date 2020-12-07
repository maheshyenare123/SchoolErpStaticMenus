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
import {ItemIssueService} from '../_services/item-issue.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ItemIssueActionToggleLoading,
  ItemIssueActionTypes,
  ItemIssueCreated,
  ItemIssueOnServerCreated,
  ItemIssuesPageLoaded,
  ItemIssuesPageRequested,
  ItemIssuesPageToggleLoading,
  ItemIssuesStatusUpdated,
  ItemIssueUpdated,
  ManyItemIssuesDeleted,
  OneItemIssueDeleted
} from '../_actions/item-issue.actions';

@Injectable()
export class ItemIssueEffects {
  showPageLoadingDistpatcher = new ItemIssuesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ItemIssueActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ItemIssueActionToggleLoading({isLoading: false});

  @Effect()
  loadItemIssuesPage$ = this.actions$.pipe(
    ofType<ItemIssuesPageRequested>(ItemIssueActionTypes.ItemIssuesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.itemIssuesService.findItemIssues(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ItemIssuesPageLoaded({
        itemIssues: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteItemIssue$ = this.actions$
    .pipe(
      ofType<OneItemIssueDeleted>(ItemIssueActionTypes.OneItemIssueDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemIssuesService.deleteItemIssue(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteItemIssues$ = this.actions$
    .pipe(
      ofType<ManyItemIssuesDeleted>(ItemIssueActionTypes.ManyItemIssuesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.itemIssuesService.deleteItemIssues(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateItemIssue$ = this.actions$
    .pipe(
      ofType<ItemIssueUpdated>(ItemIssueActionTypes.ItemIssueUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemIssuesService.updateItemIssue(payload.itemIssue);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateItemIssuesStatus$ = this.actions$
    .pipe(
      ofType<ItemIssuesStatusUpdated>(ItemIssueActionTypes.ItemIssuesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemIssuesService.updateStatusForItemIssue(payload.itemIssues, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createItemIssue$ = this.actions$
    .pipe(
      ofType<ItemIssueOnServerCreated>(ItemIssueActionTypes.ItemIssueOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.itemIssuesService.createItemIssue(payload.itemIssue).pipe(
          tap(res => {
            this.store.dispatch(new ItemIssueCreated({itemIssue: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private itemIssuesService: ItemIssueService, private store: Store<AppState>) {
  }
}
