// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { FeesGroupActions, FeesGroupActionTypes } from '../_actions/fees-group.actions';
// Models
import { FeesGroupModel } from '../_models/fees-group.model';
import { QueryParamsModel } from '../../_base/crud';

export interface FeesGroupsState extends EntityState<FeesGroupModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedFeesGroupId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<FeesGroupModel> = createEntityAdapter<FeesGroupModel>();

export const initialFeesGroupsState: FeesGroupsState = adapter.getInitialState({
  feesGroupForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedFeesGroupId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function feesGroupsReducer(state = initialFeesGroupsState, action: FeesGroupActions): FeesGroupsState {
  switch (action.type) {
    case FeesGroupActionTypes.FeesGroupsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedFeesGroupId: undefined
      };
    }
    case FeesGroupActionTypes.FeesGroupActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case FeesGroupActionTypes.FeesGroupOnServerCreated:
      return {
        ...state
      };
    case FeesGroupActionTypes.FeesGroupCreated:
      return adapter.addOne(action.payload.feesGroup, {
        ...state, lastCreatedFeesGroupId: action.payload.feesGroup.id
      });
    case FeesGroupActionTypes.FeesGroupUpdated:
      return adapter.updateOne(action.payload.partialFeesGroup, state);
    // case FeesGroupActionTypes.FeesGroupsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialFeesGroups: Update<FeesGroupModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.feesGroups.length; i++) {
    //     _partialFeesGroups.push({
    //       id: action.payload.feesGroups[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialFeesGroups, state);
    // }
    case FeesGroupActionTypes.OneFeesGroupDeleted:
      return adapter.removeOne(action.payload.id, state);
    case FeesGroupActionTypes.ManyFeesGroupsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case FeesGroupActionTypes.FeesGroupsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case FeesGroupActionTypes.FeesGroupsPageLoaded: {
      return adapter.addMany(action.payload.feesGroups, {
        ...initialFeesGroupsState,
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

export const getFeesGroupState = createFeatureSelector<FeesGroupModel>('feesGroups');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
