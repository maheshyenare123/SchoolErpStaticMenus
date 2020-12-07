// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { SourceActions, SourceActionTypes } from '../_actions/source.actions';
// Models
import { SourceModel } from '../_models/source.model';
import { QueryParamsModel } from '../../_base/crud';

export interface SourcesState extends EntityState<SourceModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedSourceId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SourceModel> = createEntityAdapter<SourceModel>();

export const initialSourcesState: SourcesState = adapter.getInitialState({
  sourceForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedSourceId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function sourcesReducer(state = initialSourcesState, action: SourceActions): SourcesState {
  switch (action.type) {
    case SourceActionTypes.SourcesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedSourceId: undefined
      };
    }
    case SourceActionTypes.SourceActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case SourceActionTypes.SourceOnServerCreated:
      return {
        ...state
      };
    case SourceActionTypes.SourceCreated:
      return adapter.addOne(action.payload.source, {
        ...state, lastCreatedSourceId: action.payload.source.id
      });
    case SourceActionTypes.SourceUpdated:
      return adapter.updateOne(action.payload.partialSource, state);
    // case SourceActionTypes.SourcesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialSources: Update<SourceModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.sources.length; i++) {
    //     _partialSources.push({
    //       id: action.payload.sources[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialSources, state);
    // }
    case SourceActionTypes.OneSourceDeleted:
      return adapter.removeOne(action.payload.id, state);
    case SourceActionTypes.ManySourcesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case SourceActionTypes.SourcesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case SourceActionTypes.SourcesPageLoaded: {
      return adapter.addMany(action.payload.sources, {
        ...initialSourcesState,
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

export const getSourceState = createFeatureSelector<SourceModel>('sources');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
