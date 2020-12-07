// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { HostelRoomsState } from '../_reducers/hostel-room.reducers';
import { HostelRoomModel } from '../_models/hostel-room.model';

export const selectHostelRoomsState = createFeatureSelector<HostelRoomsState>('hostelRooms');

export const selectHostelRoomById = (hostelRoomId: number) => createSelector(
    selectHostelRoomsState,
    hostelRoomsState => hostelRoomsState.entities[hostelRoomId]
);

export const selectHostelRoomsPageLoading = createSelector(
    selectHostelRoomsState,
    hostelRoomsState => hostelRoomsState.listLoading
);

export const selectHostelRoomsActionLoading = createSelector(
    selectHostelRoomsState,
    hostelRoomsState => hostelRoomsState.actionsloading
);

export const selectLastCreatedHostelRoomId = createSelector(
    selectHostelRoomsState,
    hostelRoomsState => hostelRoomsState.lastCreatedHostelRoomId
);

export const selectHostelRoomsShowInitWaitingMessage = createSelector(
    selectHostelRoomsState,
    hostelRoomsState => hostelRoomsState.showInitWaitingMessage
);

export const selectHostelRoomsInStore = createSelector(
    selectHostelRoomsState,
    hostelRoomsState => {
      const items: HostelRoomModel[] = [];
      each(hostelRoomsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: HostelRoomModel[] =
        httpExtension.sortArray(items, hostelRoomsState.lastQuery.sortField, hostelRoomsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, hostelRoomsState.totalCount, '');
    }
);
