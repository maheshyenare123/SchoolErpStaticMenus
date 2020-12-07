// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ExamActions, ExamActionTypes } from '../_actions/exam.actions';
// Models
import { ExamModel } from '../_models/exam.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ExamsState extends EntityState<ExamModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedExamId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExamModel> = createEntityAdapter<ExamModel>();

export const initialExamsState: ExamsState = adapter.getInitialState({
  examForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedExamId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function examsReducer(state = initialExamsState, action: ExamActions): ExamsState {
  switch (action.type) {
    case ExamActionTypes.ExamsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedExamId: undefined
      };
    }
    case ExamActionTypes.ExamActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ExamActionTypes.ExamOnServerCreated:
      return {
        ...state
      };
    case ExamActionTypes.ExamCreated:
      return adapter.addOne(action.payload.exam, {
        ...state, lastCreatedExamId: action.payload.exam.id
      });
    case ExamActionTypes.ExamUpdated:
      return adapter.updateOne(action.payload.partialExam, state);
    // case ExamActionTypes.ExamsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialExams: Update<ExamModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.exams.length; i++) {
    //     _partialExams.push({
    //       id: action.payload.exams[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialExams, state);
    // }
    case ExamActionTypes.OneExamDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ExamActionTypes.ManyExamsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ExamActionTypes.ExamsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ExamActionTypes.ExamsPageLoaded: {
      return adapter.addMany(action.payload.exams, {
        ...initialExamsState,
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

export const getExamState = createFeatureSelector<ExamModel>('exams');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
