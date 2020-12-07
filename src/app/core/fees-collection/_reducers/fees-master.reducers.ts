// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { FeesMasterActions, FeesMasterActionTypes } from '../_actions/fees-master.actions';
// Models
import { FeesMasterModel } from '../_models/fees-master.model';
import { QueryParamsModel } from '../../_base/crud';

export interface FeesMastersState extends EntityState<FeesMasterModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedFeesMasterId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<FeesMasterModel> = createEntityAdapter<FeesMasterModel>();

export const initialFeesMastersState: FeesMastersState = adapter.getInitialState({
  feesMasterForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedFeesMasterId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function feesMastersReducer(state = initialFeesMastersState, action: FeesMasterActions): FeesMastersState {
  switch (action.type) {
    case FeesMasterActionTypes.FeesMastersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedFeesMasterId: undefined
      };
    }
    case FeesMasterActionTypes.FeesMasterActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case FeesMasterActionTypes.FeesMasterOnServerCreated:
      return {
        ...state
      };
    case FeesMasterActionTypes.FeesMasterCreated:
      return adapter.addOne(action.payload.feesMaster, {
        ...state, lastCreatedFeesMasterId: action.payload.feesMaster.id
      });
    case FeesMasterActionTypes.FeesMasterUpdated:
      return adapter.updateOne(action.payload.partialFeesMaster, state);
    // case FeesMasterActionTypes.FeesMastersStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialFeesMasters: Update<FeesMasterModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.feesMasters.length; i++) {
    //     _partialFeesMasters.push({
    //       id: action.payload.feesMasters[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialFeesMasters, state);
    // }
    case FeesMasterActionTypes.OneFeesMasterDeleted:
      return adapter.removeOne(action.payload.id, state);
    case FeesMasterActionTypes.ManyFeesMastersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case FeesMasterActionTypes.FeesMastersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case FeesMasterActionTypes.FeesMastersPageLoaded: {
      return adapter.addMany(action.payload.feesMasters, {
        ...initialFeesMastersState,
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

export const getFeesMasterState = createFeatureSelector<FeesMasterModel>('feesMasters');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
