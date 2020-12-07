// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { HostelActions, HostelActionTypes } from '../_actions/hostel.actions';
// Models
import { HostelModel } from '../_models/hostel.model';
import { QueryParamsModel } from '../../_base/crud';

export interface HostelsState extends EntityState<HostelModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedHostelId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<HostelModel> = createEntityAdapter<HostelModel>();

export const initialHostelsState: HostelsState = adapter.getInitialState({
  hostelForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedHostelId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function hostelsReducer(state = initialHostelsState, action: HostelActions): HostelsState {
  switch (action.type) {
    case HostelActionTypes.HostelsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedHostelId: undefined
      };
    }
    case HostelActionTypes.HostelActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case HostelActionTypes.HostelOnServerCreated:
      return {
        ...state
      };
    case HostelActionTypes.HostelCreated:
      return adapter.addOne(action.payload.hostel, {
        ...state, lastCreatedHostelId: action.payload.hostel.id
      });
    case HostelActionTypes.HostelUpdated:
      return adapter.updateOne(action.payload.partialHostel, state);
    // case HostelActionTypes.HostelsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialHostels: Update<HostelModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.hostels.length; i++) {
    //     _partialHostels.push({
    //       id: action.payload.hostels[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialHostels, state);
    // }
    case HostelActionTypes.OneHostelDeleted:
      return adapter.removeOne(action.payload.id, state);
    case HostelActionTypes.ManyHostelsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case HostelActionTypes.HostelsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case HostelActionTypes.HostelsPageLoaded: {
      return adapter.addMany(action.payload.hostels, {
        ...initialHostelsState,
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

export const getHostelState = createFeatureSelector<HostelModel>('hostels');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
