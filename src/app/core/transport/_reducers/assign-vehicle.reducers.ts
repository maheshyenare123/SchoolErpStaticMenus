// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AssignVehicleActions, AssignVehicleActionTypes } from '../_actions/assign-vehicle.actions';
// Models
import { AssignVehicleModel } from '../_models/assign-vehicle.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AssignVehiclesState extends EntityState<AssignVehicleModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAssignVehicleId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AssignVehicleModel> = createEntityAdapter<AssignVehicleModel>();

export const initialAssignVehiclesState: AssignVehiclesState = adapter.getInitialState({
  assignVehicleForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAssignVehicleId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function assignVehiclesReducer(state = initialAssignVehiclesState, action: AssignVehicleActions): AssignVehiclesState {
  switch (action.type) {
    case AssignVehicleActionTypes.AssignVehiclesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAssignVehicleId: undefined
      };
    }
    case AssignVehicleActionTypes.AssignVehicleActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AssignVehicleActionTypes.AssignVehicleOnServerCreated:
      return {
        ...state
      };
    case AssignVehicleActionTypes.AssignVehicleCreated:
      return adapter.addOne(action.payload.assignVehicle, {
        ...state, lastCreatedAssignVehicleId: action.payload.assignVehicle.id
      });
    case AssignVehicleActionTypes.AssignVehicleUpdated:
      return adapter.updateOne(action.payload.partialAssignVehicle, state);
    // case AssignVehicleActionTypes.AssignVehiclesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAssignVehicles: Update<AssignVehicleModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.assignVehicles.length; i++) {
    //     _partialAssignVehicles.push({
    //       id: action.payload.assignVehicles[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAssignVehicles, state);
    // }
    case AssignVehicleActionTypes.OneAssignVehicleDeleted:
      return adapter.removeOne(action.payload.payloadItem, state);
    case AssignVehicleActionTypes.ManyAssignVehiclesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AssignVehicleActionTypes.AssignVehiclesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AssignVehicleActionTypes.AssignVehiclesPageLoaded: {
      return adapter.addMany(action.payload.assignVehicles, {
        ...initialAssignVehiclesState,
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

export const getAssignVehicleState = createFeatureSelector<AssignVehicleModel>('assignVehicles');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
