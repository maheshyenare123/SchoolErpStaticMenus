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
import {DepartmentService} from '../_services/department.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  DepartmentActionToggleLoading,
  DepartmentActionTypes,
  DepartmentCreated,
  DepartmentOnServerCreated,
  DepartmentsPageLoaded,
  DepartmentsPageRequested,
  DepartmentsPageToggleLoading,
  DepartmentsStatusUpdated,
  DepartmentUpdated,
  ManyDepartmentsDeleted,
  OneDepartmentDeleted
} from '../_actions/department.actions';

@Injectable()
export class DepartmentEffects {
  showPageLoadingDistpatcher = new DepartmentsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new DepartmentActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new DepartmentActionToggleLoading({isLoading: false});

  @Effect()
  loadDepartmentsPage$ = this.actions$.pipe(
    ofType<DepartmentsPageRequested>(DepartmentActionTypes.DepartmentsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.departmentsService.findDepartments(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new DepartmentsPageLoaded({
        departments: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteDepartment$ = this.actions$
    .pipe(
      ofType<OneDepartmentDeleted>(DepartmentActionTypes.OneDepartmentDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.departmentsService.deleteDepartment(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteDepartments$ = this.actions$
    .pipe(
      ofType<ManyDepartmentsDeleted>(DepartmentActionTypes.ManyDepartmentsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.departmentsService.deleteDepartments(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateDepartment$ = this.actions$
    .pipe(
      ofType<DepartmentUpdated>(DepartmentActionTypes.DepartmentUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.departmentsService.updateDepartment(payload.department);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateDepartmentsStatus$ = this.actions$
    .pipe(
      ofType<DepartmentsStatusUpdated>(DepartmentActionTypes.DepartmentsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.departmentsService.updateStatusForDepartment(payload.departments, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createDepartment$ = this.actions$
    .pipe(
      ofType<DepartmentOnServerCreated>(DepartmentActionTypes.DepartmentOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.departmentsService.createDepartment(payload.department).pipe(
          tap(res => {
            this.store.dispatch(new DepartmentCreated({department: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private departmentsService: DepartmentService, private store: Store<AppState>) {
  }
}
