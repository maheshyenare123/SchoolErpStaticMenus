// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { IncomeHeadActions, IncomeHeadActionTypes } from '../_actions/income-head.actions';
// Models
import { IncomeHeadModel } from '../_models/income-head.model';
import { QueryParamsModel } from '../../_base/crud';

export interface IncomeHeadsState extends EntityState<IncomeHeadModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedIncomeHeadId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<IncomeHeadModel> = createEntityAdapter<IncomeHeadModel>();

export const initialIncomeHeadsState: IncomeHeadsState = adapter.getInitialState({
  incomeHeadForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedIncomeHeadId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function incomeHeadsReducer(state = initialIncomeHeadsState, action: IncomeHeadActions): IncomeHeadsState {
  switch (action.type) {
    case IncomeHeadActionTypes.IncomeHeadsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedIncomeHeadId: undefined
      };
    }
    case IncomeHeadActionTypes.IncomeHeadActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case IncomeHeadActionTypes.IncomeHeadOnServerCreated:
      return {
        ...state
      };
    case IncomeHeadActionTypes.IncomeHeadCreated:
      return adapter.addOne(action.payload.incomeHead, {
        ...state, lastCreatedIncomeHeadId: action.payload.incomeHead.id
      });
    case IncomeHeadActionTypes.IncomeHeadUpdated:
      return adapter.updateOne(action.payload.partialIncomeHead, state);
    // case IncomeHeadActionTypes.IncomeHeadsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialIncomeHeads: Update<IncomeHeadModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.incomeHeads.length; i++) {
    //     _partialIncomeHeads.push({
    //       id: action.payload.incomeHeads[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialIncomeHeads, state);
    // }
    case IncomeHeadActionTypes.OneIncomeHeadDeleted:
      return adapter.removeOne(action.payload.id, state);
    case IncomeHeadActionTypes.ManyIncomeHeadsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case IncomeHeadActionTypes.IncomeHeadsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case IncomeHeadActionTypes.IncomeHeadsPageLoaded: {
      return adapter.addMany(action.payload.incomeHeads, {
        ...initialIncomeHeadsState,
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

export const getIncomeHeadState = createFeatureSelector<IncomeHeadModel>('incomeHeads');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
