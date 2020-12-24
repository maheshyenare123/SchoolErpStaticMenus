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
import {AssignClassTeacherService} from '../_services/assign-class-teacher.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  AssignClassTeacherActionToggleLoading,
  AssignClassTeacherActionTypes,
  AssignClassTeacherCreated,
  AssignClassTeacherOnServerCreated,
  AssignClassTeachersPageLoaded,
  AssignClassTeachersPageRequested,
  AssignClassTeachersPageToggleLoading,
  AssignClassTeachersStatusUpdated,
  AssignClassTeacherUpdated,
  ManyAssignClassTeachersDeleted,
  OneAssignClassTeacherDeleted
} from '../_actions/assign-class-teacher.actions';

@Injectable()
export class AssignClassTeacherEffects {
  showPageLoadingDistpatcher = new AssignClassTeachersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AssignClassTeacherActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AssignClassTeacherActionToggleLoading({isLoading: false});

  @Effect()
  loadAssignClassTeachersPage$ = this.actions$.pipe(
    ofType<AssignClassTeachersPageRequested>(AssignClassTeacherActionTypes.AssignClassTeachersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.assignClassTeachersService.findAssignClassTeachers(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new AssignClassTeachersPageLoaded({
        assignClassTeachers: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteAssignClassTeacher$ = this.actions$
    .pipe(
      ofType<OneAssignClassTeacherDeleted>(AssignClassTeacherActionTypes.OneAssignClassTeacherDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignClassTeachersService.deleteAssignClassTeacher(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAssignClassTeachers$ = this.actions$
    .pipe(
      ofType<ManyAssignClassTeachersDeleted>(AssignClassTeacherActionTypes.ManyAssignClassTeachersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignClassTeachersService.deleteAssignClassTeachers(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAssignClassTeacher$ = this.actions$
    .pipe(
      ofType<AssignClassTeacherUpdated>(AssignClassTeacherActionTypes.AssignClassTeacherUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignClassTeachersService.updateAssignClassTeacher(payload.assignClassTeacher);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAssignClassTeachersStatus$ = this.actions$
    .pipe(
      ofType<AssignClassTeachersStatusUpdated>(AssignClassTeacherActionTypes.AssignClassTeachersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignClassTeachersService.updateStatusForAssignClassTeacher(payload.assignClassTeachers, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAssignClassTeacher$ = this.actions$
    .pipe(
      ofType<AssignClassTeacherOnServerCreated>(AssignClassTeacherActionTypes.AssignClassTeacherOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignClassTeachersService.createAssignClassTeacher(payload.assignClassTeacher).pipe(
          tap(res => {
            this.store.dispatch(new AssignClassTeacherCreated({assignClassTeacher: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private assignClassTeachersService: AssignClassTeacherService, private store: Store<AppState>) {
  }
}
