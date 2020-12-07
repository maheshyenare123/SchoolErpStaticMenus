// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { DisableReasonActions, DisableReasonActionTypes } from '../_actions/disable-reason.actions';
// Models
import { DisableReasonModel } from '../_models/disableReason.model';
import { QueryParamsModel } from '../../_base/crud';

export interface DisableReasonsState extends EntityState<DisableReasonModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedDisableReasonId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<DisableReasonModel> = createEntityAdapter<DisableReasonModel>();

export const initialDisableReasonsState: DisableReasonsState = adapter.getInitialState({
  disableReasonForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedDisableReasonId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function disableReasonsReducer(state = initialDisableReasonsState, action: DisableReasonActions): DisableReasonsState {
  switch (action.type) {
    case DisableReasonActionTypes.DisableReasonsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedDisableReasonId: undefined
      };
    }
    case DisableReasonActionTypes.DisableReasonActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case DisableReasonActionTypes.DisableReasonOnServerCreated:
      return {
        ...state
      };
    case DisableReasonActionTypes.DisableReasonCreated:
      return adapter.addOne(action.payload.disableReason, {
        ...state, lastCreatedDisableReasonId: action.payload.disableReason.id
      });
    case DisableReasonActionTypes.DisableReasonUpdated:
      return adapter.updateOne(action.payload.partialDisableReason, state);
    // case DisableReasonActionTypes.DisableReasonsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialDisableReasons: Update<DisableReasonModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.disableReasons.length; i++) {
    //     _partialDisableReasons.push({
    //       id: action.payload.disableReasons[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialDisableReasons, state);
    // }
    case DisableReasonActionTypes.OneDisableReasonDeleted:
      return adapter.removeOne(action.payload.id, state);
    case DisableReasonActionTypes.ManyDisableReasonsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case DisableReasonActionTypes.DisableReasonsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case DisableReasonActionTypes.DisableReasonsPageLoaded: {
      return adapter.addMany(action.payload.disableReasons, {
        ...initialDisableReasonsState,
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

export const getDisableReasonState = createFeatureSelector<DisableReasonModel>('disableReasons');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
