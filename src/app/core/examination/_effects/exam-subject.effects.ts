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
import {ExamSubjectService} from '../_services/exam-subject.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ExamSubjectActionToggleLoading,
  ExamSubjectActionTypes,
  ExamSubjectCreated,
  ExamSubjectOnServerCreated,
  ExamSubjectsPageLoaded,
  ExamSubjectsPageRequested,
  ExamSubjectsPageToggleLoading,
  ExamSubjectsStatusUpdated,
  ExamSubjectUpdated,
  ManyExamSubjectsDeleted,
  OneExamSubjectDeleted
} from '../_actions/exam-subject.actions';

@Injectable()
export class ExamSubjectEffects {
  showPageLoadingDistpatcher = new ExamSubjectsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ExamSubjectActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ExamSubjectActionToggleLoading({isLoading: false});

  @Effect()
  loadExamSubjectsPage$ = this.actions$.pipe(
    ofType<ExamSubjectsPageRequested>(ExamSubjectActionTypes.ExamSubjectsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.examSubjectsService.findExamSubjects(payload.page,payload.examId);
      const lastQuery = of(payload.page); 
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
     const data : FindResultsModel= result['data'];
      
      return new ExamSubjectsPageLoaded({
        
      examSubjects: data.content,
      totalCount: data.totalPages,
      page: lastQuery
    
      });
    })
  );
  
  @Effect()
  deleteExamSubject$ = this.actions$
    .pipe(
      ofType<OneExamSubjectDeleted>(ExamSubjectActionTypes.OneExamSubjectDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examSubjectsService.deleteExamSubject(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteExamSubjects$ = this.actions$
    .pipe(
      ofType<ManyExamSubjectsDeleted>(ExamSubjectActionTypes.ManyExamSubjectsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examSubjectsService.deleteExamSubjects(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateExamSubject$ = this.actions$
    .pipe(
      ofType<ExamSubjectUpdated>(ExamSubjectActionTypes.ExamSubjectUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examSubjectsService.updateExamSubject(payload.examSubject);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateExamSubjectsStatus$ = this.actions$
    .pipe(
      ofType<ExamSubjectsStatusUpdated>(ExamSubjectActionTypes.ExamSubjectsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examSubjectsService.updateStatusForExamSubject(payload.examSubjects, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createExamSubject$ = this.actions$
    .pipe(
      ofType<ExamSubjectOnServerCreated>(ExamSubjectActionTypes.ExamSubjectOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examSubjectsService.createExamSubject(payload.examSubject).pipe(
          tap(res => {
            this.store.dispatch(new ExamSubjectCreated({examSubject: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private examSubjectsService: ExamSubjectService, private store: Store<AppState>) {
  }
}
