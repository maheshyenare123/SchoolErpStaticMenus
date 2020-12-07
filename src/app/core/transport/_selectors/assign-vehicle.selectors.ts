// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AssignVehiclesState } from '../_reducers/assign-vehicle.reducers';
import { AssignVehicleModel } from '../_models/assign-vehicle.model';

export const selectAssignVehiclesState = createFeatureSelector<AssignVehiclesState>('assignVehicles');

export const selectAssignVehicleById = (assignVehicleId: number) => createSelector(
    selectAssignVehiclesState,
    assignVehiclesState => assignVehiclesState.entities[assignVehicleId]
);

export const selectAssignVehiclesPageLoading = createSelector(
    selectAssignVehiclesState,
    assignVehiclesState => assignVehiclesState.listLoading
);

export const selectAssignVehiclesActionLoading = createSelector(
    selectAssignVehiclesState,
    assignVehiclesState => assignVehiclesState.actionsloading
);

export const selectLastCreatedAssignVehicleId = createSelector(
    selectAssignVehiclesState,
    assignVehiclesState => assignVehiclesState.lastCreatedAssignVehicleId
);

export const selectAssignVehiclesShowInitWaitingMessage = createSelector(
    selectAssignVehiclesState,
    assignVehiclesState => assignVehiclesState.showInitWaitingMessage
);

export const selectAssignVehiclesInStore = createSelector(
    selectAssignVehiclesState,
    assignVehiclesState => {
      const items: AssignVehicleModel[] = [];
      each(assignVehiclesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: AssignVehicleModel[] =
        httpExtension.sortArray(items, assignVehiclesState.lastQuery.sortField, assignVehiclesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, assignVehiclesState.totalCount, '');
    }
);
