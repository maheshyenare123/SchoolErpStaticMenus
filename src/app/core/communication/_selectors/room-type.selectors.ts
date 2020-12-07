// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { RoomTypesState } from '../_reducers/room-type.reducers';
import { RoomTypeModel } from '../_models/room-type.model';

export const selectRoomTypesState = createFeatureSelector<RoomTypesState>('roomTypes');

export const selectRoomTypeById = (roomTypeId: number) => createSelector(
    selectRoomTypesState,
    roomTypesState => roomTypesState.entities[roomTypeId]
);

export const selectRoomTypesPageLoading = createSelector(
    selectRoomTypesState,
    roomTypesState => roomTypesState.listLoading
);

export const selectRoomTypesActionLoading = createSelector(
    selectRoomTypesState,
    roomTypesState => roomTypesState.actionsloading
);

export const selectLastCreatedRoomTypeId = createSelector(
    selectRoomTypesState,
    roomTypesState => roomTypesState.lastCreatedRoomTypeId
);

export const selectRoomTypesShowInitWaitingMessage = createSelector(
    selectRoomTypesState,
    roomTypesState => roomTypesState.showInitWaitingMessage
);

export const selectRoomTypesInStore = createSelector(
    selectRoomTypesState,
    roomTypesState => {
      const items: RoomTypeModel[] = [];
      each(roomTypesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: RoomTypeModel[] =
        httpExtension.sortArray(items, roomTypesState.lastQuery.sortField, roomTypesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, roomTypesState.totalCount, '');
    }
);
