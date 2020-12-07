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
import {StudentDetailService} from '../_services/student-detail.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentDetailActionToggleLoading,
  StudentDetailActionTypes,
  StudentDetailCreated,
  StudentDetailOnServerCreated,
  StudentDetailsPageLoaded,
  StudentDetailsPageRequested,
  StudentDetailsPageToggleLoading,
  StudentDetailsStatusUpdated,
  StudentDetailUpdated,
  ManyStudentDetailsDeleted,
  OneStudentDetailDeleted
} from '../_actions/student-detail.actions';

@Injectable()
export class StudentDetailEffects {
  showPageLoadingDistpatcher = new StudentDetailsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentDetailActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentDetailActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentDetailsPage$ = this.actions$.pipe(
    ofType<StudentDetailsPageRequested>(StudentDetailActionTypes.StudentDetailsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentDetailsService.findStudentDetails(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentDetailsPageLoaded({
        studentDetails: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  

  @Effect()
  deleteStudentDetail$ = this.actions$
    .pipe(
      ofType<OneStudentDetailDeleted>(StudentDetailActionTypes.OneStudentDetailDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentDetailsService.deleteStudentDetail(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudentDetails$ = this.actions$
    .pipe(
      ofType<ManyStudentDetailsDeleted>(StudentDetailActionTypes.ManyStudentDetailsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentDetailsService.deleteStudentDetails(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudentDetail$ = this.actions$
    .pipe(
      ofType<StudentDetailUpdated>(StudentDetailActionTypes.StudentDetailUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentDetailsService.updateStudentDetail(payload.studentDetail);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentDetailsStatus$ = this.actions$
    .pipe(
      ofType<StudentDetailsStatusUpdated>(StudentDetailActionTypes.StudentDetailsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentDetailsService.updateStatusForStudentDetail(payload.studentDetails, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudentDetail$ = this.actions$
    .pipe(
      ofType<StudentDetailOnServerCreated>(StudentDetailActionTypes.StudentDetailOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentDetailsService.createStudentDetail(payload.studentDetail).pipe(
          tap(res => {
            this.store.dispatch(new StudentDetailCreated({studentDetail: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentDetailsService: StudentDetailService, private store: Store<AppState>) {
  }
}
