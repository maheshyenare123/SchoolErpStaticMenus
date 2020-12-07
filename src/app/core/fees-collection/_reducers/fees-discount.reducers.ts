// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { FeesDiscountActions, FeesDiscountActionTypes } from '../_actions/fees-discount.actions';
// Models
import { FeesDiscountModel } from '../_models/fees-discount.model';
import { QueryParamsModel } from '../../_base/crud';

export interface FeesDiscountsState extends EntityState<FeesDiscountModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedFeesDiscountId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<FeesDiscountModel> = createEntityAdapter<FeesDiscountModel>();

export const initialFeesDiscountsState: FeesDiscountsState = adapter.getInitialState({
  feesDiscountForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedFeesDiscountId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function feesDiscountsReducer(state = initialFeesDiscountsState, action: FeesDiscountActions): FeesDiscountsState {
  switch (action.type) {
    case FeesDiscountActionTypes.FeesDiscountsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedFeesDiscountId: undefined
      };
    }
    case FeesDiscountActionTypes.FeesDiscountActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case FeesDiscountActionTypes.FeesDiscountOnServerCreated:
      return {
        ...state
      };
    case FeesDiscountActionTypes.FeesDiscountCreated:
      return adapter.addOne(action.payload.feesDiscount, {
        ...state, lastCreatedFeesDiscountId: action.payload.feesDiscount.id
      });
    case FeesDiscountActionTypes.FeesDiscountUpdated:
      return adapter.updateOne(action.payload.partialFeesDiscount, state);
    // case FeesDiscountActionTypes.FeesDiscountsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialFeesDiscounts: Update<FeesDiscountModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.feesDiscounts.length; i++) {
    //     _partialFeesDiscounts.push({
    //       id: action.payload.feesDiscounts[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialFeesDiscounts, state);
    // }
    case FeesDiscountActionTypes.OneFeesDiscountDeleted:
      return adapter.removeOne(action.payload.id, state);
    case FeesDiscountActionTypes.ManyFeesDiscountsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case FeesDiscountActionTypes.FeesDiscountsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case FeesDiscountActionTypes.FeesDiscountsPageLoaded: {
      return adapter.addMany(action.payload.feesDiscounts, {
        ...initialFeesDiscountsState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    }
    default:
      return state;
  }
}

export const getFeesDiscountState = createFeatureSelector<FeesDiscountModel>('feesDiscounts');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
