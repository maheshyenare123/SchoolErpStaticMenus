// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ExpenseActions, ExpenseActionTypes } from '../_actions/expense.actions';
// Models
import { ExpenseModel } from '../_models/expense.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ExpensesState extends EntityState<ExpenseModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedExpenseId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExpenseModel> = createEntityAdapter<ExpenseModel>();

export const initialExpensesState: ExpensesState = adapter.getInitialState({
  expenseForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedExpenseId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function expensesReducer(state = initialExpensesState, action: ExpenseActions): ExpensesState {
  switch (action.type) {
    case ExpenseActionTypes.ExpensesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedExpenseId: undefined
      };
    }
    case ExpenseActionTypes.ExpenseActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ExpenseActionTypes.ExpenseOnServerCreated:
      return {
        ...state
      };
    case ExpenseActionTypes.ExpenseCreated:
      return adapter.addOne(action.payload.expense, {
        ...state, lastCreatedExpenseId: action.payload.expense.id
      });
    case ExpenseActionTypes.ExpenseUpdated:
      return adapter.updateOne(action.payload.partialExpense, state);
    // case ExpenseActionTypes.ExpensesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialExpenses: Update<ExpenseModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.expenses.length; i++) {
    //     _partialExpenses.push({
    //       id: action.payload.expenses[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialExpenses, state);
    // }
    case ExpenseActionTypes.OneExpenseDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ExpenseActionTypes.ManyExpensesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ExpenseActionTypes.ExpensesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ExpenseActionTypes.ExpensesPageLoaded: {
      return adapter.addMany(action.payload.expenses, {
        ...initialExpensesState,
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

export const getExpenseState = createFeatureSelector<ExpenseModel>('expenses');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
