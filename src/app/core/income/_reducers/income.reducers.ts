// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { IncomeActions, IncomeActionTypes } from '../_actions/income.actions';
// Models
import { IncomeModel } from '../_models/income.model';
import { QueryParamsModel } from '../../_base/crud';

export interface IncomesState extends EntityState<IncomeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedIncomeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<IncomeModel> = createEntityAdapter<IncomeModel>();

export const initialIncomesState: IncomesState = adapter.getInitialState({
  incomeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedIncomeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function incomesReducer(state = initialIncomesState, action: IncomeActions): IncomesState {
  switch (action.type) {
    case IncomeActionTypes.IncomesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedIncomeId: undefined
      };
    }
    case IncomeActionTypes.IncomeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case IncomeActionTypes.IncomeOnServerCreated:
      return {
        ...state
      };
    case IncomeActionTypes.IncomeCreated:
      return adapter.addOne(action.payload.income, {
        ...state, lastCreatedIncomeId: action.payload.income.id
      });
    case IncomeActionTypes.IncomeUpdated:
      return adapter.updateOne(action.payload.partialIncome, state);
    // case IncomeActionTypes.IncomesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialIncomes: Update<IncomeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.incomes.length; i++) {
    //     _partialIncomes.push({
    //       id: action.payload.incomes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialIncomes, state);
    // }
    case IncomeActionTypes.OneIncomeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case IncomeActionTypes.ManyIncomesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case IncomeActionTypes.IncomesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case IncomeActionTypes.IncomesPageLoaded: {
      return adapter.addMany(action.payload.incomes, {
        ...initialIncomesState,
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

export const getIncomeState = createFeatureSelector<IncomeModel>('incomes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
