// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { RoomTypeActions, RoomTypeActionTypes } from '../_actions/room-type.actions';
// Models
import { RoomTypeModel } from '../_models/room-type.model';
import { QueryParamsModel } from '../../_base/crud';

export interface RoomTypesState extends EntityState<RoomTypeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedRoomTypeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<RoomTypeModel> = createEntityAdapter<RoomTypeModel>();

export const initialRoomTypesState: RoomTypesState = adapter.getInitialState({
  roomTypeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedRoomTypeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function roomTypesReducer(state = initialRoomTypesState, action: RoomTypeActions): RoomTypesState {
  switch (action.type) {
    case RoomTypeActionTypes.RoomTypesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedRoomTypeId: undefined
      };
    }
    case RoomTypeActionTypes.RoomTypeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case RoomTypeActionTypes.RoomTypeOnServerCreated:
      return {
        ...state
      };
    case RoomTypeActionTypes.RoomTypeCreated:
      return adapter.addOne(action.payload.roomType, {
        ...state, lastCreatedRoomTypeId: action.payload.roomType.id
      });
    case RoomTypeActionTypes.RoomTypeUpdated:
      return adapter.updateOne(action.payload.partialRoomType, state);
    // case RoomTypeActionTypes.RoomTypesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialRoomTypes: Update<RoomTypeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.roomTypes.length; i++) {
    //     _partialRoomTypes.push({
    //       id: action.payload.roomTypes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialRoomTypes, state);
    // }
    case RoomTypeActionTypes.OneRoomTypeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case RoomTypeActionTypes.ManyRoomTypesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case RoomTypeActionTypes.RoomTypesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case RoomTypeActionTypes.RoomTypesPageLoaded: {
      return adapter.addMany(action.payload.roomTypes, {
        ...initialRoomTypesState,
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

export const getRoomTypeState = createFeatureSelector<RoomTypeModel>('roomTypes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
