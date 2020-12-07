// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ItemCategoryActions, ItemCategoryActionTypes } from '../_actions/item-category.actions';
// Models
import { ItemCategoryModel } from '../_models/item-category.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ItemCategorysState extends EntityState<ItemCategoryModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedItemCategoryId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ItemCategoryModel> = createEntityAdapter<ItemCategoryModel>();

export const initialItemCategorysState: ItemCategorysState = adapter.getInitialState({
  itemCategoryForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedItemCategoryId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function itemCategorysReducer(state = initialItemCategorysState, action: ItemCategoryActions): ItemCategorysState {
  switch (action.type) {
    case ItemCategoryActionTypes.ItemCategorysPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedItemCategoryId: undefined
      };
    }
    case ItemCategoryActionTypes.ItemCategoryActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ItemCategoryActionTypes.ItemCategoryOnServerCreated:
      return {
        ...state
      };
    case ItemCategoryActionTypes.ItemCategoryCreated:
      return adapter.addOne(action.payload.itemCategory, {
        ...state, lastCreatedItemCategoryId: action.payload.itemCategory.id
      });
    case ItemCategoryActionTypes.ItemCategoryUpdated:
      return adapter.updateOne(action.payload.partialItemCategory, state);
    // case ItemCategoryActionTypes.ItemCategorysStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialItemCategorys: Update<ItemCategoryModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.itemCategorys.length; i++) {
    //     _partialItemCategorys.push({
    //       id: action.payload.itemCategorys[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialItemCategorys, state);
    // }
    case ItemCategoryActionTypes.OneItemCategoryDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ItemCategoryActionTypes.ManyItemCategorysDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ItemCategoryActionTypes.ItemCategorysPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ItemCategoryActionTypes.ItemCategorysPageLoaded: {
      return adapter.addMany(action.payload.itemCategorys, {
        ...initialItemCategorysState,
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

export const getItemCategoryState = createFeatureSelector<ItemCategoryModel>('itemCategorys');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
