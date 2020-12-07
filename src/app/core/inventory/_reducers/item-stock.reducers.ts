// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ItemStockActions, ItemStockActionTypes } from '../_actions/item-stock.actions';
// Models
import { ItemStockModel } from '../_models/item-stock.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ItemStocksState extends EntityState<ItemStockModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedItemStockId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ItemStockModel> = createEntityAdapter<ItemStockModel>();

export const initialItemStocksState: ItemStocksState = adapter.getInitialState({
  itemStockForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedItemStockId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function itemStocksReducer(state = initialItemStocksState, action: ItemStockActions): ItemStocksState {
  switch (action.type) {
    case ItemStockActionTypes.ItemStocksPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedItemStockId: undefined
      };
    }
    case ItemStockActionTypes.ItemStockActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ItemStockActionTypes.ItemStockOnServerCreated:
      return {
        ...state
      };
    case ItemStockActionTypes.ItemStockCreated:
      return adapter.addOne(action.payload.itemStock, {
        ...state, lastCreatedItemStockId: action.payload.itemStock.id
      });
    case ItemStockActionTypes.ItemStockUpdated:
      return adapter.updateOne(action.payload.partialItemStock, state);
    // case ItemStockActionTypes.ItemStocksStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialItemStocks: Update<ItemStockModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.itemStocks.length; i++) {
    //     _partialItemStocks.push({
    //       id: action.payload.itemStocks[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialItemStocks, state);
    // }
    case ItemStockActionTypes.OneItemStockDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ItemStockActionTypes.ManyItemStocksDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ItemStockActionTypes.ItemStocksPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ItemStockActionTypes.ItemStocksPageLoaded: {
      return adapter.addMany(action.payload.itemStocks, {
        ...initialItemStocksState,
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

export const getItemStockState = createFeatureSelector<ItemStockModel>('itemStocks');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
