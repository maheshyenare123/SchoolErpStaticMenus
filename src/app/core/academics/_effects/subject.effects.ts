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
import {SubjectService} from '../_services/subject.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  SubjectActionToggleLoading,
  SubjectActionTypes,
  SubjectCreated,
  SubjectOnServerCreated,
  SubjectsPageLoaded,
  SubjectsPageRequested,
  SubjectsPageToggleLoading,
  SubjectsStatusUpdated,
  SubjectUpdated,
  ManySubjectsDeleted,
  OneSubjectDeleted
} from '../_actions/subject.actions';

@Injectable()
export class SubjectEffects {
  showPageLoadingDistpatcher = new SubjectsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new SubjectActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new SubjectActionToggleLoading({isLoading: false});

  @Effect()
  loadSubjectsPage$ = this.actions$.pipe(
    ofType<SubjectsPageRequested>(SubjectActionTypes.SubjectsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.subjectsService.findSubjects(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new SubjectsPageLoaded({
        subjects: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteSubject$ = this.actions$
    .pipe(
      ofType<OneSubjectDeleted>(SubjectActionTypes.OneSubjectDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.subjectsService.deleteSubject(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteSubjects$ = this.actions$
    .pipe(
      ofType<ManySubjectsDeleted>(SubjectActionTypes.ManySubjectsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.subjectsService.deleteSubjects(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateSubject$ = this.actions$
    .pipe(
      ofType<SubjectUpdated>(SubjectActionTypes.SubjectUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.subjectsService.updateSubject(payload.subject);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateSubjectsStatus$ = this.actions$
    .pipe(
      ofType<SubjectsStatusUpdated>(SubjectActionTypes.SubjectsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.subjectsService.updateStatusForSubject(payload.subjects, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createSubject$ = this.actions$
    .pipe(
      ofType<SubjectOnServerCreated>(SubjectActionTypes.SubjectOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.subjectsService.createSubject(payload.subject).pipe(
          tap(res => {
            this.store.dispatch(new SubjectCreated({subject: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private subjectsService: SubjectService, private store: Store<AppState>) {
  }
}
