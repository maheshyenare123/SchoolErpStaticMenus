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
import {StudentFeeAmountDetailsService} from '../_services/student-fee-amount-details.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  StudentFeeAmountDetailsActionToggleLoading,
  StudentFeeAmountDetailsActionTypes,
  StudentFeeAmountDetailsCreated,
  StudentFeeAmountDetailsOnServerCreated,
  StudentFeeAmountDetailssPageLoaded,
  StudentFeeAmountDetailssPageRequested,
  StudentFeeAmountDetailssPageToggleLoading,
  StudentFeeAmountDetailssStatusUpdated,
  StudentFeeAmountDetailsUpdated,
  ManyStudentFeeAmountDetailssDeleted,
  OneStudentFeeAmountDetailsDeleted
} from '../_actions/student-fee-amount-details.actions';

@Injectable()
export class StudentFeeAmountDetailsEffects {
  showPageLoadingDistpatcher = new StudentFeeAmountDetailssPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new StudentFeeAmountDetailsActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new StudentFeeAmountDetailsActionToggleLoading({isLoading: false});

  @Effect()
  loadStudentFeeAmountDetailssPage$ = this.actions$.pipe(
    ofType<StudentFeeAmountDetailssPageRequested>(StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.studentFeeAmountDetailssService.findStudentFeeAmountDetailss(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new StudentFeeAmountDetailssPageLoaded({
        studentFeeAmountDetailss: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteStudentFeeAmountDetails$ = this.actions$
    .pipe(
      ofType<OneStudentFeeAmountDetailsDeleted>(StudentFeeAmountDetailsActionTypes.OneStudentFeeAmountDetailsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentFeeAmountDetailssService.deleteStudentFeeAmountDetails(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteStudentFeeAmountDetailss$ = this.actions$
    .pipe(
      ofType<ManyStudentFeeAmountDetailssDeleted>(StudentFeeAmountDetailsActionTypes.ManyStudentFeeAmountDetailssDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.studentFeeAmountDetailssService.deleteStudentFeeAmountDetailss(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateStudentFeeAmountDetails$ = this.actions$
    .pipe(
      ofType<StudentFeeAmountDetailsUpdated>(StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentFeeAmountDetailssService.updateStudentFeeAmountDetails(payload.studentFeeAmountDetails);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateStudentFeeAmountDetailssStatus$ = this.actions$
    .pipe(
      ofType<StudentFeeAmountDetailssStatusUpdated>(StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentFeeAmountDetailssService.updateStatusForStudentFeeAmountDetails(payload.studentFeeAmountDetailss, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createStudentFeeAmountDetails$ = this.actions$
    .pipe(
      ofType<StudentFeeAmountDetailsOnServerCreated>(StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.studentFeeAmountDetailssService.createStudentFeeAmountDetails(payload.studentFeeAmountDetails).pipe(
          tap(res => {
            this.store.dispatch(new StudentFeeAmountDetailsCreated({studentFeeAmountDetails: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private studentFeeAmountDetailssService: StudentFeeAmountDetailsService, private store: Store<AppState>) {
  }
}
