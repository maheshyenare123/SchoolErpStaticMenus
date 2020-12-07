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
import {ExamService} from '../_services/exam.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ExamActionToggleLoading,
  ExamActionTypes,
  ExamCreated,
  ExamOnServerCreated,
  ExamsPageLoaded,
  ExamsPageRequested,
  ExamsPageToggleLoading,
  ExamsStatusUpdated,
  ExamUpdated,
  ManyExamsDeleted,
  OneExamDeleted
} from '../_actions/exam.actions';

@Injectable()
export class ExamEffects {
  showPageLoadingDistpatcher = new ExamsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ExamActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ExamActionToggleLoading({isLoading: false});

  @Effect()
  loadExamsPage$ = this.actions$.pipe(
    ofType<ExamsPageRequested>(ExamActionTypes.ExamsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.examsService.findExams(payload.page , payload.examGroupId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ExamsPageLoaded({
        exams: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteExam$ = this.actions$
    .pipe(
      ofType<OneExamDeleted>(ExamActionTypes.OneExamDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examsService.deleteExam(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteExams$ = this.actions$
    .pipe(
      ofType<ManyExamsDeleted>(ExamActionTypes.ManyExamsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examsService.deleteExams(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateExam$ = this.actions$
    .pipe(
      ofType<ExamUpdated>(ExamActionTypes.ExamUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examsService.updateExam(payload.exam);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateExamsStatus$ = this.actions$
    .pipe(
      ofType<ExamsStatusUpdated>(ExamActionTypes.ExamsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examsService.updateStatusForExam(payload.exams, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createExam$ = this.actions$
    .pipe(
      ofType<ExamOnServerCreated>(ExamActionTypes.ExamOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examsService.createExam(payload.exam).pipe(
          tap(res => {
            this.store.dispatch(new ExamCreated({exam: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private examsService: ExamService, private store: Store<AppState>) {
  }
}
