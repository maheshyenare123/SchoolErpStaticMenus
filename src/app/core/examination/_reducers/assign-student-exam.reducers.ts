// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AssignStudentExamActions, AssignStudentExamActionTypes } from '../_actions/assign-student-exam.actions';
// Models
import { AssignExamStudentRequestDtoModel } from '../_models/assign-exam-student-request-dto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AssignStudentExamState extends EntityState<AssignExamStudentRequestDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAssignStudentExamsId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AssignExamStudentRequestDtoModel> = createEntityAdapter<AssignExamStudentRequestDtoModel>();

export const initialAssignStudentExamState: AssignStudentExamState = adapter.getInitialState({
  assignStudentExamsForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAssignStudentExamsId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function assignStudentExamsReducer(state = initialAssignStudentExamState, action: AssignStudentExamActions): AssignStudentExamState {
  switch (action.type) {
    case AssignStudentExamActionTypes.AssignStudentExamsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAssignStudentExamsId: undefined
      };
    }
    case AssignStudentExamActionTypes.AssignStudentExamActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AssignStudentExamActionTypes.AssignStudentExamOnServerCreated:
      return {
        ...state
      };
    case AssignStudentExamActionTypes.AssignStudentExamCreated:
      return adapter.addOne(action.payload.assignStudentExam, {
        ...state, lastCreatedAssignStudentExamsId: action.payload.assignStudentExam.examId
      });
    case AssignStudentExamActionTypes.AssignStudentExamUpdated:
      return adapter.updateOne(action.payload.partialAssignStudentExam, state);
    // case AssignStudentExamActionTypes.AssignStudentExamStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAssignStudentExam: Update<AssignExamStudentRequestDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.assignStudentExam.length; i++) {
    //     _partialAssignStudentExam.push({
    //       id: action.payload.assignStudentExam[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAssignStudentExam, state);
    // }
    case AssignStudentExamActionTypes.OneAssignStudentExamDeleted:
      return adapter.removeOne(action.payload.id, state);
    case AssignStudentExamActionTypes.ManyAssignStudentExamsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AssignStudentExamActionTypes.AssignStudentExamsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AssignStudentExamActionTypes.AssignStudentExamsPageLoaded: {
      return adapter.addMany(action.payload.assignStudentExams, {
        ...initialAssignStudentExamState,
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

export const getAssignStudentExamtate = createFeatureSelector<AssignExamStudentRequestDtoModel>('assignStudentExams');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
