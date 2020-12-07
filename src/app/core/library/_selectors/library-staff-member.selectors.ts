// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { LibraryStaffMembersState } from '../_reducers/library-staff-member.reducers';
import { LibraryStaffMemberModel } from '../_models/library-staff-member.model';

export const selectLibraryStaffMembersState = createFeatureSelector<LibraryStaffMembersState>('libraryStaffMembers');

export const selectLibraryStaffMemberById = (libraryStaffMemberId: number) => createSelector(
    selectLibraryStaffMembersState,
    libraryStaffMembersState => libraryStaffMembersState.entities[libraryStaffMemberId]
);

export const selectLibraryStaffMembersPageLoading = createSelector(
    selectLibraryStaffMembersState,
    libraryStaffMembersState => libraryStaffMembersState.listLoading
);

export const selectLibraryStaffMembersActionLoading = createSelector(
    selectLibraryStaffMembersState,
    libraryStaffMembersState => libraryStaffMembersState.actionsloading
);

export const selectLastCreatedLibraryStaffMemberId = createSelector(
    selectLibraryStaffMembersState,
    libraryStaffMembersState => libraryStaffMembersState.lastCreatedLibraryStaffMemberId
);

export const selectLibraryStaffMembersShowInitWaitingMessage = createSelector(
    selectLibraryStaffMembersState,
    libraryStaffMembersState => libraryStaffMembersState.showInitWaitingMessage
);

export const selectLibraryStaffMembersInStore = createSelector(
    selectLibraryStaffMembersState,
    libraryStaffMembersState => {
      const items: LibraryStaffMemberModel[] = [];
      each(libraryStaffMembersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: LibraryStaffMemberModel[] =
        httpExtension.sortArray(items, libraryStaffMembersState.lastQuery.sortField, libraryStaffMembersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, libraryStaffMembersState.totalCount, '');
    }
);
