// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentAttendenceActions, StudentAttendenceActionTypes } from '../_actions/student-attendance.actions';
// Models
import { StudentAttendenceDtoModel } from '../_models/studentAttendenceDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentAttendencesState extends EntityState<StudentAttendenceDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentAttendenceId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentAttendenceDtoModel> = createEntityAdapter<StudentAttendenceDtoModel>();

export const initialStudentAttendencesState: StudentAttendencesState = adapter.getInitialState({
  studentAttendenceForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentAttendenceId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentAttendencesReducer(state = initialStudentAttendencesState, action: StudentAttendenceActions): StudentAttendencesState {
  switch (action.type) {
    case StudentAttendenceActionTypes.StudentAttendencesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentAttendenceId: undefined
      };
    }
    case StudentAttendenceActionTypes.StudentAttendenceActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentAttendenceActionTypes.StudentAttendenceOnServerCreated:
      return {
        ...state
      };
    case StudentAttendenceActionTypes.StudentAttendenceCreated:
      return adapter.addOne(action.payload.studentAttendence, {
        ...state, lastCreatedStudentAttendenceId: action.payload.studentAttendence.id
      });
    case StudentAttendenceActionTypes.StudentAttendenceUpdated:
      return adapter.updateOne(action.payload.partialStudentAttendence, state);
    case StudentAttendenceActionTypes.StudentAttendencesStatusUpdated: {
      // tslint:disable-next-line
      const _partialStudentAttendences: Update<StudentAttendenceDtoModel>[] = [];
      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line
      for (let i = 0; i < action.payload.studentAttendences.length; i++) {
        _partialStudentAttendences.push({
          id: action.payload.studentAttendences[i].id,
          changes: {
            
            // status: action.payload.status
          }
        });
      }
      return adapter.updateMany(_partialStudentAttendences, state);
    }
    case StudentAttendenceActionTypes.OneStudentAttendenceDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentAttendenceActionTypes.ManyStudentAttendencesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentAttendenceActionTypes.StudentAttendencesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentAttendenceActionTypes.StudentAttendencesPageLoaded: {
      return adapter.addMany(action.payload.studentAttendences, {
        ...initialStudentAttendencesState,
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

export const getStudentAttendenceState = createFeatureSelector<StudentAttendenceDtoModel>('studentAttendences');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
