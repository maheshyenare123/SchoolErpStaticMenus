// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ExpenseHeadActions, ExpenseHeadActionTypes } from '../_actions/expense-head.actions';
// Models
import { ExpenseHeadModel } from '../_models/expense-head.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ExpenseHeadsState extends EntityState<ExpenseHeadModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedExpenseHeadId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExpenseHeadModel> = createEntityAdapter<ExpenseHeadModel>();

export const initialExpenseHeadsState: ExpenseHeadsState = adapter.getInitialState({
  expenseHeadForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedExpenseHeadId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function expenseHeadsReducer(state = initialExpenseHeadsState, action: ExpenseHeadActions): ExpenseHeadsState {
  switch (action.type) {
    case ExpenseHeadActionTypes.ExpenseHeadsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedExpenseHeadId: undefined
      };
    }
    case ExpenseHeadActionTypes.ExpenseHeadActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ExpenseHeadActionTypes.ExpenseHeadOnServerCreated:
      return {
        ...state
      };
    case ExpenseHeadActionTypes.ExpenseHeadCreated:
      return adapter.addOne(action.payload.expenseHead, {
        ...state, lastCreatedExpenseHeadId: action.payload.expenseHead.id
      });
    case ExpenseHeadActionTypes.ExpenseHeadUpdated:
      return adapter.updateOne(action.payload.partialExpenseHead, state);
    // case ExpenseHeadActionTypes.ExpenseHeadsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialExpenseHeads: Update<ExpenseHeadModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.expenseHeads.length; i++) {
    //     _partialExpenseHeads.push({
    //       id: action.payload.expenseHeads[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialExpenseHeads, state);
    // }
    case ExpenseHeadActionTypes.OneExpenseHeadDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ExpenseHeadActionTypes.ManyExpenseHeadsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ExpenseHeadActionTypes.ExpenseHeadsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ExpenseHeadActionTypes.ExpenseHeadsPageLoaded: {
      return adapter.addMany(action.payload.expenseHeads, {
        ...initialExpenseHeadsState,
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

export const getExpenseHeadState = createFeatureSelector<ExpenseHeadModel>('expenseHeads');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
