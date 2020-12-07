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
import {RoomTypeService} from '../_services/room-type.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  RoomTypeActionToggleLoading,
  RoomTypeActionTypes,
  RoomTypeCreated,
  RoomTypeOnServerCreated,
  RoomTypesPageLoaded,
  RoomTypesPageRequested,
  RoomTypesPageToggleLoading,
  RoomTypesStatusUpdated,
  RoomTypeUpdated,
  ManyRoomTypesDeleted,
  OneRoomTypeDeleted
} from '../_actions/room-type.actions';

@Injectable()
export class RoomTypeEffects {
  showPageLoadingDistpatcher = new RoomTypesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new RoomTypeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new RoomTypeActionToggleLoading({isLoading: false});

  @Effect()
  loadRoomTypesPage$ = this.actions$.pipe(
    ofType<RoomTypesPageRequested>(RoomTypeActionTypes.RoomTypesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.roomTypesService.findRoomTypes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new RoomTypesPageLoaded({
        roomTypes: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteRoomType$ = this.actions$
    .pipe(
      ofType<OneRoomTypeDeleted>(RoomTypeActionTypes.OneRoomTypeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.roomTypesService.deleteRoomType(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteRoomTypes$ = this.actions$
    .pipe(
      ofType<ManyRoomTypesDeleted>(RoomTypeActionTypes.ManyRoomTypesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.roomTypesService.deleteRoomTypes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateRoomType$ = this.actions$
    .pipe(
      ofType<RoomTypeUpdated>(RoomTypeActionTypes.RoomTypeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.roomTypesService.updateRoomType(payload.roomType);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateRoomTypesStatus$ = this.actions$
    .pipe(
      ofType<RoomTypesStatusUpdated>(RoomTypeActionTypes.RoomTypesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.roomTypesService.updateStatusForRoomType(payload.roomTypes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createRoomType$ = this.actions$
    .pipe(
      ofType<RoomTypeOnServerCreated>(RoomTypeActionTypes.RoomTypeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.roomTypesService.createRoomType(payload.roomType).pipe(
          tap(res => {
            this.store.dispatch(new RoomTypeCreated({roomType: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private roomTypesService: RoomTypeService, private store: Store<AppState>) {
  }
}
