// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { ExamGroupActions, ExamGroupActionTypes } from '../_actions/exam-group.actions';
// Models
import { ExamGroupModel } from '../_models/exam-group.model';
import { QueryParamsModel } from '../../_base/crud';

export interface ExamGroupsState extends EntityState<ExamGroupModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedExamGroupId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExamGroupModel> = createEntityAdapter<ExamGroupModel>();

export const initialExamGroupsState: ExamGroupsState = adapter.getInitialState({
  examGroupForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedExamGroupId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function examGroupsReducer(state = initialExamGroupsState, action: ExamGroupActions): ExamGroupsState {
  switch (action.type) {
    case ExamGroupActionTypes.ExamGroupsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedExamGroupId: undefined
      };
    }
    case ExamGroupActionTypes.ExamGroupActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case ExamGroupActionTypes.ExamGroupOnServerCreated:
      return {
        ...state
      };
    case ExamGroupActionTypes.ExamGroupCreated:
      return adapter.addOne(action.payload.examGroup, {
        ...state, lastCreatedExamGroupId: action.payload.examGroup.id
      });
    case ExamGroupActionTypes.ExamGroupUpdated:
      return adapter.updateOne(action.payload.partialExamGroup, state);
    // case ExamGroupActionTypes.ExamGroupsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialExamGroups: Update<ExamGroupModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.examGroups.length; i++) {
    //     _partialExamGroups.push({
    //       id: action.payload.examGroups[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialExamGroups, state);
    // }
    case ExamGroupActionTypes.OneExamGroupDeleted:
      return adapter.removeOne(action.payload.id, state);
    case ExamGroupActionTypes.ManyExamGroupsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case ExamGroupActionTypes.ExamGroupsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case ExamGroupActionTypes.ExamGroupsPageLoaded: {
      return adapter.addMany(action.payload.examGroups, {
        ...initialExamGroupsState,
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

export const getExamGroupState = createFeatureSelector<ExamGroupModel>('examGroups');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
