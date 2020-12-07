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
import {ClassService} from '../_services/class.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ClassActionToggleLoading,
  ClassActionTypes,
  ClassCreated,
  ClassOnServerCreated,
  ClasssPageLoaded,
  ClasssPageRequested,
  ClasssPageToggleLoading,
  ClasssStatusUpdated,
  ClassUpdated,
  ManyClasssDeleted,
  OneClassDeleted
} from '../_actions/class.actions';

@Injectable()
export class ClassEffects {
  showPageLoadingDistpatcher = new ClasssPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ClassActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ClassActionToggleLoading({isLoading: false});

  @Effect()
  loadClasssPage$ = this.actions$.pipe(
    ofType<ClasssPageRequested>(ClassActionTypes.ClasssPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.classsService.findClasss(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ClasssPageLoaded({
        classs: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteClass$ = this.actions$
    .pipe(
      ofType<OneClassDeleted>(ClassActionTypes.OneClassDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.classsService.deleteClass(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteClasss$ = this.actions$
    .pipe(
      ofType<ManyClasssDeleted>(ClassActionTypes.ManyClasssDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.classsService.deleteClasss(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateClass$ = this.actions$
    .pipe(
      ofType<ClassUpdated>(ClassActionTypes.ClassUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.classsService.updateClass(payload.class);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateClasssStatus$ = this.actions$
    .pipe(
      ofType<ClasssStatusUpdated>(ClassActionTypes.ClasssStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.classsService.updateStatusForClass(payload.classs, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createClass$ = this.actions$
    .pipe(
      ofType<ClassOnServerCreated>(ClassActionTypes.ClassOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.classsService.createClass(payload.class).pipe(
          tap(res => {
            this.store.dispatch(new ClassCreated({class: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private classsService: ClassService, private store: Store<AppState>) {
  }
}
