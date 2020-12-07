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
import {AssignStudentExamService} from '../_services/assign-student-exam.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  AssignStudentExamActionToggleLoading,
  AssignStudentExamActionTypes,
  AssignStudentExamCreated,
  AssignStudentExamOnServerCreated,
  AssignStudentExamsPageLoaded,
  AssignStudentExamsPageRequested,
  AssignStudentExamsPageToggleLoading,
  AssignStudentExamsStatusUpdated,
  AssignStudentExamUpdated,
  ManyAssignStudentExamsDeleted,
  OneAssignStudentExamDeleted
} from '../_actions/assign-student-exam.actions';

@Injectable()
export class AssignStudentExamEffects {
  showPageLoadingDistpatcher = new AssignStudentExamsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AssignStudentExamActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AssignStudentExamActionToggleLoading({isLoading: false});

  @Effect()
  loadAssignStudentExamsPage$ = this.actions$.pipe(
    ofType<AssignStudentExamsPageRequested>(AssignStudentExamActionTypes.AssignStudentExamsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.assignStudentExamsService.findAssignStudentExams(payload.page,payload.classId,payload.sectionId,payload.examId);
      const lastQuery = of(payload.page); 
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
     const data : FindResultsModel= result['data'];
      
      return new AssignStudentExamsPageLoaded({
        
      assignStudentExams: data.content,
      totalCount: data.totalPages,
      page: lastQuery
    
      });
    })
  );
  
  @Effect()
  deleteAssignStudentExam$ = this.actions$
    .pipe(
      ofType<OneAssignStudentExamDeleted>(AssignStudentExamActionTypes.OneAssignStudentExamDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignStudentExamsService.deleteAssignStudentExam(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAssignStudentExams$ = this.actions$
    .pipe(
      ofType<ManyAssignStudentExamsDeleted>(AssignStudentExamActionTypes.ManyAssignStudentExamsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignStudentExamsService.deleteAssignStudentExams(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAssignStudentExam$ = this.actions$
    .pipe(
      ofType<AssignStudentExamUpdated>(AssignStudentExamActionTypes.AssignStudentExamUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentExamsService.updateAssignStudentExam(payload.assignStudentExam);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAssignStudentExamsStatus$ = this.actions$
    .pipe(
      ofType<AssignStudentExamsStatusUpdated>(AssignStudentExamActionTypes.AssignStudentExamsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentExamsService.updateStatusForAssignStudentExam(payload.assignStudentExams, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAssignStudentExam$ = this.actions$
    .pipe(
      ofType<AssignStudentExamOnServerCreated>(AssignStudentExamActionTypes.AssignStudentExamOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentExamsService.createAssignStudentExam(payload.assignStudentExam).pipe(
          tap(res => {
            this.store.dispatch(new AssignStudentExamCreated({assignStudentExam: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private assignStudentExamsService: AssignStudentExamService, private store: Store<AppState>) {
  }
}
