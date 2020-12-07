// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { FeesTypeActions, FeesTypeActionTypes } from '../_actions/fees-type.actions';
// Models
import { FeesTypeModel } from '../_models/fees-type.model';
import { QueryParamsModel } from '../../_base/crud';

export interface FeesTypesState extends EntityState<FeesTypeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedFeesTypeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<FeesTypeModel> = createEntityAdapter<FeesTypeModel>();

export const initialFeesTypesState: FeesTypesState = adapter.getInitialState({
  feesTypeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedFeesTypeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function feesTypesReducer(state = initialFeesTypesState, action: FeesTypeActions): FeesTypesState {
  switch (action.type) {
    case FeesTypeActionTypes.FeesTypesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedFeesTypeId: undefined
      };
    }
    case FeesTypeActionTypes.FeesTypeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case FeesTypeActionTypes.FeesTypeOnServerCreated:
      return {
        ...state
      };
    case FeesTypeActionTypes.FeesTypeCreated:
      return adapter.addOne(action.payload.feesType, {
        ...state, lastCreatedFeesTypeId: action.payload.feesType.id
      });
    case FeesTypeActionTypes.FeesTypeUpdated:
      return adapter.updateOne(action.payload.partialFeesType, state);
    // case FeesTypeActionTypes.FeesTypesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialFeesTypes: Update<FeesTypeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.feesTypes.length; i++) {
    //     _partialFeesTypes.push({
    //       id: action.payload.feesTypes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialFeesTypes, state);
    // }
    case FeesTypeActionTypes.OneFeesTypeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case FeesTypeActionTypes.ManyFeesTypesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case FeesTypeActionTypes.FeesTypesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case FeesTypeActionTypes.FeesTypesPageLoaded: {
      return adapter.addMany(action.payload.feesTypes, {
        ...initialFeesTypesState,
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

export const getFeesTypeState = createFeatureSelector<FeesTypeModel>('feesTypes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
