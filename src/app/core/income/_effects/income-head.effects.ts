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
import {IncomeHeadService} from '../_services/income-head.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  IncomeHeadActionToggleLoading,
  IncomeHeadActionTypes,
  IncomeHeadCreated,
  IncomeHeadOnServerCreated,
  IncomeHeadsPageLoaded,
  IncomeHeadsPageRequested,
  IncomeHeadsPageToggleLoading,
  IncomeHeadsStatusUpdated,
  IncomeHeadUpdated,
  ManyIncomeHeadsDeleted,
  OneIncomeHeadDeleted
} from '../_actions/income-head.actions';

@Injectable()
export class IncomeHeadEffects {
  showPageLoadingDistpatcher = new IncomeHeadsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new IncomeHeadActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new IncomeHeadActionToggleLoading({isLoading: false});

  @Effect()
  loadIncomeHeadsPage$ = this.actions$.pipe(
    ofType<IncomeHeadsPageRequested>(IncomeHeadActionTypes.IncomeHeadsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.incomeHeadsService.findIncomeHeads(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new IncomeHeadsPageLoaded({
        incomeHeads: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteIncomeHead$ = this.actions$
    .pipe(
      ofType<OneIncomeHeadDeleted>(IncomeHeadActionTypes.OneIncomeHeadDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.incomeHeadsService.deleteIncomeHead(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteIncomeHeads$ = this.actions$
    .pipe(
      ofType<ManyIncomeHeadsDeleted>(IncomeHeadActionTypes.ManyIncomeHeadsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.incomeHeadsService.deleteIncomeHeads(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateIncomeHead$ = this.actions$
    .pipe(
      ofType<IncomeHeadUpdated>(IncomeHeadActionTypes.IncomeHeadUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.incomeHeadsService.updateIncomeHead(payload.incomeHead);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateIncomeHeadsStatus$ = this.actions$
    .pipe(
      ofType<IncomeHeadsStatusUpdated>(IncomeHeadActionTypes.IncomeHeadsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.incomeHeadsService.updateStatusForIncomeHead(payload.incomeHeads, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createIncomeHead$ = this.actions$
    .pipe(
      ofType<IncomeHeadOnServerCreated>(IncomeHeadActionTypes.IncomeHeadOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.incomeHeadsService.createIncomeHead(payload.incomeHead).pipe(
          tap(res => {
            this.store.dispatch(new IncomeHeadCreated({incomeHead: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private incomeHeadsService: IncomeHeadService, private store: Store<AppState>) {
  }
}
