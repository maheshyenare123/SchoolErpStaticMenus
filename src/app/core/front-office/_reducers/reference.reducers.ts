// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ReferenceActions, ReferenceActionTypes } from '../_actions/reference.actions';
// Models
import { ReferenceModel } from '../_models/reference.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ReferencesState extends EntityState<ReferenceModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedReferenceId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ReferenceModel> = createEntityAdapter<ReferenceModel>();

export const initialReferencesState: ReferencesState = adapter.getInitialState({
  referenceForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedReferenceId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function referencesReducer(state = initialReferencesState, action: ReferenceActions): ReferencesState {
  switch (action.type) {
    case ReferenceActionTypes.ReferencesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedReferenceId: undefined
      };
    }
    case ReferenceActionTypes.ReferenceActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ReferenceActionTypes.ReferenceOnServerCreated:
      return {
        ...state
      };
    case ReferenceActionTypes.ReferenceCreated:
      return adapter.addOne(action.payload.reference, {
        ...state, lastCreatedReferenceId: action.payload.reference.id
      });
    case ReferenceActionTypes.ReferenceUpdated:
      return adapter.updateOne(action.payload.partialReference, state);
    // case ReferenceActionTypes.ReferencesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialReferences: Update<ReferenceModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.references.length; i++) {
    //     _partialReferences.push({
    //       id: action.payload.references[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialReferences, state);
    // }
    case ReferenceActionTypes.OneReferenceDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ReferenceActionTypes.ManyReferencesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ReferenceActionTypes.ReferencesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ReferenceActionTypes.ReferencesPageLoaded: {
      return adapter.addMany(action.payload.references, {
        ...initialReferencesState,
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

export const getReferenceState = createFeatureSelector<ReferenceModel>('references');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
