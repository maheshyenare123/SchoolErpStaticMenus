// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { FeesDiscountsState } from '../_reducers/fees-discount.reducers';
import { FeesDiscountModel } from '../_models/fees-discount.model';

export const selectFeesDiscountsState = createFeatureSelector<FeesDiscountsState>('feesDiscounts');

export const selectFeesDiscountById = (feesDiscountId: number) => createSelector(
    selectFeesDiscountsState,
    feesDiscountsState => feesDiscountsState.entities[feesDiscountId]
);

export const selectFeesDiscountsPageLoading = createSelector(
    selectFeesDiscountsState,
    feesDiscountsState => feesDiscountsState.listLoading
);

export const selectFeesDiscountsActionLoading = createSelector(
    selectFeesDiscountsState,
    feesDiscountsState => feesDiscountsState.actionsloading
);

export const selectLastCreatedFeesDiscountId = createSelector(
    selectFeesDiscountsState,
    feesDiscountsState => feesDiscountsState.lastCreatedFeesDiscountId
);

export const selectFeesDiscountsShowInitWaitingMessage = createSelector(
    selectFeesDiscountsState,
    feesDiscountsState => feesDiscountsState.showInitWaitingMessage
);

export const selectFeesDiscountsInStore = createSelector(
    selectFeesDiscountsState,
    feesDiscountsState => {
      const items: FeesDiscountModel[] = [];
      each(feesDiscountsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: FeesDiscountModel[] =
        httpExtension.sortArray(items, feesDiscountsState.lastQuery.sortField, feesDiscountsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, feesDiscountsState.totalCount, '');
    }
);
