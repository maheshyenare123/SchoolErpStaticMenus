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
import {DisabledStudentService} from '../_services/disabled-student.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  DisabledStudentActionToggleLoading,
  DisabledStudentActionTypes,
  DisabledStudentCreated,
  DisabledStudentOnServerCreated,
  DisabledStudentsPageLoaded,
  DisabledStudentsPageRequested,
  DisabledStudentsPageToggleLoading,
  DisabledStudentsStatusUpdated,
  DisabledStudentUpdated,
  ManyDisabledStudentsDeleted,
  OneDisabledStudentDeleted
} from '../_actions/disabled-student.actions';

@Injectable()
export class DisabledStudentEffects {
  showPageLoadingDistpatcher = new DisabledStudentsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new DisabledStudentActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new DisabledStudentActionToggleLoading({isLoading: false});

  @Effect()
  loadDisabledStudentsPage$ = this.actions$.pipe(
    ofType<DisabledStudentsPageRequested>(DisabledStudentActionTypes.DisabledStudentsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.disabledStudentsService.findDisabledStudents(payload.page,payload.classId,payload.sectionId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data']
      return new DisabledStudentsPageLoaded({
        disabledStudents: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteDisabledStudent$ = this.actions$
    .pipe(
      ofType<OneDisabledStudentDeleted>(DisabledStudentActionTypes.OneDisabledStudentDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.disabledStudentsService.deleteDisabledStudent(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteDisabledStudents$ = this.actions$
    .pipe(
      ofType<ManyDisabledStudentsDeleted>(DisabledStudentActionTypes.ManyDisabledStudentsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.disabledStudentsService.deleteDisabledStudents(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateDisabledStudent$ = this.actions$
    .pipe(
      ofType<DisabledStudentUpdated>(DisabledStudentActionTypes.DisabledStudentUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.disabledStudentsService.updateDisabledStudent(payload.disabledStudent);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateDisabledStudentsStatus$ = this.actions$
    .pipe(
      ofType<DisabledStudentsStatusUpdated>(DisabledStudentActionTypes.DisabledStudentsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.disabledStudentsService.updateStatusForDisabledStudent(payload.disabledStudents, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createDisabledStudent$ = this.actions$
    .pipe(
      ofType<DisabledStudentOnServerCreated>(DisabledStudentActionTypes.DisabledStudentOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.disabledStudentsService.createDisabledStudent(payload.disabledStudent).pipe(
          tap(res => {
            this.store.dispatch(new DisabledStudentCreated({disabledStudent: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private disabledStudentsService: DisabledStudentService, private store: Store<AppState>) {
  }
}
