// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { LibraryStudentMembersState } from '../_reducers/library-student-member.reducers';
import { LibraryStudentMemberModel } from '../_models/library-student-member.model';

export const selectLibraryStudentMembersState = createFeatureSelector<LibraryStudentMembersState>('libraryStudentMembers');

export const selectLibraryStudentMemberById = (libraryStudentMemberId: number) => createSelector(
    selectLibraryStudentMembersState,
    libraryStudentMembersState => libraryStudentMembersState.entities[libraryStudentMemberId]
);

export const selectLibraryStudentMembersPageLoading = createSelector(
    selectLibraryStudentMembersState,
    libraryStudentMembersState => libraryStudentMembersState.listLoading
);

export const selectLibraryStudentMembersActionLoading = createSelector(
    selectLibraryStudentMembersState,
    libraryStudentMembersState => libraryStudentMembersState.actionsloading
);

export const selectLastCreatedLibraryStudentMemberId = createSelector(
    selectLibraryStudentMembersState,
    libraryStudentMembersState => libraryStudentMembersState.lastCreatedLibraryStudentMemberId
);

export const selectLibraryStudentMembersShowInitWaitingMessage = createSelector(
    selectLibraryStudentMembersState,
    libraryStudentMembersState => libraryStudentMembersState.showInitWaitingMessage
);

export const selectLibraryStudentMembersInStore = createSelector(
    selectLibraryStudentMembersState,
    libraryStudentMembersState => {
      const items: LibraryStudentMemberModel[] = [];
      each(libraryStudentMembersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: LibraryStudentMemberModel[] =
        httpExtension.sortArray(items, libraryStudentMembersState.lastQuery.sortField, libraryStudentMembersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, libraryStudentMembersState.totalCount, '');
    }
);
