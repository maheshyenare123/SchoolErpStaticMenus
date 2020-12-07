// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { LibraryMemberListsState } from '../_reducers/library-member-list.reducers';
import { LibraryMemberListModel } from '../_models/library-member-list.model';

export const selectLibraryMemberListsState = createFeatureSelector<LibraryMemberListsState>('libraryMemberLists');

export const selectLibraryMemberListById = (libraryMemberListId: number) => createSelector(
    selectLibraryMemberListsState,
    libraryMemberListsState => libraryMemberListsState.entities[libraryMemberListId]
);

export const selectLibraryMemberListsPageLoading = createSelector(
    selectLibraryMemberListsState,
    libraryMemberListsState => libraryMemberListsState.listLoading
);

export const selectLibraryMemberListsActionLoading = createSelector(
    selectLibraryMemberListsState,
    libraryMemberListsState => libraryMemberListsState.actionsloading
);

export const selectLastCreatedLibraryMemberListId = createSelector(
    selectLibraryMemberListsState,
    libraryMemberListsState => libraryMemberListsState.lastCreatedLibraryMemberListId
);

export const selectLibraryMemberListsShowInitWaitingMessage = createSelector(
    selectLibraryMemberListsState,
    libraryMemberListsState => libraryMemberListsState.showInitWaitingMessage
);

export const selectLibraryMemberListsInStore = createSelector(
    selectLibraryMemberListsState,
    libraryMemberListsState => {
      const items: LibraryMemberListModel[] = [];
      each(libraryMemberListsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: LibraryMemberListModel[] =
        httpExtension.sortArray(items, libraryMemberListsState.lastQuery.sortField, libraryMemberListsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, libraryMemberListsState.totalCount, '');
    }
);
