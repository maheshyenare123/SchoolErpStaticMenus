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
import {StudentClassService} from '../_services/student-class.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentClassActionToggleLoading,
  StudentClassActionTypes,
  StudentClassCreated,
  StudentClassOnServerCreated,
  StudentClasssPageLoaded,
  StudentClasssPageRequested,
  StudentClasssPageToggleLoading,
  StudentClasssStatusUpdated,
  StudentClassUpdated,
  ManyStudentClasssDeleted,
  OneStudentClassDeleted
} from '../_actions/student-class.actions';

@Injectable()
export class StudentClassEffects {
  showPageLoadingDistpatcher = new StudentClasssPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentClassActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentClassActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentClasssPage$ = this.actions$.pipe(
    ofType<StudentClasssPageRequested>(StudentClassActionTypes.StudentClasssPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentClasssService.findStudentClasss(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentClasssPageLoaded({
        studentClasss: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteStudentClass$ = this.actions$
    .pipe(
      ofType<OneStudentClassDeleted>(StudentClassActionTypes.OneStudentClassDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentClasssService.deleteStudentClass(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudentClasss$ = this.actions$
    .pipe(
      ofType<ManyStudentClasssDeleted>(StudentClassActionTypes.ManyStudentClasssDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentClasssService.deleteStudentClasss(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudentClass$ = this.actions$
    .pipe(
      ofType<StudentClassUpdated>(StudentClassActionTypes.StudentClassUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentClasssService.updateStudentClass(payload.studentClass);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentClasssStatus$ = this.actions$
    .pipe(
      ofType<StudentClasssStatusUpdated>(StudentClassActionTypes.StudentClasssStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentClasssService.updateStatusForStudentClass(payload.studentClasss, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudentClass$ = this.actions$
    .pipe(
      ofType<StudentClassOnServerCreated>(StudentClassActionTypes.StudentClassOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentClasssService.createStudentClass(payload.studentClass).pipe(
          tap(res => {
            this.store.dispatch(new StudentClassCreated({studentClass: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentClasssService: StudentClassService, private store: Store<AppState>) {
  }
}
