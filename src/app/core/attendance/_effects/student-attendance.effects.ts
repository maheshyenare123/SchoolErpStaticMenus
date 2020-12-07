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
import {StudentAttendenceService} from '../_services/student-attendance.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentAttendenceActionToggleLoading,
  StudentAttendenceActionTypes,
  StudentAttendenceCreated,
  StudentAttendenceOnServerCreated,
  StudentAttendencesPageLoaded,
  StudentAttendencesPageRequested,
  StudentAttendencesPageToggleLoading,
  StudentAttendencesStatusUpdated,
  StudentAttendenceUpdated,
  ManyStudentAttendencesDeleted,
  OneStudentAttendenceDeleted
} from '../_actions/student-attendance.actions';

@Injectable()
export class StudentAttendenceEffects {
  showPageLoadingDistpatcher = new StudentAttendencesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentAttendenceActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentAttendenceActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentAttendencesPage$ = this.actions$.pipe(
    ofType<StudentAttendencesPageRequested>(StudentAttendenceActionTypes.StudentAttendencesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentAttendencesService.findStudentAttendences(payload.page,payload.classId,payload.sectionId,payload.date);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentAttendencesPageLoaded({
        studentAttendences: data.content,
        totalCount: data.totalPages,
         page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteStudentAttendence$ = this.actions$
    .pipe(
      ofType<OneStudentAttendenceDeleted>(StudentAttendenceActionTypes.OneStudentAttendenceDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentAttendencesService.deleteStudentAttendence(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudentAttendences$ = this.actions$
    .pipe(
      ofType<ManyStudentAttendencesDeleted>(StudentAttendenceActionTypes.ManyStudentAttendencesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentAttendencesService.deleteStudentAttendences(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudentAttendence$ = this.actions$
    .pipe(
      ofType<StudentAttendenceUpdated>(StudentAttendenceActionTypes.StudentAttendenceUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentAttendencesService.updateStudentAttendence(payload.studentAttendence);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentAttendencesStatus$ = this.actions$
    .pipe(
      ofType<StudentAttendencesStatusUpdated>(StudentAttendenceActionTypes.StudentAttendencesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentAttendencesService.updateStatusForStudentAttendence(payload.studentAttendences, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudentAttendence$ = this.actions$
    .pipe(
      ofType<StudentAttendenceOnServerCreated>(StudentAttendenceActionTypes.StudentAttendenceOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentAttendencesService.createStudentAttendence(payload.studentAttendence).pipe(
          tap(res => {
            this.store.dispatch(new StudentAttendenceCreated({studentAttendence: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentAttendencesService: StudentAttendenceService, private store: Store<AppState>) {
  }
}
