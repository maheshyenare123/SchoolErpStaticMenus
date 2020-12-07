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
import {StudentFeeDepositeService} from '../_services/student-fee-deposite.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentFeeDepositeActionToggleLoading,
  StudentFeeDepositeActionTypes,
  StudentFeeDepositeCreated,
  StudentFeeDepositeOnServerCreated,
  StudentFeeDepositesPageLoaded,
  StudentFeeDepositesPageRequested,
  StudentFeeDepositesPageToggleLoading,
  StudentFeeDepositesStatusUpdated,
  StudentFeeDepositeUpdated,
  ManyStudentFeeDepositesDeleted,
  OneStudentFeeDepositeDeleted
} from '../_actions/student-fee-deposite.actions';

@Injectable()
export class StudentFeeDepositeEffects {
  showPageLoadingDistpatcher = new StudentFeeDepositesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentFeeDepositeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentFeeDepositeActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentFeeDepositesPage$ = this.actions$.pipe(
    ofType<StudentFeeDepositesPageRequested>(StudentFeeDepositeActionTypes.StudentFeeDepositesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentFeeDepositesService.findStudentFeeDeposites(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentFeeDepositesPageLoaded({
        studentFeeDeposites: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStudentFeeDeposite$ = this.actions$
    .pipe(
      ofType<OneStudentFeeDepositeDeleted>(StudentFeeDepositeActionTypes.OneStudentFeeDepositeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentFeeDepositesService.deleteStudentFeeDeposite(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudentFeeDeposites$ = this.actions$
    .pipe(
      ofType<ManyStudentFeeDepositesDeleted>(StudentFeeDepositeActionTypes.ManyStudentFeeDepositesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentFeeDepositesService.deleteStudentFeeDeposites(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudentFeeDeposite$ = this.actions$
    .pipe(
      ofType<StudentFeeDepositeUpdated>(StudentFeeDepositeActionTypes.StudentFeeDepositeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentFeeDepositesService.updateStudentFeeDeposite(payload.studentFeeDeposite);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentFeeDepositesStatus$ = this.actions$
    .pipe(
      ofType<StudentFeeDepositesStatusUpdated>(StudentFeeDepositeActionTypes.StudentFeeDepositesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentFeeDepositesService.updateStatusForStudentFeeDeposite(payload.studentFeeDeposites, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudentFeeDeposite$ = this.actions$
    .pipe(
      ofType<StudentFeeDepositeOnServerCreated>(StudentFeeDepositeActionTypes.StudentFeeDepositeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentFeeDepositesService.createStudentFeeDeposite(payload.studentFeeDeposite).pipe(
          tap(res => {
            this.store.dispatch(new StudentFeeDepositeCreated({studentFeeDeposite: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentFeeDepositesService: StudentFeeDepositeService, private store: Store<AppState>) {
  }
}
