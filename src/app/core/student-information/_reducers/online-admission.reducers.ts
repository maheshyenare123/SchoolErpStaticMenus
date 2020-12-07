// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { OnlineAdmissionActions, OnlineAdmissionActionTypes } from '../_actions/online-admission.actions';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface OnlineAdmissionsState extends EntityState<StudentDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedOnlineAdmissionId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentDtoModel> = createEntityAdapter<StudentDtoModel>();

export const initialOnlineAdmissionsState: OnlineAdmissionsState = adapter.getInitialState({
  onlineAdmissionForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedOnlineAdmissionId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function onlineAdmissionsReducer(state = initialOnlineAdmissionsState, action: OnlineAdmissionActions): OnlineAdmissionsState {
  switch (action.type) {
    case OnlineAdmissionActionTypes.OnlineAdmissionsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedOnlineAdmissionId: undefined
      };
    }
    case OnlineAdmissionActionTypes.OnlineAdmissionActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case OnlineAdmissionActionTypes.OnlineAdmissionOnServerCreated:
      return {
        ...state
      };
    case OnlineAdmissionActionTypes.OnlineAdmissionCreated:
      return adapter.addOne(action.payload.onlineAdmission, {
        ...state, lastCreatedOnlineAdmissionId: action.payload.onlineAdmission.id
      });
    case OnlineAdmissionActionTypes.OnlineAdmissionUpdated:
      return adapter.updateOne(action.payload.partialOnlineAdmission, state);
    // case OnlineAdmissionActionTypes.OnlineAdmissionsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialOnlineAdmissions: Update<StudentDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.onlineAdmissions.length; i++) {
    //     _partialOnlineAdmissions.push({
    //       id: action.payload.onlineAdmissions[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialOnlineAdmissions, state);
    // }
    case OnlineAdmissionActionTypes.OneOnlineAdmissionDeleted:
      return adapter.removeOne(action.payload.id, state);
    case OnlineAdmissionActionTypes.ManyOnlineAdmissionsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case OnlineAdmissionActionTypes.OnlineAdmissionsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case OnlineAdmissionActionTypes.OnlineAdmissionsPageLoaded: {
      return adapter.addMany(action.payload.onlineAdmissions, {
        ...initialOnlineAdmissionsState,
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

export const getOnlineAdmissionState = createFeatureSelector<StudentDtoModel>('onlineAdmissions');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
