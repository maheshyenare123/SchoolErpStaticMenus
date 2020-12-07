// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ItemStoreActions, ItemStoreActionTypes } from '../_actions/item-store.actions';
// Models
import { ItemStoreModel } from '../_models/item-store.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ItemStoresState extends EntityState<ItemStoreModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedItemStoreId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ItemStoreModel> = createEntityAdapter<ItemStoreModel>();

export const initialItemStoresState: ItemStoresState = adapter.getInitialState({
  itemStoreForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedItemStoreId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function itemStoresReducer(state = initialItemStoresState, action: ItemStoreActions): ItemStoresState {
  switch (action.type) {
    case ItemStoreActionTypes.ItemStoresPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedItemStoreId: undefined
      };
    }
    case ItemStoreActionTypes.ItemStoreActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ItemStoreActionTypes.ItemStoreOnServerCreated:
      return {
        ...state
      };
    case ItemStoreActionTypes.ItemStoreCreated:
      return adapter.addOne(action.payload.itemStore, {
        ...state, lastCreatedItemStoreId: action.payload.itemStore.id
      });
    case ItemStoreActionTypes.ItemStoreUpdated:
      return adapter.updateOne(action.payload.partialItemStore, state);
    // case ItemStoreActionTypes.ItemStoresStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialItemStores: Update<ItemStoreModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.itemStores.length; i++) {
    //     _partialItemStores.push({
    //       id: action.payload.itemStores[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialItemStores, state);
    // }
    case ItemStoreActionTypes.OneItemStoreDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ItemStoreActionTypes.ManyItemStoresDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ItemStoreActionTypes.ItemStoresPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ItemStoreActionTypes.ItemStoresPageLoaded: {
      return adapter.addMany(action.payload.itemStores, {
        ...initialItemStoresState,
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

export const getItemStoreState = createFeatureSelector<ItemStoreModel>('itemStores');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
