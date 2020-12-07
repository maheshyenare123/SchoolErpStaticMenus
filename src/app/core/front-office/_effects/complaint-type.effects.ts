import {QueryParamsModel} from './../../_base/crud/models/query-models/query-params.model';
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
import {ComplaintTypeService} from '../_services/complaint-type.service';
// State
import {AppState} from '../../../core/reducers';
// Actions
import {
  ComplaintTypeActionToggleLoading,
  ComplaintTypeActionTypes,
  ComplaintTypeCreated,
  ComplaintTypeOnServerCreated,
  ComplaintTypesPageLoaded,
  ComplaintTypesPageRequested,
  ComplaintTypesPageToggleLoading,
  ComplaintTypesStatusUpdated,
  ComplaintTypeUpdated,
  ManyComplaintTypesDeleted,
  OneComplaintTypeDeleted
} from '../_actions/complaint-type.actions';

@Injectable()
export class ComplaintTypeEffects {
  showPageLoadingDistpatcher = new ComplaintTypesPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new ComplaintTypeActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new ComplaintTypeActionToggleLoading({isLoading: false});

  @Effect()
  loadComplaintTypesPage$ = this.actions$.pipe(
    ofType<ComplaintTypesPageRequested>(ComplaintTypeActionTypes.ComplaintTypesPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.complaintEnquirysService.findComplaintTypes(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new ComplaintTypesPageLoaded({
        complaintTypes: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );
  


  @Effect()
  deleteComplaintType$ = this.actions$
    .pipe(
      ofType<OneComplaintTypeDeleted>(ComplaintTypeActionTypes.OneComplaintTypeDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.complaintEnquirysService.deleteComplaintType(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteComplaintTypes$ = this.actions$
    .pipe(
      ofType<ManyComplaintTypesDeleted>(ComplaintTypeActionTypes.ManyComplaintTypesDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.complaintEnquirysService.deleteComplaintTypes(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateComplaintType$ = this.actions$
    .pipe(
      ofType<ComplaintTypeUpdated>(ComplaintTypeActionTypes.ComplaintTypeUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.complaintEnquirysService.updateComplaintType(payload.complaintType);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateComplaintTypesStatus$ = this.actions$
    .pipe(
      ofType<ComplaintTypesStatusUpdated>(ComplaintTypeActionTypes.ComplaintTypesStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.complaintEnquirysService.updateStatusForComplaintType(payload.complaintTypes, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createComplaintType$ = this.actions$
    .pipe(
      ofType<ComplaintTypeOnServerCreated>(ComplaintTypeActionTypes.ComplaintTypeOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.complaintEnquirysService.createComplaintType(payload.complaintType).pipe(
          tap(res => {
            this.store.dispatch(new ComplaintTypeCreated({complaintType: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private complaintEnquirysService: ComplaintTypeService, private store: Store<AppState>) {
  }
}
