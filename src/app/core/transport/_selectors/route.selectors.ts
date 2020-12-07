// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { RoutesState } from '../_reducers/route.reducers';
import { RouteModel } from '../_models/route.model';

export const selectRoutesState = createFeatureSelector<RoutesState>('routes');

export const selectRouteById = (routeId: number) => createSelector(
    selectRoutesState,
    routesState => routesState.entities[routeId]
);

export const selectRoutesPageLoading = createSelector(
    selectRoutesState,
    routesState => routesState.listLoading
);

export const selectRoutesActionLoading = createSelector(
    selectRoutesState,
    routesState => routesState.actionsloading
);

export const selectLastCreatedRouteId = createSelector(
    selectRoutesState,
    routesState => routesState.lastCreatedRouteId
);

export const selectRoutesShowInitWaitingMessage = createSelector(
    selectRoutesState,
    routesState => routesState.showInitWaitingMessage
);

export const selectRoutesInStore = createSelector(
    selectRoutesState,
    routesState => {
      const items: RouteModel[] = [];
      each(routesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: RouteModel[] =
        httpExtension.sortArray(items, routesState.lastQuery.sortField, routesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, routesState.totalCount, '');
    }
);
