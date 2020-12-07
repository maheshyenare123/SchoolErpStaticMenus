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
import {SessionService} from '../_services/session.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  SessionActionToggleLoading,
  SessionActionTypes,
  SessionCreated,
  SessionOnServerCreated,
  SessionsPageLoaded,
  SessionsPageRequested,
  SessionsPageToggleLoading,
  SessionsStatusUpdated,
  SessionUpdated,
  ManySessionsDeleted,
  OneSessionDeleted
} from '../_actions/session.actions';

@Injectable()
export class SessionEffects {
  showPageLoadingDistpatcher = new SessionsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new SessionActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new SessionActionToggleLoading({isLoading: false});

  @Effect()
  loadSessionsPage$ = this.actions$.pipe(
    ofType<SessionsPageRequested>(SessionActionTypes.SessionsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.sessionService.findSessions(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new SessionsPageLoaded({
        sessions: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteSession$ = this.actions$
    .pipe(
      ofType<OneSessionDeleted>(SessionActionTypes.OneSessionDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.sessionService.deleteSession(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteSessions$ = this.actions$
    .pipe(
      ofType<ManySessionsDeleted>(SessionActionTypes.ManySessionsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.sessionService.deleteSessions(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateSession$ = this.actions$
    .pipe(
      ofType<SessionUpdated>(SessionActionTypes.SessionUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sessionService.updateSession(payload.session);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateSessionsStatus$ = this.actions$
    .pipe(
      ofType<SessionsStatusUpdated>(SessionActionTypes.SessionsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sessionService.updateStatusForSession(payload.sessions, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createSession$ = this.actions$
    .pipe(
      ofType<SessionOnServerCreated>(SessionActionTypes.SessionOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sessionService.createSession(payload.session).pipe(
          tap(res => {
            this.store.dispatch(new SessionCreated({session: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private sessionService: SessionService, private store: Store<AppState>) {
  }
}
