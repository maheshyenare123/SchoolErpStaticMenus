// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { RouteActions, RouteActionTypes } from '../_actions/route.actions';
// Models
import { RouteModel } from '../_models/route.model';
import { QueryParamsModel } from '../../_base/crud';

export interface RoutesState extends EntityState<RouteModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedRouteId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<RouteModel> = createEntityAdapter<RouteModel>();

export const initialRoutesState: RoutesState = adapter.getInitialState({
  routeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedRouteId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function routesReducer(state = initialRoutesState, action: RouteActions): RoutesState {
  switch (action.type) {
    case RouteActionTypes.RoutesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedRouteId: undefined
      };
    }
    case RouteActionTypes.RouteActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case RouteActionTypes.RouteOnServerCreated:
      return {
        ...state
      };
    case RouteActionTypes.RouteCreated:
      return adapter.addOne(action.payload.route, {
        ...state, lastCreatedRouteId: action.payload.route.id
      });
    case RouteActionTypes.RouteUpdated:
      return adapter.updateOne(action.payload.partialRoute, state);
    // case RouteActionTypes.RoutesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialRoutes: Update<RouteModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.routes.length; i++) {
    //     _partialRoutes.push({
    //       id: action.payload.routes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialRoutes, state);
    // }
    case RouteActionTypes.OneRouteDeleted:
      return adapter.removeOne(action.payload.id, state);
    case RouteActionTypes.ManyRoutesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case RouteActionTypes.RoutesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case RouteActionTypes.RoutesPageLoaded: {
      return adapter.addMany(action.payload.routes, {
        ...initialRoutesState,
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

export const getRouteState = createFeatureSelector<RouteModel>('routes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
