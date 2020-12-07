// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ItemSupplierActions, ItemSupplierActionTypes } from '../_actions/item-supplier.actions';
// Models
import { ItemSupplierModel } from '../_models/item-supplier.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ItemSuppliersState extends EntityState<ItemSupplierModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedItemSupplierId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ItemSupplierModel> = createEntityAdapter<ItemSupplierModel>();

export const initialItemSuppliersState: ItemSuppliersState = adapter.getInitialState({
  itemSupplierForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedItemSupplierId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function itemSuppliersReducer(state = initialItemSuppliersState, action: ItemSupplierActions): ItemSuppliersState {
  switch (action.type) {
    case ItemSupplierActionTypes.ItemSuppliersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedItemSupplierId: undefined
      };
    }
    case ItemSupplierActionTypes.ItemSupplierActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ItemSupplierActionTypes.ItemSupplierOnServerCreated:
      return {
        ...state
      };
    case ItemSupplierActionTypes.ItemSupplierCreated:
      return adapter.addOne(action.payload.itemSupplier, {
        ...state, lastCreatedItemSupplierId: action.payload.itemSupplier.id
      });
    case ItemSupplierActionTypes.ItemSupplierUpdated:
      return adapter.updateOne(action.payload.partialItemSupplier, state);
    // case ItemSupplierActionTypes.ItemSuppliersStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialItemSuppliers: Update<ItemSupplierModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.itemSuppliers.length; i++) {
    //     _partialItemSuppliers.push({
    //       id: action.payload.itemSuppliers[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialItemSuppliers, state);
    // }
    case ItemSupplierActionTypes.OneItemSupplierDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ItemSupplierActionTypes.ManyItemSuppliersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ItemSupplierActionTypes.ItemSuppliersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ItemSupplierActionTypes.ItemSuppliersPageLoaded: {
      return adapter.addMany(action.payload.itemSuppliers, {
        ...initialItemSuppliersState,
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

export const getItemSupplierState = createFeatureSelector<ItemSupplierModel>('itemSuppliers');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
