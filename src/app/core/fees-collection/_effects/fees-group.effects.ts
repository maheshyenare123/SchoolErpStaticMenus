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
import {FeesGroupService} from '../_services/fees-group.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  FeesGroupActionToggleLoading,
  FeesGroupActionTypes,
  FeesGroupCreated,
  FeesGroupOnServerCreated,
  FeesGroupsPageLoaded,
  FeesGroupsPageRequested,
  FeesGroupsPageToggleLoading,
  FeesGroupsStatusUpdated,
  FeesGroupUpdated,
  ManyFeesGroupsDeleted,
  OneFeesGroupDeleted
} from '../_actions/fees-group.actions';

@Injectable()
export class FeesGroupEffects {
  showPageLoadingDistpatcher = new FeesGroupsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new FeesGroupActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new FeesGroupActionToggleLoading({isLoading: false});

  @Effect()
  loadFeesGroupsPage$ = this.actions$.pipe(
    ofType<FeesGroupsPageRequested>(FeesGroupActionTypes.FeesGroupsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.feesGroupsService.findFeesGroups(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new FeesGroupsPageLoaded({
        feesGroups: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteFeesGroup$ = this.actions$
    .pipe(
      ofType<OneFeesGroupDeleted>(FeesGroupActionTypes.OneFeesGroupDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesGroupsService.deleteFeesGroup(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteFeesGroups$ = this.actions$
    .pipe(
      ofType<ManyFeesGroupsDeleted>(FeesGroupActionTypes.ManyFeesGroupsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesGroupsService.deleteFeesGroups(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateFeesGroup$ = this.actions$
    .pipe(
      ofType<FeesGroupUpdated>(FeesGroupActionTypes.FeesGroupUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesGroupsService.updateFeesGroup(payload.feesGroup);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateFeesGroupsStatus$ = this.actions$
    .pipe(
      ofType<FeesGroupsStatusUpdated>(FeesGroupActionTypes.FeesGroupsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesGroupsService.updateStatusForFeesGroup(payload.feesGroups, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createFeesGroup$ = this.actions$
    .pipe(
      ofType<FeesGroupOnServerCreated>(FeesGroupActionTypes.FeesGroupOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesGroupsService.createFeesGroup(payload.feesGroup).pipe(
          tap(res => {
            this.store.dispatch(new FeesGroupCreated({feesGroup: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private feesGroupsService: FeesGroupService, private store: Store<AppState>) {
  }
}
