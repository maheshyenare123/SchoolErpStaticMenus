// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { BookIssueReturnActions, BookIssueReturnActionTypes } from '../_actions/book-issue-retrun.actions';
// Models
import { BookIssueReturnModel } from '../_models/book-issue-return.model';
import { QueryParamsModel } from '../../_base/crud';

export interface BookIssueReturnsState extends EntityState<BookIssueReturnModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedBookIssueReturnId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<BookIssueReturnModel> = createEntityAdapter<BookIssueReturnModel>();

export const initialBookIssueReturnsState: BookIssueReturnsState = adapter.getInitialState({
  bookIssueReturnForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedBookIssueReturnId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function bookIssueReturnsReducer(state = initialBookIssueReturnsState, action: BookIssueReturnActions): BookIssueReturnsState {
  switch (action.type) {
    case BookIssueReturnActionTypes.BookIssueReturnsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedBookIssueReturnId: undefined
      };
    }
    case BookIssueReturnActionTypes.BookIssueReturnActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case BookIssueReturnActionTypes.BookIssueReturnOnServerCreated:
      return {
        ...state
      };
    case BookIssueReturnActionTypes.BookIssueReturnCreated:
      return adapter.addOne(action.payload.bookIssueReturn, {
        ...state, lastCreatedBookIssueReturnId: action.payload.bookIssueReturn.memberId
      });
    case BookIssueReturnActionTypes.BookIssueReturnUpdated:
      return adapter.updateOne(action.payload.partialBookIssueReturn, state);
    // case BookIssueReturnActionTypes.BookIssueReturnsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialBookIssueReturns: Update<BookIssueReturnModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.bookIssueReturns.length; i++) {
    //     _partialBookIssueReturns.push({
    //       id: action.payload.bookIssueReturns[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialBookIssueReturns, state);
    // }
    case BookIssueReturnActionTypes.OneBookIssueReturnDeleted:
      return adapter.removeOne(action.payload.id, state);
    case BookIssueReturnActionTypes.ManyBookIssueReturnsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case BookIssueReturnActionTypes.BookIssueReturnsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case BookIssueReturnActionTypes.BookIssueReturnsPageLoaded: {
      return adapter.addMany(action.payload.bookIssueReturns, {
        ...initialBookIssueReturnsState,
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

export const getBookIssueReturnState = createFeatureSelector<BookIssueReturnModel>('bookIssueReturns');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
