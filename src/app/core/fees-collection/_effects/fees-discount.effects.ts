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
import {FeesDiscountService} from '../_services/fees-discount.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  FeesDiscountActionToggleLoading,
  FeesDiscountActionTypes,
  FeesDiscountCreated,
  FeesDiscountOnServerCreated,
  FeesDiscountsPageLoaded,
  FeesDiscountsPageRequested,
  FeesDiscountsPageToggleLoading,
  FeesDiscountsStatusUpdated,
  FeesDiscountUpdated,
  ManyFeesDiscountsDeleted,
  OneFeesDiscountDeleted
} from '../_actions/fees-discount.actions';

@Injectable()
export class FeesDiscountEffects {
  showPageLoadingDistpatcher = new FeesDiscountsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new FeesDiscountActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new FeesDiscountActionToggleLoading({isLoading: false});

  @Effect()
  loadFeesDiscountsPage$ = this.actions$.pipe(
    ofType<FeesDiscountsPageRequested>(FeesDiscountActionTypes.FeesDiscountsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.feesDiscountsService.findFeesDiscounts(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new FeesDiscountsPageLoaded({
        feesDiscounts: data.content,
    totalCount: data.totalElements,
    page: lastQuery
      });
    })
  );
  
  @Effect()
  deleteFeesDiscount$ = this.actions$
    .pipe(
      ofType<OneFeesDiscountDeleted>(FeesDiscountActionTypes.OneFeesDiscountDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesDiscountsService.deleteFeesDiscount(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteFeesDiscounts$ = this.actions$
    .pipe(
      ofType<ManyFeesDiscountsDeleted>(FeesDiscountActionTypes.ManyFeesDiscountsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.feesDiscountsService.deleteFeesDiscounts(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateFeesDiscount$ = this.actions$
    .pipe(
      ofType<FeesDiscountUpdated>(FeesDiscountActionTypes.FeesDiscountUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesDiscountsService.updateFeesDiscount(payload.feesDiscount);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateFeesDiscountsStatus$ = this.actions$
    .pipe(
      ofType<FeesDiscountsStatusUpdated>(FeesDiscountActionTypes.FeesDiscountsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesDiscountsService.updateStatusForFeesDiscount(payload.feesDiscounts, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createFeesDiscount$ = this.actions$
    .pipe(
      ofType<FeesDiscountOnServerCreated>(FeesDiscountActionTypes.FeesDiscountOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.feesDiscountsService.createFeesDiscount(payload.feesDiscount).pipe(
          tap(res => {
            this.store.dispatch(new FeesDiscountCreated({feesDiscount: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private feesDiscountsService: FeesDiscountService, private store: Store<AppState>) {
  }
}
