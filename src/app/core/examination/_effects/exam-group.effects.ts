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
import {ExamGroupService} from '../_services/exam-group.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ExamGroupActionToggleLoading,
  ExamGroupActionTypes,
  ExamGroupCreated,
  ExamGroupOnServerCreated,
  ExamGroupsPageLoaded,
  ExamGroupsPageRequested,
  ExamGroupsPageToggleLoading,
  ExamGroupsStatusUpdated,
  ExamGroupUpdated,
  ManyExamGroupsDeleted,
  OneExamGroupDeleted
} from '../_actions/exam-group.actions';

@Injectable()
export class ExamGroupEffects {
  showPageLoadingDistpatcher = new ExamGroupsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ExamGroupActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ExamGroupActionToggleLoading({isLoading: false});

  @Effect()
  loadExamGroupsPage$ = this.actions$.pipe(
    ofType<ExamGroupsPageRequested>(ExamGroupActionTypes.ExamGroupsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.examGroupsService.findExamGroups(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ExamGroupsPageLoaded({
        examGroups: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteExamGroup$ = this.actions$
    .pipe(
      ofType<OneExamGroupDeleted>(ExamGroupActionTypes.OneExamGroupDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examGroupsService.deleteExamGroup(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteExamGroups$ = this.actions$
    .pipe(
      ofType<ManyExamGroupsDeleted>(ExamGroupActionTypes.ManyExamGroupsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.examGroupsService.deleteExamGroups(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateExamGroup$ = this.actions$
    .pipe(
      ofType<ExamGroupUpdated>(ExamGroupActionTypes.ExamGroupUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examGroupsService.updateExamGroup(payload.examGroup);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateExamGroupsStatus$ = this.actions$
    .pipe(
      ofType<ExamGroupsStatusUpdated>(ExamGroupActionTypes.ExamGroupsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examGroupsService.updateStatusForExamGroup(payload.examGroups, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createExamGroup$ = this.actions$
    .pipe(
      ofType<ExamGroupOnServerCreated>(ExamGroupActionTypes.ExamGroupOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.examGroupsService.createExamGroup(payload.examGroup).pipe(
          tap(res => {
            this.store.dispatch(new ExamGroupCreated({examGroup: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private examGroupsService: ExamGroupService, private store: Store<AppState>) {
  }
}
