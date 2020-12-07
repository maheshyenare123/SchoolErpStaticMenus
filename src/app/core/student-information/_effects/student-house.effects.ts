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
import {StudentHouseService} from '../_services/student-house.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentHouseActionToggleLoading,
  StudentHouseActionTypes,
  StudentHouseCreated,
  StudentHouseOnServerCreated,
  StudentHousesPageLoaded,
  StudentHousesPageRequested,
  StudentHousesPageToggleLoading,
  StudentHousesStatusUpdated,
  StudentHouseUpdated,
  ManyStudentHousesDeleted,
  OneStudentHouseDeleted
} from '../_actions/student-house.actions';

@Injectable()
export class StudentHouseEffects {
  showPageLoadingDistpatcher = new StudentHousesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentHouseActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentHouseActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentHousesPage$ = this.actions$.pipe(
    ofType<StudentHousesPageRequested>(StudentHouseActionTypes.StudentHousesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentHousesService.findStudentHouses(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentHousesPageLoaded({
        studentHouses: data.content,
        totalCount: result.totalCount,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteStudentHouse$ = this.actions$
    .pipe(
      ofType<OneStudentHouseDeleted>(StudentHouseActionTypes.OneStudentHouseDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentHousesService.deleteStudentHouse(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudentHouses$ = this.actions$
    .pipe(
      ofType<ManyStudentHousesDeleted>(StudentHouseActionTypes.ManyStudentHousesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentHousesService.deleteStudentHouses(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudentHouse$ = this.actions$
    .pipe(
      ofType<StudentHouseUpdated>(StudentHouseActionTypes.StudentHouseUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentHousesService.updateStudentHouse(payload.studentHouse);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentHousesStatus$ = this.actions$
    .pipe(
      ofType<StudentHousesStatusUpdated>(StudentHouseActionTypes.StudentHousesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentHousesService.updateStatusForStudentHouse(payload.studentHouses, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudentHouse$ = this.actions$
    .pipe(
      ofType<StudentHouseOnServerCreated>(StudentHouseActionTypes.StudentHouseOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentHousesService.createStudentHouse(payload.studentHouse).pipe(
          tap(res => {
            this.store.dispatch(new StudentHouseCreated({studentHouse: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentHousesService: StudentHouseService, private store: Store<AppState>) {
  }
}
