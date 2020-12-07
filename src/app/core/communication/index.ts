
//models

export {HostelModel} from './_models/hostel.model';
export {NoticeBoardModel} from './_models/notice-board.model';
export {RoomTypeModel} from './_models/room-type.model';


//datasource

export {HostelsDataSource} from './_data-sources/hostel.datasource';
export {NoticeBoardsDataSource} from './_data-sources/notice-board.datasource';
export {RoomTypesDataSource} from './_data-sources/room-type.datasource';

// Effects

export { HostelEffects } from './_effects/hostel.effects';
export { NoticeBoardEffects } from './_effects/notice-board.effects';
export { RoomTypeEffects } from './_effects/room-type.effects';


// Actions
// Customer Actions =>

export {
    HostelActionToggleLoading,
    HostelActionTypes,
    HostelActions,
    HostelCreated,
    HostelOnServerCreated,
    HostelUpdated,
    HostelsPageCancelled,
    HostelsPageLoaded,
    HostelsPageRequested,
    HostelsPageToggleLoading,
    HostelsStatusUpdated,
     ManyHostelsDeleted,
     OneHostelDeleted
 } from './_actions/hostel.actions';
 export {
 NoticeBoardActionToggleLoading,
 NoticeBoardActionTypes,
 NoticeBoardActions,
 NoticeBoardCreated,
 NoticeBoardOnServerCreated,
 NoticeBoardUpdated,
 NoticeBoardsPageCancelled,
 NoticeBoardsPageLoaded,
 NoticeBoardsPageRequested,
 NoticeBoardsPageToggleLoading,
 NoticeBoardsStatusUpdated,
  ManyNoticeBoardsDeleted,
  OneNoticeBoardDeleted
} from './_actions/notice-board.actions';
export {
RoomTypeActionToggleLoading,
RoomTypeActionTypes,
RoomTypeActions,
RoomTypeCreated,
RoomTypeOnServerCreated,
RoomTypeUpdated,
RoomTypesPageCancelled,
RoomTypesPageLoaded,
RoomTypesPageRequested,
RoomTypesPageToggleLoading,
RoomTypesStatusUpdated,
 ManyRoomTypesDeleted,
 OneRoomTypeDeleted
} from './_actions/room-type.actions';

// Reducers

export {hostelsReducer } from './_reducers/hostel.reducers';
export {noticeBoardsReducer } from './_reducers/notice-board.reducers';
export {roomTypesReducer } from './_reducers/room-type.reducers';
// Selectors

export {
    selectHostelById,
    selectHostelsActionLoading,
    selectHostelsInStore,
    selectHostelsPageLoading,
    selectHostelsShowInitWaitingMessage,
    selectHostelsState,
    selectLastCreatedHostelId
} from './_selectors/hostel.selectors';

export {
    selectNoticeBoardById,
    selectNoticeBoardsActionLoading,
    selectNoticeBoardsInStore,
    selectNoticeBoardsPageLoading,
    selectNoticeBoardsShowInitWaitingMessage,
    selectNoticeBoardsState,
    selectLastCreatedNoticeBoardId
} from './_selectors/notice-board.selectors';

export {
    selectRoomTypeById,
    selectRoomTypesActionLoading,
    selectRoomTypesInStore,
    selectRoomTypesPageLoading,
    selectRoomTypesShowInitWaitingMessage,
    selectRoomTypesState,
    selectLastCreatedRoomTypeId
} from './_selectors/room-type.selectors';

// Services

export {HostelService } from './_services/hostel.service';
export {NoticeBoardService } from './_services/notice-board.service';
export {RoomTypeService } from './_services/room-type.service';

