// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { HostelRoomActions, HostelRoomActionTypes } from '../_actions/hostel-room.actions';
// Models
import { HostelRoomModel } from '../_models/hostel-room.model';
import { QueryParamsModel } from '../../_base/crud';

export interface HostelRoomsState extends EntityState<HostelRoomModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedHostelRoomId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<HostelRoomModel> = createEntityAdapter<HostelRoomModel>();

export const initialHostelRoomsState: HostelRoomsState = adapter.getInitialState({
  hostelRoomForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedHostelRoomId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function hostelRoomsReducer(state = initialHostelRoomsState, action: HostelRoomActions): HostelRoomsState {
  switch (action.type) {
    case HostelRoomActionTypes.HostelRoomsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedHostelRoomId: undefined
      };
    }
    case HostelRoomActionTypes.HostelRoomActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case HostelRoomActionTypes.HostelRoomOnServerCreated:
      return {
        ...state
      };
    case HostelRoomActionTypes.HostelRoomCreated:
      return adapter.addOne(action.payload.hostelRoom, {
        ...state, lastCreatedHostelRoomId: action.payload.hostelRoom.id
      });
    case HostelRoomActionTypes.HostelRoomUpdated:
      return adapter.updateOne(action.payload.partialHostelRoom, state);
    // case HostelRoomActionTypes.HostelRoomsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialHostelRooms: Update<HostelRoomModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.hostelRooms.length; i++) {
    //     _partialHostelRooms.push({
    //       id: action.payload.hostelRooms[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialHostelRooms, state);
    // }
    case HostelRoomActionTypes.OneHostelRoomDeleted:
      return adapter.removeOne(action.payload.id, state);
    case HostelRoomActionTypes.ManyHostelRoomsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case HostelRoomActionTypes.HostelRoomsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case HostelRoomActionTypes.HostelRoomsPageLoaded: {
      return adapter.addMany(action.payload.hostelRooms, {
        ...initialHostelRoomsState,
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

export const getHostelRoomState = createFeatureSelector<HostelRoomModel>('hostelRooms');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
