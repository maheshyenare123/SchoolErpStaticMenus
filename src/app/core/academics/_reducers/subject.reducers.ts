// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { SubjectActions, SubjectActionTypes } from '../_actions/subject.actions';
// Models
import { SubjectDtoModel } from '../_models/subjectDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface SubjectsState extends EntityState<SubjectDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedSubjectId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SubjectDtoModel> = createEntityAdapter<SubjectDtoModel>();

export const initialSubjectsState: SubjectsState = adapter.getInitialState({
  subjectForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedSubjectId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function subjectsReducer(state = initialSubjectsState, action: SubjectActions): SubjectsState {
  switch (action.type) {
    case SubjectActionTypes.SubjectsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedSubjectId: undefined
      };
    }
    case SubjectActionTypes.SubjectActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case SubjectActionTypes.SubjectOnServerCreated:
      return {
        ...state
      };
    case SubjectActionTypes.SubjectCreated:
      return adapter.addOne(action.payload.subject, {
        ...state, lastCreatedSubjectId: action.payload.subject.id
      });
    case SubjectActionTypes.SubjectUpdated:
      return adapter.updateOne(action.payload.partialSubject, state);
    // case SubjectActionTypes.SubjectsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialSubjects: Update<SubjectDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.subjects.length; i++) {
    //     _partialSubjects.push({
    //       id: action.payload.subjects[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialSubjects, state);
    // }
    case SubjectActionTypes.OneSubjectDeleted:
      return adapter.removeOne(action.payload.id, state);
    case SubjectActionTypes.ManySubjectsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case SubjectActionTypes.SubjectsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case SubjectActionTypes.SubjectsPageLoaded: {
      return adapter.addMany(action.payload.subjects, {
        ...initialSubjectsState,
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

export const getSubjectState = createFeatureSelector<SubjectDtoModel>('subjects');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
