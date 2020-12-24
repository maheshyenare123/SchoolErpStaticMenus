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
import {AssignStudentFeemasterService} from '../_services/assign-student-feemaster.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  AssignStudentFeemasterActionToggleLoading,
  AssignStudentFeemasterActionTypes,
  AssignStudentFeemasterCreated,
  AssignStudentFeemasterOnServerCreated,
  AssignStudentFeemastersPageLoaded,
  AssignStudentFeemastersPageRequested,
  AssignStudentFeemastersPageToggleLoading,
  AssignStudentFeemastersStatusUpdated,
  AssignStudentFeemasterUpdated,
  ManyAssignStudentFeemastersDeleted,
  OneAssignStudentFeemasterDeleted
} from '../_actions/assign-student-feemaster.actions';

@Injectable()
export class AssignStudentFeemasterEffects {
  showPageLoadingDistpatcher = new AssignStudentFeemastersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AssignStudentFeemasterActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AssignStudentFeemasterActionToggleLoading({isLoading: false});

  @Effect()
  loadAssignStudentFeemastersPage$ = this.actions$.pipe(
    ofType<AssignStudentFeemastersPageRequested>(AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.assignStudentFeemastersService.findAssignStudentFeemasters(payload.page,payload.classId,payload.sectionId,payload.category,payload.gender,payload.rte,payload.feeGroupId);
      const lastQuery = of(payload.page); 
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
     const data : FindResultsModel= result['data'];
     const data1 : FindResultsModel= data['studentDetails'];
      
      
      return new AssignStudentFeemastersPageLoaded({
        
      assignStudentFeemasters: data1.content,
      totalCount: data1.totalElements,
      page: lastQuery
    
      });
    })
  );
  
  @Effect()
  deleteAssignStudentFeemaster$ = this.actions$
    .pipe(
      ofType<OneAssignStudentFeemasterDeleted>(AssignStudentFeemasterActionTypes.OneAssignStudentFeemasterDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignStudentFeemastersService.deleteAssignStudentFeemaster(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAssignStudentFeemasters$ = this.actions$
    .pipe(
      ofType<ManyAssignStudentFeemastersDeleted>(AssignStudentFeemasterActionTypes.ManyAssignStudentFeemastersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignStudentFeemastersService.deleteAssignStudentFeemasters(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAssignStudentFeemaster$ = this.actions$
    .pipe(
      ofType<AssignStudentFeemasterUpdated>(AssignStudentFeemasterActionTypes.AssignStudentFeemasterUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentFeemastersService.updateAssignStudentFeemaster(payload.assignStudentFeemaster);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAssignStudentFeemastersStatus$ = this.actions$
    .pipe(
      ofType<AssignStudentFeemastersStatusUpdated>(AssignStudentFeemasterActionTypes.AssignStudentFeemastersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentFeemastersService.updateStatusForAssignStudentFeemaster(payload.assignStudentFeemasters, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAssignStudentFeemaster$ = this.actions$
    .pipe(
      ofType<AssignStudentFeemasterOnServerCreated>(AssignStudentFeemasterActionTypes.AssignStudentFeemasterOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentFeemastersService.createAssignStudentFeemaster(payload.assignStudentFeemaster).pipe(
          tap(res => {
            this.store.dispatch(new AssignStudentFeemasterCreated({assignStudentFeemaster: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private assignStudentFeemastersService: AssignStudentFeemasterService, private store: Store<AppState>) {
  }
}
