// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { LibraryMemberListActions, LibraryMemberListActionTypes } from '../_actions/library-member-list.actions';
// Models
import { LibraryMemberListModel } from '../_models/library-member-list.model';
import { QueryParamsModel } from '../../_base/crud';

export interface LibraryMemberListsState extends EntityState<LibraryMemberListModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedLibraryMemberListId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<LibraryMemberListModel> = createEntityAdapter<LibraryMemberListModel>();

export const initialLibraryMemberListsState: LibraryMemberListsState = adapter.getInitialState({
  libraryMemberListForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedLibraryMemberListId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function libraryMemberListsReducer(state = initialLibraryMemberListsState, action: LibraryMemberListActions): LibraryMemberListsState {
  switch (action.type) {
    case LibraryMemberListActionTypes.LibraryMemberListsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedLibraryMemberListId: undefined
      };
    }
    case LibraryMemberListActionTypes.LibraryMemberListActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case LibraryMemberListActionTypes.LibraryMemberListOnServerCreated:
      return {
        ...state
      };
    case LibraryMemberListActionTypes.LibraryMemberListCreated:
      return adapter.addOne(action.payload.libraryMemberList, {
        ...state, lastCreatedLibraryMemberListId: action.payload.libraryMemberList.memberId
      });
    case LibraryMemberListActionTypes.LibraryMemberListUpdated:
      return adapter.updateOne(action.payload.partialLibraryMemberList, state);
    // case LibraryMemberListActionTypes.LibraryMemberListsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialLibraryMemberLists: Update<LibraryMemberListModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.libraryMemberLists.length; i++) {
    //     _partialLibraryMemberLists.push({
    //       id: action.payload.libraryMemberLists[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialLibraryMemberLists, state);
    // }
    case LibraryMemberListActionTypes.OneLibraryMemberListDeleted:
      return adapter.removeOne(action.payload.id, state);
    case LibraryMemberListActionTypes.ManyLibraryMemberListsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case LibraryMemberListActionTypes.LibraryMemberListsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case LibraryMemberListActionTypes.LibraryMemberListsPageLoaded: {
      return adapter.addMany(action.payload.libraryMemberLists, {
        ...initialLibraryMemberListsState,
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

export const getLibraryMemberListState = createFeatureSelector<LibraryMemberListModel>('libraryMemberLists');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
