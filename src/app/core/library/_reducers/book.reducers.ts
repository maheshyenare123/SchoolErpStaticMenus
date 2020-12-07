// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { BookActions, BookActionTypes } from '../_actions/book.actions';
// Models
import { BookModel } from '../_models/book.model';
import { QueryParamsModel } from '../../_base/crud';

export interface BooksState extends EntityState<BookModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedBookId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<BookModel> = createEntityAdapter<BookModel>();

export const initialBooksState: BooksState = adapter.getInitialState({
  bookForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedBookId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function booksReducer(state = initialBooksState, action: BookActions): BooksState {
  switch (action.type) {
    case BookActionTypes.BooksPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedBookId: undefined
      };
    }
    case BookActionTypes.BookActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case BookActionTypes.BookOnServerCreated:
      return {
        ...state
      };
    case BookActionTypes.BookCreated:
      return adapter.addOne(action.payload.book, {
        ...state, lastCreatedBookId: action.payload.book.id
      });
    case BookActionTypes.BookUpdated:
      return adapter.updateOne(action.payload.partialBook, state);
    // case BookActionTypes.BooksStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialBooks: Update<BookModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.books.length; i++) {
    //     _partialBooks.push({
    //       id: action.payload.books[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialBooks, state);
    // }
    case BookActionTypes.OneBookDeleted:
      return adapter.removeOne(action.payload.id, state);
    case BookActionTypes.ManyBooksDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case BookActionTypes.BooksPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case BookActionTypes.BooksPageLoaded: {
      return adapter.addMany(action.payload.books, {
        ...initialBooksState,
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

export const getBookState = createFeatureSelector<BookModel>('books');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
