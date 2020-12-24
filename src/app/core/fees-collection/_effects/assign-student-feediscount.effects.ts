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
import {AssignStudentFeediscountService} from '../_services/assign-student-feediscount.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  AssignStudentFeediscountActionToggleLoading,
  AssignStudentFeediscountActionTypes,
  AssignStudentFeediscountCreated,
  AssignStudentFeediscountOnServerCreated,
  AssignStudentFeediscountsPageLoaded,
  AssignStudentFeediscountsPageRequested,
  AssignStudentFeediscountsPageToggleLoading,
  AssignStudentFeediscountsStatusUpdated,
  AssignStudentFeediscountUpdated,
  ManyAssignStudentFeediscountsDeleted,
  OneAssignStudentFeediscountDeleted
} from '../_actions/assign-student-feediscount.actions';

@Injectable()
export class AssignStudentFeediscountEffects {
  showPageLoadingDistpatcher = new AssignStudentFeediscountsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new AssignStudentFeediscountActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new AssignStudentFeediscountActionToggleLoading({isLoading: false});

  @Effect()
  loadAssignStudentFeediscountsPage$ = this.actions$.pipe(
    ofType<AssignStudentFeediscountsPageRequested>(AssignStudentFeediscountActionTypes.AssignStudentFeediscountsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.assignStudentFeediscountsService.findAssignStudentFeediscounts(payload.page,payload.classId,payload.sectionId,payload.category,payload.gender,payload.rte,payload.feeGroupId);
      const lastQuery = of(payload.page); 
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      debugger
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
     const data : FindResultsModel= result['data'];
     const data1 : FindResultsModel= data['studentDetails'];
      
      
      return new AssignStudentFeediscountsPageLoaded({
        
      assignStudentFeediscounts: data1.content,
      totalCount: data1.totalElements,
      page: lastQuery
    
      });
    })
  );
  
  @Effect()
  deleteAssignStudentFeediscount$ = this.actions$
    .pipe(
      ofType<OneAssignStudentFeediscountDeleted>(AssignStudentFeediscountActionTypes.OneAssignStudentFeediscountDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignStudentFeediscountsService.deleteAssignStudentFeediscount(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteAssignStudentFeediscounts$ = this.actions$
    .pipe(
      ofType<ManyAssignStudentFeediscountsDeleted>(AssignStudentFeediscountActionTypes.ManyAssignStudentFeediscountsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.assignStudentFeediscountsService.deleteAssignStudentFeediscounts(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateAssignStudentFeediscount$ = this.actions$
    .pipe(
      ofType<AssignStudentFeediscountUpdated>(AssignStudentFeediscountActionTypes.AssignStudentFeediscountUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentFeediscountsService.updateAssignStudentFeediscount(payload.assignStudentFeediscount);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateAssignStudentFeediscountsStatus$ = this.actions$
    .pipe(
      ofType<AssignStudentFeediscountsStatusUpdated>(AssignStudentFeediscountActionTypes.AssignStudentFeediscountsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentFeediscountsService.updateStatusForAssignStudentFeediscount(payload.assignStudentFeediscounts, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createAssignStudentFeediscount$ = this.actions$
    .pipe(
      ofType<AssignStudentFeediscountOnServerCreated>(AssignStudentFeediscountActionTypes.AssignStudentFeediscountOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.assignStudentFeediscountsService.createAssignStudentFeediscount(payload.assignStudentFeediscount).pipe(
          tap(res => {
            this.store.dispatch(new AssignStudentFeediscountCreated({assignStudentFeediscount: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private assignStudentFeediscountsService: AssignStudentFeediscountService, private store: Store<AppState>) {
  }
}
