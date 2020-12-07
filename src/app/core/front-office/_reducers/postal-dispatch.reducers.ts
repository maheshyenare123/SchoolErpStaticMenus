// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { PostalDispatchActions, PostalDispatchActionTypes } from '../_actions/postal-dispatch.actions';
// Models
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';
import { QueryParamsModel } from '../../_base/crud';

export interface PostalDispatchsState extends EntityState<DispatchReceiveModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedPostalDispatchId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<DispatchReceiveModel> = createEntityAdapter<DispatchReceiveModel>();

export const initialPostalDispatchsState: PostalDispatchsState = adapter.getInitialState({
  postalDispatchForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedPostalDispatchId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function postalDispatchsReducer(state = initialPostalDispatchsState, action: PostalDispatchActions): PostalDispatchsState {
  switch (action.type) {
    case PostalDispatchActionTypes.PostalDispatchsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedPostalDispatchId: undefined
      };
    }
    case PostalDispatchActionTypes.PostalDispatchActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case PostalDispatchActionTypes.PostalDispatchOnServerCreated:
      return {
        ...state
      };
    case PostalDispatchActionTypes.PostalDispatchCreated:
      return adapter.addOne(action.payload.postalDispatch, {
        ...state, lastCreatedPostalDispatchId: action.payload.postalDispatch.id
      });
    case PostalDispatchActionTypes.PostalDispatchUpdated:
      return adapter.updateOne(action.payload.partialPostalDispatch, state);
    // case PostalDispatchActionTypes.PostalDispatchsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialPostalDispatchs: Update<DispatchReceiveModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.postalDispatchs.length; i++) {
    //     _partialPostalDispatchs.push({
    //       id: action.payload.postalDispatchs[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialPostalDispatchs, state);
    // }
    case PostalDispatchActionTypes.OnePostalDispatchDeleted:
      return adapter.removeOne(action.payload.id, state);
    case PostalDispatchActionTypes.ManyPostalDispatchsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case PostalDispatchActionTypes.PostalDispatchsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case PostalDispatchActionTypes.PostalDispatchsPageLoaded: {
      return adapter.addMany(action.payload.postalDispatchs, {
        ...initialPostalDispatchsState,
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

export const getPostalDispatchState = createFeatureSelector<DispatchReceiveModel>('postalDispatchs');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
