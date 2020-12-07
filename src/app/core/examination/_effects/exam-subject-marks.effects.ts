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
import {ExamSubjectMarksService} from '../_services/exam-subject-marks.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ExamSubjectMarksActionToggleLoading,
  ExamSubjectMarksActionTypes,
  ExamSubjectMarksCreated,
  ExamSubjectMarksOnServerCreated,
  ExamSubjectMarkssPageLoaded,
  ExamSubjectMarkssPageRequested,
  ExamSubjectMarkssPageToggleLoading,
  ExamSubjectMarkssStatusUpdated,
  ExamSubjectMarksUpdated,
  ManyExamSubjectMarkssDeleted,
  OneExamSubjectMarksDeleted
} from '../_actions/exam-subject-marks.actions';

@Injectable()
export class ExamSubjectMarksEffects {
  showPageLoadingDistpatcher = new ExamSubjectMarkssPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ExamSubjectMarksActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ExamSubjectMarksActionToggleLoading({isLoading: false});

  @Effect()
  loadExamSubjectMarkssPage$ = this.actions$.pipe(
    ofType<ExamSubjectMarkssPageRequested>(ExamSubjectMarksActionTypes.ExamSubjectMarkssPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.examSubjectMarkssService.findExamSubjectMarkss(payload.page,payload.classId,payload.sectionId,payload.sessionId,payload.examId,payload.examSubjectId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ExamSubjectMarkssPageLoaded({
        examSubjectMarkss: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteExamSubjectMarks$ = this.actions$
    .pipe(
      ofType<OneExamSubjectMarksDeleted>(ExamSubjectMarksActionTypes.OneExamSubjectMarksDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examSubjectMarkssService.deleteExamSubjectMarks(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteExamSubjectMarkss$ = this.actions$
    .pipe(
      ofType<ManyExamSubjectMarkssDeleted>(ExamSubjectMarksActionTypes.ManyExamSubjectMarkssDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examSubjectMarkssService.deleteExamSubjectMarkss(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateExamSubjectMarks$ = this.actions$
    .pipe(
      ofType<ExamSubjectMarksUpdated>(ExamSubjectMarksActionTypes.ExamSubjectMarksUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examSubjectMarkssService.updateExamSubjectMarks(payload.examSubjectMarks);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateExamSubjectMarkssStatus$ = this.actions$
    .pipe(
      ofType<ExamSubjectMarkssStatusUpdated>(ExamSubjectMarksActionTypes.ExamSubjectMarkssStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examSubjectMarkssService.updateStatusForExamSubjectMarks(payload.examSubjectMarkss, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createExamSubjectMarks$ = this.actions$
    .pipe(
      ofType<ExamSubjectMarksOnServerCreated>(ExamSubjectMarksActionTypes.ExamSubjectMarksOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examSubjectMarkssService.createExamSubjectMarks(payload.examSubjectMarks).pipe(
          tap(res => {
            this.store.dispatch(new ExamSubjectMarksCreated({examSubjectMarks: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private examSubjectMarkssService: ExamSubjectMarksService, private store: Store<AppState>) {
  }
}
