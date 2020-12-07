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
import {SubjectGroupService} from '../_services/subject-group.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  SubjectGroupActionToggleLoading,
  SubjectGroupActionTypes,
  SubjectGroupCreated,
  SubjectGroupOnServerCreated,
  SubjectGroupsPageLoaded,
  SubjectGroupsPageRequested,
  SubjectGroupsPageToggleLoading,
  SubjectGroupsStatusUpdated,
  SubjectGroupUpdated,
  ManySubjectGroupsDeleted,
  OneSubjectGroupDeleted
} from '../_actions/subject-group.actions';

@Injectable()
export class SubjectGroupEffects {
  showPageLoadingDistpatcher = new SubjectGroupsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new SubjectGroupActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new SubjectGroupActionToggleLoading({isLoading: false});

  @Effect()
  loadSubjectGroupsPage$ = this.actions$.pipe(
    ofType<SubjectGroupsPageRequested>(SubjectGroupActionTypes.SubjectGroupsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.subjectGroupsService.findSubjectGroups(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new SubjectGroupsPageLoaded({
        subjectGroups: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteSubjectGroup$ = this.actions$
    .pipe(
      ofType<OneSubjectGroupDeleted>(SubjectGroupActionTypes.OneSubjectGroupDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.subjectGroupsService.deleteSubjectGroup(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteSubjectGroups$ = this.actions$
    .pipe(
      ofType<ManySubjectGroupsDeleted>(SubjectGroupActionTypes.ManySubjectGroupsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.subjectGroupsService.deleteSubjectGroups(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateSubjectGroup$ = this.actions$
    .pipe(
      ofType<SubjectGroupUpdated>(SubjectGroupActionTypes.SubjectGroupUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.subjectGroupsService.updateSubjectGroup(payload.subjectGroup);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateSubjectGroupsStatus$ = this.actions$
    .pipe(
      ofType<SubjectGroupsStatusUpdated>(SubjectGroupActionTypes.SubjectGroupsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.subjectGroupsService.updateStatusForSubjectGroup(payload.subjectGroups, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createSubjectGroup$ = this.actions$
    .pipe(
      ofType<SubjectGroupOnServerCreated>(SubjectGroupActionTypes.SubjectGroupOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.subjectGroupsService.createSubjectGroup(payload.subjectGroup).pipe(
          tap(res => {
            this.store.dispatch(new SubjectGroupCreated({subjectGroup: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private subjectGroupsService: SubjectGroupService, private store: Store<AppState>) {
  }
}
