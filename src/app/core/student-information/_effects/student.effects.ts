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
import {StudentService} from '../_services/student.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentActionToggleLoading,
  StudentActionTypes,
  StudentCreated,
  StudentOnServerCreated,
  StudentsPageLoaded,
  StudentsPageRequested,
  StudentsPageToggleLoading,
  StudentsStatusUpdated,
  StudentUpdated,
  ManyStudentsDeleted,
  OneStudentDeleted,
  DisableStudentsPageRequested,
  StudentsuserPageRequested
} from '../_actions/student.actions';

@Injectable()
export class StudentEffects {
  showPageLoadingDistpatcher = new StudentsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentsPage$ = this.actions$.pipe(
    ofType<StudentsPageRequested>(StudentActionTypes.StudentsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentsService.findStudents(payload.page,payload.classId,payload.sectionId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentsPageLoaded({
        students: data.content,
        totalCount: result.totalCount,
        page: lastQuery
      });
    })
  );

  @Effect()
  loadDisableStudentsPage$ = this.actions$.pipe(
    ofType<DisableStudentsPageRequested>(StudentActionTypes.DisableStudentsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentsService.findDisableStudents(payload.page,payload.classId,payload.sectionId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentsPageLoaded({
        students: data.content,
        totalCount: result.totalCount,
        page: lastQuery
      });
    })
  );


  @Effect()
  loadStudentsusersPage$ = this.actions$.pipe(
    ofType<StudentsuserPageRequested>(StudentActionTypes.StudentsuserPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentsService.findDisableStudentusers(payload.page,payload.role);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentsPageLoaded({
        students: data.content,
        totalCount: result.totalCount,
        page: lastQuery
      });
    })
  );



  @Effect()
  deleteStudent$ = this.actions$
    .pipe(
      ofType<OneStudentDeleted>(StudentActionTypes.OneStudentDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentsService.deleteStudent(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudents$ = this.actions$
    .pipe(
      ofType<ManyStudentsDeleted>(StudentActionTypes.ManyStudentsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentsService.deleteStudents(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudent$ = this.actions$
    .pipe(
      ofType<StudentUpdated>(StudentActionTypes.StudentUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentsService.updateStudent(payload.student);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentsStatus$ = this.actions$
    .pipe(
      ofType<StudentsStatusUpdated>(StudentActionTypes.StudentsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentsService.updateStatusForStudent(payload.students, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudent$ = this.actions$
    .pipe(
      ofType<StudentOnServerCreated>(StudentActionTypes.StudentOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentsService.createStudent(payload.student).pipe(
          tap(res => {
            this.store.dispatch(new StudentCreated({student: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentsService: StudentService, private store: Store<AppState>) {
  }
}
