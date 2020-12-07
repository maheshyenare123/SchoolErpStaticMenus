// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentDetailActions, StudentDetailActionTypes } from '../_actions/student-detail.actions';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentDetailsState extends EntityState<StudentDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentDetailId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentDtoModel> = createEntityAdapter<StudentDtoModel>();

export const initialStudentDetailsState: StudentDetailsState = adapter.getInitialState({
  studentDetailForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentDetailId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentDetailsReducer(state = initialStudentDetailsState, action: StudentDetailActions): StudentDetailsState {
  switch (action.type) {
    case StudentDetailActionTypes.StudentDetailsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentDetailId: undefined
      };
    }
    case StudentDetailActionTypes.StudentDetailActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentDetailActionTypes.StudentDetailOnServerCreated:
      return {
        ...state
      };
    case StudentDetailActionTypes.StudentDetailCreated:
      return adapter.addOne(action.payload.studentDetail, {
        ...state, lastCreatedStudentDetailId: action.payload.studentDetail.id
      });
    case StudentDetailActionTypes.StudentDetailUpdated:
      return adapter.updateOne(action.payload.partialStudentDetails, state);
    // case StudentDetailActionTypes.StudentDetailsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStudentDetails: Update<StudentDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.studentDetails.length; i++) {
    //     _partialStudentDetails.push({
    //       id: action.payload.studentDetails[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStudentDetails, state);
    // }
    case StudentDetailActionTypes.OneStudentDetailDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentDetailActionTypes.ManyStudentDetailsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentDetailActionTypes.StudentDetailsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentDetailActionTypes.StudentDetailsPageLoaded: {
      return adapter.addMany(action.payload.studentDetails, {
        ...initialStudentDetailsState,
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

export const getStudentDetailState = createFeatureSelector<StudentDtoModel>('studentDetails');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
