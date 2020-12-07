// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentHouseActions, StudentHouseActionTypes } from '../_actions/student-house.actions';
// Models
import { SchoolHousModel } from '../_models/schoolHous.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentHousesState extends EntityState<SchoolHousModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentHouseId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SchoolHousModel> = createEntityAdapter<SchoolHousModel>();

export const initialStudentHousesState: StudentHousesState = adapter.getInitialState({
  studentHouseForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentHouseId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentHousesReducer(state = initialStudentHousesState, action: StudentHouseActions): StudentHousesState {
  switch (action.type) {
    case StudentHouseActionTypes.StudentHousesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentHouseId: undefined
      };
    }
    case StudentHouseActionTypes.StudentHouseActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentHouseActionTypes.StudentHouseOnServerCreated:
      return {
        ...state
      };
    case StudentHouseActionTypes.StudentHouseCreated:
      return adapter.addOne(action.payload.studentHouse, {
        ...state, lastCreatedStudentHouseId: action.payload.studentHouse.id
      });
    case StudentHouseActionTypes.StudentHouseUpdated:
      return adapter.updateOne(action.payload.partialStudentHouse, state);
    // case StudentHouseActionTypes.StudentHousesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStudentHouses: Update<SchoolHousModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.studentHouses.length; i++) {
    //     _partialStudentHouses.push({
    //       id: action.payload.studentHouses[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStudentHouses, state);
    // }
    case StudentHouseActionTypes.OneStudentHouseDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentHouseActionTypes.ManyStudentHousesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentHouseActionTypes.StudentHousesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentHouseActionTypes.StudentHousesPageLoaded: {
      return adapter.addMany(action.payload.studentHouses, {
        ...initialStudentHousesState,
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

export const getStudentHouseState = createFeatureSelector<SchoolHousModel>('studentHouses');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
