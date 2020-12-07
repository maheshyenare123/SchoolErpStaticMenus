// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ExamSubjectActions, ExamSubjectActionTypes } from '../_actions/exam-subject.actions';
// Models
import { ExamSubjectDtoModel } from '../_models/exam-subject-dto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ExamSubjectState extends EntityState<ExamSubjectDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedExamSubjectsId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExamSubjectDtoModel> = createEntityAdapter<ExamSubjectDtoModel>();

export const initialExamSubjectState: ExamSubjectState = adapter.getInitialState({
  examSubjectsForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedExamSubjectsId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function examSubjectsReducer(state = initialExamSubjectState, action: ExamSubjectActions): ExamSubjectState {
  switch (action.type) {
    case ExamSubjectActionTypes.ExamSubjectsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedExamSubjectsId: undefined
      };
    }
    case ExamSubjectActionTypes.ExamSubjectActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ExamSubjectActionTypes.ExamSubjectOnServerCreated:
      return {
        ...state
      };
    // case ExamSubjectActionTypes.ExamSubjectCreated:
    //   return adapter.addOne(action.payload.examSubject, {
    //     ...state, lastCreatedExamSubjectsId: action.payload.examSubject.examId
    //   });
    case ExamSubjectActionTypes.ExamSubjectUpdated:
      return adapter.updateOne(action.payload.partialExamSubject, state);
    // case ExamSubjectActionTypes.ExamSubjectStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialExamSubject: Update<ExamSubjectDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.examSubject.length; i++) {
    //     _partialExamSubject.push({
    //       id: action.payload.examSubject[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialExamSubject, state);
    // }
    case ExamSubjectActionTypes.OneExamSubjectDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ExamSubjectActionTypes.ManyExamSubjectsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ExamSubjectActionTypes.ExamSubjectsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ExamSubjectActionTypes.ExamSubjectsPageLoaded: {
      return adapter.addMany(action.payload.examSubjects, {
        ...initialExamSubjectState,
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

export const getExamSubjecttate = createFeatureSelector<ExamSubjectDtoModel>('examSubjects');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
