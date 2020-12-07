// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AddItemActions, AddItemActionTypes } from '../_actions/add-item.actions';
// Models
import { AddItemModel } from '../_models/add-item.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AddItemsState extends EntityState<AddItemModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAddItemId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AddItemModel> = createEntityAdapter<AddItemModel>();

export const initialAddItemsState: AddItemsState = adapter.getInitialState({
  addItemForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAddItemId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function addItemsReducer(state = initialAddItemsState, action: AddItemActions): AddItemsState {
  switch (action.type) {
    case AddItemActionTypes.AddItemsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAddItemId: undefined
      };
    }
    case AddItemActionTypes.AddItemActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AddItemActionTypes.AddItemOnServerCreated:
      return {
        ...state
      };
    case AddItemActionTypes.AddItemCreated:
      return adapter.addOne(action.payload.addItem, {
        ...state, lastCreatedAddItemId: action.payload.addItem.id
      });
    case AddItemActionTypes.AddItemUpdated:
      return adapter.updateOne(action.payload.partialAddItem, state);
    // case AddItemActionTypes.AddItemsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAddItems: Update<AddItemModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.addItems.length; i++) {
    //     _partialAddItems.push({
    //       id: action.payload.addItems[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAddItems, state);
    // }
    case AddItemActionTypes.OneAddItemDeleted:
      return adapter.removeOne(action.payload.id, state);
    case AddItemActionTypes.ManyAddItemsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AddItemActionTypes.AddItemsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AddItemActionTypes.AddItemsPageLoaded: {
      return adapter.addMany(action.payload.addItems, {
        ...initialAddItemsState,
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

export const getAddItemState = createFeatureSelector<AddItemModel>('addItems');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
