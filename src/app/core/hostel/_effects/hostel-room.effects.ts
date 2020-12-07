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
import {HostelRoomService} from '../_services/hostel-room.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  HostelRoomActionToggleLoading,
  HostelRoomActionTypes,
  HostelRoomCreated,
  HostelRoomOnServerCreated,
  HostelRoomsPageLoaded,
  HostelRoomsPageRequested,
  HostelRoomsPageToggleLoading,
  HostelRoomsStatusUpdated,
  HostelRoomUpdated,
  ManyHostelRoomsDeleted,
  OneHostelRoomDeleted
} from '../_actions/hostel-room.actions';

@Injectable()
export class HostelRoomEffects {
  showPageLoadingDistpatcher = new HostelRoomsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new HostelRoomActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new HostelRoomActionToggleLoading({isLoading: false});

  @Effect()
  loadHostelRoomsPage$ = this.actions$.pipe(
    ofType<HostelRoomsPageRequested>(HostelRoomActionTypes.HostelRoomsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.hostelRoomsService.findHostelRooms(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new HostelRoomsPageLoaded({
        hostelRooms: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteHostelRoom$ = this.actions$
    .pipe(
      ofType<OneHostelRoomDeleted>(HostelRoomActionTypes.OneHostelRoomDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.hostelRoomsService.deleteHostelRoom(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteHostelRooms$ = this.actions$
    .pipe(
      ofType<ManyHostelRoomsDeleted>(HostelRoomActionTypes.ManyHostelRoomsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.hostelRoomsService.deleteHostelRooms(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateHostelRoom$ = this.actions$
    .pipe(
      ofType<HostelRoomUpdated>(HostelRoomActionTypes.HostelRoomUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.hostelRoomsService.updateHostelRoom(payload.hostelRoom);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateHostelRoomsStatus$ = this.actions$
    .pipe(
      ofType<HostelRoomsStatusUpdated>(HostelRoomActionTypes.HostelRoomsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.hostelRoomsService.updateStatusForHostelRoom(payload.hostelRooms, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createHostelRoom$ = this.actions$
    .pipe(
      ofType<HostelRoomOnServerCreated>(HostelRoomActionTypes.HostelRoomOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.hostelRoomsService.createHostelRoom(payload.hostelRoom).pipe(
          tap(res => {
            this.store.dispatch(new HostelRoomCreated({hostelRoom: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private hostelRoomsService: HostelRoomService, private store: Store<AppState>) {
  }
}
