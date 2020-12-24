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
import {HostelService} from '../_services/hostel.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  HostelActionToggleLoading,
  HostelActionTypes,
  HostelCreated,
  HostelOnServerCreated,
  HostelsPageLoaded,
  HostelsPageRequested,
  HostelsPageToggleLoading,
  HostelsStatusUpdated,
  HostelUpdated,
  ManyHostelsDeleted,
  OneHostelDeleted
} from '../_actions/hostel.actions';

@Injectable()
export class HostelEffects {
  showPageLoadingDistpatcher = new HostelsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new HostelActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new HostelActionToggleLoading({isLoading: false});

  @Effect()
  loadHostelsPage$ = this.actions$.pipe(
    ofType<HostelsPageRequested>(HostelActionTypes.HostelsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.hostelsService.findHostels(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new HostelsPageLoaded({
        hostels: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteHostel$ = this.actions$
    .pipe(
      ofType<OneHostelDeleted>(HostelActionTypes.OneHostelDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.hostelsService.deleteHostel(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteHostels$ = this.actions$
    .pipe(
      ofType<ManyHostelsDeleted>(HostelActionTypes.ManyHostelsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.hostelsService.deleteHostels(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateHostel$ = this.actions$
    .pipe(
      ofType<HostelUpdated>(HostelActionTypes.HostelUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.hostelsService.updateHostel(payload.hostel);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateHostelsStatus$ = this.actions$
    .pipe(
      ofType<HostelsStatusUpdated>(HostelActionTypes.HostelsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.hostelsService.updateStatusForHostel(payload.hostels, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createHostel$ = this.actions$
    .pipe(
      ofType<HostelOnServerCreated>(HostelActionTypes.HostelOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.hostelsService.createHostel(payload.hostel).pipe(
          tap(res => {
            this.store.dispatch(new HostelCreated({hostel: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private hostelsService: HostelService, private store: Store<AppState>) {
  }
}
