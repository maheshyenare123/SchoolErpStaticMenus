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
import {HomeworkService} from '../_services/homework.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  HomeworkActionToggleLoading,
  HomeworkActionTypes,
  HomeworkCreated,
  HomeworkOnServerCreated,
  HomeworksPageLoaded,
  HomeworksPageRequested,
  HomeworksPageToggleLoading,
  HomeworksStatusUpdated,
  HomeworkUpdated,
  ManyHomeworksDeleted,
  OneHomeworkDeleted
} from '../_actions/homework.actions';

@Injectable()
export class HomeworkEffects {
  showPageLoadingDistpatcher = new HomeworksPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new HomeworkActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new HomeworkActionToggleLoading({isLoading: false});

  @Effect()
  loadHomeworksPage$ = this.actions$.pipe(
    ofType<HomeworksPageRequested>(HomeworkActionTypes.HomeworksPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.homeworksService.findHomeworks(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new HomeworksPageLoaded({
        homeworks: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  
  @Effect()
  deleteHomework$ = this.actions$
    .pipe(
      ofType<OneHomeworkDeleted>(HomeworkActionTypes.OneHomeworkDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.homeworksService.deleteHomework(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteHomeworks$ = this.actions$
    .pipe(
      ofType<ManyHomeworksDeleted>(HomeworkActionTypes.ManyHomeworksDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.homeworksService.deleteHomeworks(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateHomework$ = this.actions$
    .pipe(
      ofType<HomeworkUpdated>(HomeworkActionTypes.HomeworkUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.homeworksService.updateHomework(payload.homework);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateHomeworksStatus$ = this.actions$
    .pipe(
      ofType<HomeworksStatusUpdated>(HomeworkActionTypes.HomeworksStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.homeworksService.updateStatusForHomework(payload.homeworks, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createHomework$ = this.actions$
    .pipe(
      ofType<HomeworkOnServerCreated>(HomeworkActionTypes.HomeworkOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.homeworksService.createHomework(payload.homework).pipe(
          tap(res => {
            this.store.dispatch(new HomeworkCreated({homework: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private homeworksService: HomeworkService, private store: Store<AppState>) {
  }
}
