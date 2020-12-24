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
import {StaffRatingService} from '../_services/staff-rating.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StaffRatingActionToggleLoading,
  StaffRatingActionTypes,
  StaffRatingCreated,
  StaffRatingOnServerCreated,
  StaffRatingsPageLoaded,
  StaffRatingsPageRequested,
  StaffRatingsPageToggleLoading,
  StaffRatingsStatusUpdated,
  StaffRatingUpdated,
  ManyStaffRatingsDeleted,
  OneStaffRatingDeleted
} from '../_actions/staff-rating.actions';

@Injectable()
export class StaffRatingEffects {
  showPageLoadingDistpatcher = new StaffRatingsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StaffRatingActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StaffRatingActionToggleLoading({isLoading: false});

  @Effect()
  loadStaffRatingsPage$ = this.actions$.pipe(
    ofType<StaffRatingsPageRequested>(StaffRatingActionTypes.StaffRatingsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.staffRatingsService.findStaffRatings(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StaffRatingsPageLoaded({
        staffRatings: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStaffRating$ = this.actions$
    .pipe(
      ofType<OneStaffRatingDeleted>(StaffRatingActionTypes.OneStaffRatingDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffRatingsService.deleteStaffRating(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStaffRatings$ = this.actions$
    .pipe(
      ofType<ManyStaffRatingsDeleted>(StaffRatingActionTypes.ManyStaffRatingsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.staffRatingsService.deleteStaffRatings(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStaffRating$ = this.actions$
    .pipe(
      ofType<StaffRatingUpdated>(StaffRatingActionTypes.StaffRatingUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffRatingsService.updateStaffRating(payload.staffRating);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStaffRatingsStatus$ = this.actions$
    .pipe(
      ofType<StaffRatingsStatusUpdated>(StaffRatingActionTypes.StaffRatingsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffRatingsService.updateStatusForStaffRating(payload.staffRatings, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStaffRating$ = this.actions$
    .pipe(
      ofType<StaffRatingOnServerCreated>(StaffRatingActionTypes.StaffRatingOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.staffRatingsService.createStaffRating(payload.staffRating).pipe(
          tap(res => {
            this.store.dispatch(new StaffRatingCreated({staffRating: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private staffRatingsService: StaffRatingService, private store: Store<AppState>) {
  }
}
