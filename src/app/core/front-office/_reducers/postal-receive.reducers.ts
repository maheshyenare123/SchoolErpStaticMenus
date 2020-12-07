// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { PostalReceiveActions, PostalReceiveActionTypes } from '../_actions/postal-receive.actions';
// Models
import { DispatchReceiveModel } from '../_models/dispose-dispatch-receive.model';
import { QueryParamsModel } from '../../_base/crud';

export interface PostalReceivesState extends EntityState<DispatchReceiveModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedPostalReceiveId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<DispatchReceiveModel> = createEntityAdapter<DispatchReceiveModel>();

export const initialPostalReceivesState: PostalReceivesState = adapter.getInitialState({
  postalReceiveForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedPostalReceiveId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function postalReceivesReducer(state = initialPostalReceivesState, action: PostalReceiveActions): PostalReceivesState {
  switch (action.type) {
    case PostalReceiveActionTypes.PostalReceivesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedPostalReceiveId: undefined
      };
    }
    case PostalReceiveActionTypes.PostalReceiveActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case PostalReceiveActionTypes.PostalReceiveOnServerCreated:
      return {
        ...state
      };
    case PostalReceiveActionTypes.PostalReceiveCreated:
      return adapter.addOne(action.payload.postalReceive, {
        ...state, lastCreatedPostalReceiveId: action.payload.postalReceive.id
      });
    case PostalReceiveActionTypes.PostalReceiveUpdated:
      return adapter.updateOne(action.payload.partialPostalReceive, state);
    // case PostalReceiveActionTypes.PostalReceivesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialPostalReceives: Update<DispatchReceiveModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.postalReceives.length; i++) {
    //     _partialPostalReceives.push({
    //       id: action.payload.postalReceives[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialPostalReceives, state);
    // }
    case PostalReceiveActionTypes.OnePostalReceiveDeleted:
      return adapter.removeOne(action.payload.id, state);
    case PostalReceiveActionTypes.ManyPostalReceivesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case PostalReceiveActionTypes.PostalReceivesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case PostalReceiveActionTypes.PostalReceivesPageLoaded: {
      return adapter.addMany(action.payload.postalReceives, {
        ...initialPostalReceivesState,
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

export const getPostalReceiveState = createFeatureSelector<DispatchReceiveModel>('postalReceives');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
