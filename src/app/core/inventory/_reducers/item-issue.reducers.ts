// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ItemIssueActions, ItemIssueActionTypes } from '../_actions/item-issue.actions';
// Models
import { ItemIssueModel } from '../_models/item-issue.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ItemIssuesState extends EntityState<ItemIssueModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedItemIssueId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ItemIssueModel> = createEntityAdapter<ItemIssueModel>();

export const initialItemIssuesState: ItemIssuesState = adapter.getInitialState({
  itemIssueForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedItemIssueId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function itemIssuesReducer(state = initialItemIssuesState, action: ItemIssueActions): ItemIssuesState {
  switch (action.type) {
    case ItemIssueActionTypes.ItemIssuesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedItemIssueId: undefined
      };
    }
    case ItemIssueActionTypes.ItemIssueActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ItemIssueActionTypes.ItemIssueOnServerCreated:
      return {
        ...state
      };
    case ItemIssueActionTypes.ItemIssueCreated:
      return adapter.addOne(action.payload.itemIssue, {
        ...state, lastCreatedItemIssueId: action.payload.itemIssue.id
      });
    case ItemIssueActionTypes.ItemIssueUpdated:
      return adapter.updateOne(action.payload.partialItemIssue, state);
    // case ItemIssueActionTypes.ItemIssuesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialItemIssues: Update<ItemIssueModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.itemIssues.length; i++) {
    //     _partialItemIssues.push({
    //       id: action.payload.itemIssues[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialItemIssues, state);
    // }
    case ItemIssueActionTypes.OneItemIssueDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ItemIssueActionTypes.ManyItemIssuesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ItemIssueActionTypes.ItemIssuesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ItemIssueActionTypes.ItemIssuesPageLoaded: {
      return adapter.addMany(action.payload.itemIssues, {
        ...initialItemIssuesState,
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

export const getItemIssueState = createFeatureSelector<ItemIssueModel>('itemIssues');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
