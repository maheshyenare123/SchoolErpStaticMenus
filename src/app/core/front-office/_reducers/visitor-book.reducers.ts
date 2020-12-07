// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { VisitorBookActions, VisitorBookActionTypes } from '../_actions/visitor-book.actions';
// Models
import { VisitorBookModel } from '../_models/visitor-book.model';
import { QueryParamsModel } from '../../_base/crud';

export interface VisitorBooksState extends EntityState<VisitorBookModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedVisitorBookId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<VisitorBookModel> = createEntityAdapter<VisitorBookModel>();

export const initialVisitorBooksState: VisitorBooksState = adapter.getInitialState({
  visitorBookForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedVisitorBookId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function visitorBooksReducer(state = initialVisitorBooksState, action: VisitorBookActions): VisitorBooksState {
  switch (action.type) {
    case VisitorBookActionTypes.VisitorBooksPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedVisitorBookId: undefined
      };
    }
    case VisitorBookActionTypes.VisitorBookActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case VisitorBookActionTypes.VisitorBookOnServerCreated:
      return {
        ...state
      };
    case VisitorBookActionTypes.VisitorBookCreated:
      return adapter.addOne(action.payload.visitorBook, {
        ...state, lastCreatedVisitorBookId: action.payload.visitorBook.id
      });
    case VisitorBookActionTypes.VisitorBookUpdated:
      return adapter.updateOne(action.payload.partialVisitorBook, state);
    // case VisitorBookActionTypes.VisitorBooksStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialVisitorBooks: Update<VisitorBookModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.visitorBooks.length; i++) {
    //     _partialVisitorBooks.push({
    //       id: action.payload.visitorBooks[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialVisitorBooks, state);
    // }
    case VisitorBookActionTypes.OneVisitorBookDeleted:
      return adapter.removeOne(action.payload.id, state);
    case VisitorBookActionTypes.ManyVisitorBooksDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case VisitorBookActionTypes.VisitorBooksPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case VisitorBookActionTypes.VisitorBooksPageLoaded: {
      return adapter.addMany(action.payload.visitorBooks, {
        ...initialVisitorBooksState,
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

export const getVisitorBookState = createFeatureSelector<VisitorBookModel>('visitorBooks');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
