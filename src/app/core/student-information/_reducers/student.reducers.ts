// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentActions, StudentActionTypes } from '../_actions/student.actions';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentsState extends EntityState<StudentDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentDtoModel> = createEntityAdapter<StudentDtoModel>();

export const initialStudentsState: StudentsState = adapter.getInitialState({
  studentForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentsReducer(state = initialStudentsState, action: StudentActions): StudentsState {
  switch (action.type) {
    case StudentActionTypes.StudentsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentId: undefined
      };
    }
    case StudentActionTypes.StudentActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentActionTypes.StudentOnServerCreated:
      return {
        ...state
      };
    case StudentActionTypes.StudentCreated:
      return adapter.addOne(action.payload.student, {
        ...state, lastCreatedStudentId: action.payload.student.id
      });
    case StudentActionTypes.StudentUpdated:
      return adapter.updateOne(action.payload.partialStudent, state);
    // case StudentActionTypes.StudentsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStudents: Update<StudentDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.students.length; i++) {
    //     _partialStudents.push({
    //       id: action.payload.students[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStudents, state);
    // }
    case StudentActionTypes.OneStudentDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentActionTypes.ManyStudentsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentActionTypes.StudentsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentActionTypes.StudentsPageLoaded: {
      return adapter.addMany(action.payload.students, {
        ...initialStudentsState,
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

export const getStudentState = createFeatureSelector<StudentDtoModel>('students');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
