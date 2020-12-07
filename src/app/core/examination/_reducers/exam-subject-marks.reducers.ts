// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ExamSubjectMarksActions, ExamSubjectMarksActionTypes } from '../_actions/exam-subject-marks.actions';
// Models
import { ExamSubjectMarksModel } from '../_models/exam-subject-marks.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ExamSubjectMarkssState extends EntityState<ExamSubjectMarksModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedExamSubjectMarksId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExamSubjectMarksModel> = createEntityAdapter<ExamSubjectMarksModel>();

export const initialExamSubjectMarkssState: ExamSubjectMarkssState = adapter.getInitialState({
  examSubjectMarksForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedExamSubjectMarksId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function examSubjectMarkssReducer(state = initialExamSubjectMarkssState, action: ExamSubjectMarksActions): ExamSubjectMarkssState {
  switch (action.type) {
    case ExamSubjectMarksActionTypes.ExamSubjectMarkssPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedExamSubjectMarksId: undefined
      };
    }
    case ExamSubjectMarksActionTypes.ExamSubjectMarksActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ExamSubjectMarksActionTypes.ExamSubjectMarksOnServerCreated:
      return {
        ...state
      };
    case ExamSubjectMarksActionTypes.ExamSubjectMarksCreated:
      return adapter.addOne(action.payload.examSubjectMarks, {
        ...state, lastCreatedExamSubjectMarksId: action.payload.examSubjectMarks.examResultId
      });
    case ExamSubjectMarksActionTypes.ExamSubjectMarksUpdated:
      return adapter.updateOne(action.payload.partialExamSubjectMarks, state);
    // case ExamSubjectMarksActionTypes.ExamSubjectMarkssStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialExamSubjectMarkss: Update<ExamSubjectMarksModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.examSubjectMarkss.length; i++) {
    //     _partialExamSubjectMarkss.push({
    //       id: action.payload.examSubjectMarkss[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialExamSubjectMarkss, state);
    // }
    case ExamSubjectMarksActionTypes.OneExamSubjectMarksDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ExamSubjectMarksActionTypes.ManyExamSubjectMarkssDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ExamSubjectMarksActionTypes.ExamSubjectMarkssPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ExamSubjectMarksActionTypes.ExamSubjectMarkssPageLoaded: {
      return adapter.addMany(action.payload.examSubjectMarkss, {
        ...initialExamSubjectMarkssState,
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

export const getExamSubjectMarksState = createFeatureSelector<ExamSubjectMarksModel>('examSubjectMarkss');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
