// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AssignStudentFeemasterActions, AssignStudentFeemasterActionTypes } from '../_actions/assign-student-feemaster.actions';
// Models
import { AssignFeemasterStudentRequestDtoModel } from '../_models/assign-feemaster-student-request-dto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AssignStudentFeemasterssState extends EntityState<AssignFeemasterStudentRequestDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAssignStudentFeemastersId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AssignFeemasterStudentRequestDtoModel> = createEntityAdapter<AssignFeemasterStudentRequestDtoModel>();

export const initialAssignStudentFeemasterssState: AssignStudentFeemasterssState = adapter.getInitialState({
  assignStudentFeemastersForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAssignStudentFeemastersId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function assignStudentFeemastersReducer(state = initialAssignStudentFeemasterssState, action: AssignStudentFeemasterActions): AssignStudentFeemasterssState {
  switch (action.type) {
    case AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAssignStudentFeemastersId: undefined
      };
    }
    case AssignStudentFeemasterActionTypes.AssignStudentFeemasterActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AssignStudentFeemasterActionTypes.AssignStudentFeemasterOnServerCreated:
      return {
        ...state
      };
    case AssignStudentFeemasterActionTypes.AssignStudentFeemasterCreated:
      return adapter.addOne(action.payload.assignStudentFeemaster, {
        ...state, lastCreatedAssignStudentFeemastersId: action.payload.assignStudentFeemaster.feeGroupId
      });
    case AssignStudentFeemasterActionTypes.AssignStudentFeemasterUpdated:
      return adapter.updateOne(action.payload.partialAssignStudentFeemaster, state);
    // case AssignStudentFeemasterActionTypes.AssignStudentFeemasterssStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAssignStudentFeemasterss: Update<AssignFeemasterStudentRequestDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.assignStudentFeemasterss.length; i++) {
    //     _partialAssignStudentFeemasterss.push({
    //       id: action.payload.assignStudentFeemasterss[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAssignStudentFeemasterss, state);
    // }
    case AssignStudentFeemasterActionTypes.OneAssignStudentFeemasterDeleted:
      return adapter.removeOne(action.payload.id, state);
    case AssignStudentFeemasterActionTypes.ManyAssignStudentFeemastersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AssignStudentFeemasterActionTypes.AssignStudentFeemastersPageLoaded: {
      return adapter.addMany(action.payload.assignStudentFeemasters, {
        ...initialAssignStudentFeemasterssState,
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

export const getAssignStudentFeemastersState = createFeatureSelector<AssignFeemasterStudentRequestDtoModel>('assignStudentFeemasters');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
