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
import {ClassTimetableService} from '../_services/class-timetable.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  ClassTimetableActionToggleLoading,
  ClassTimetableActionTypes,
  ClassTimetableCreated,
  ClassTimetableOnServerCreated,
  ClassTimetablesPageLoaded,
  ClassTimetablesPageRequested,
  ClassTimetablesPageToggleLoading,
  ClassTimetablesStatusUpdated,
  ClassTimetableUpdated,
  ManyClassTimetablesDeleted,
  OneClassTimetableDeleted
} from '../_actions/class-timetable.actions';

@Injectable()
export class ClassTimetableEffects {
  showPageLoadingDistpatcher = new ClassTimetablesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ClassTimetableActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ClassTimetableActionToggleLoading({isLoading: false});

  @Effect()
  loadClassTimetablesPage$ = this.actions$.pipe(
    ofType<ClassTimetablesPageRequested>(ClassTimetableActionTypes.ClassTimetablesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.classTimetablesService.findClassTimetables(payload.page,payload.classId,payload.sectionId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ClassTimetablesPageLoaded({
        classTimetables: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteClassTimetable$ = this.actions$
    .pipe(
      ofType<OneClassTimetableDeleted>(ClassTimetableActionTypes.OneClassTimetableDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.classTimetablesService.deleteClassTimetable(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteClassTimetables$ = this.actions$
    .pipe(
      ofType<ManyClassTimetablesDeleted>(ClassTimetableActionTypes.ManyClassTimetablesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.classTimetablesService.deleteClassTimetables(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateClassTimetable$ = this.actions$
    .pipe(
      ofType<ClassTimetableUpdated>(ClassTimetableActionTypes.ClassTimetableUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.classTimetablesService.updateClassTimetable(payload.classTimetable);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateClassTimetablesStatus$ = this.actions$
    .pipe(
      ofType<ClassTimetablesStatusUpdated>(ClassTimetableActionTypes.ClassTimetablesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.classTimetablesService.updateStatusForClassTimetable(payload.classTimetables, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createClassTimetable$ = this.actions$
    .pipe(
      ofType<ClassTimetableOnServerCreated>(ClassTimetableActionTypes.ClassTimetableOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.classTimetablesService.createClassTimetable(payload.classTimetable).pipe(
          tap(res => {
            this.store.dispatch(new ClassTimetableCreated({classTimetable: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private classTimetablesService: ClassTimetableService, private store: Store<AppState>) {
  }
}
