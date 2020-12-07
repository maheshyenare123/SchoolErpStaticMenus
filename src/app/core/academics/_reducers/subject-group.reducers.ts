// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { SubjectGroupActions, SubjectGroupActionTypes } from '../_actions/subject-group.actions';
// Models
import { SubjectGroupDtoModel } from '../_models/subjectGroupDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface SubjectGroupsState extends EntityState<SubjectGroupDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedSubjectGroupId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SubjectGroupDtoModel> = createEntityAdapter<SubjectGroupDtoModel>();

export const initialSubjectGroupsState: SubjectGroupsState = adapter.getInitialState({
  subjectGroupForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedSubjectGroupId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function subjectGroupsReducer(state = initialSubjectGroupsState, action: SubjectGroupActions): SubjectGroupsState {
  switch (action.type) {
    case SubjectGroupActionTypes.SubjectGroupsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedSubjectGroupId: undefined
      };
    }
    case SubjectGroupActionTypes.SubjectGroupActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case SubjectGroupActionTypes.SubjectGroupOnServerCreated:
      return {
        ...state
      };
    case SubjectGroupActionTypes.SubjectGroupCreated:
      return adapter.addOne(action.payload.subjectGroup, {
        ...state, lastCreatedSubjectGroupId: action.payload.subjectGroup.id
      });
    case SubjectGroupActionTypes.SubjectGroupUpdated:
      return adapter.updateOne(action.payload.partialSubjectGroup, state);
    // case SubjectGroupActionTypes.SubjectGroupsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialSubjectGroups: Update<SubjectGroupDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.subjectGroups.length; i++) {
    //     _partialSubjectGroups.push({
    //       id: action.payload.subjectGroups[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialSubjectGroups, state);
    // }
    case SubjectGroupActionTypes.OneSubjectGroupDeleted:
      return adapter.removeOne(action.payload.id, state);
    case SubjectGroupActionTypes.ManySubjectGroupsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case SubjectGroupActionTypes.SubjectGroupsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case SubjectGroupActionTypes.SubjectGroupsPageLoaded: {
      return adapter.addMany(action.payload.subjectGroups, {
        ...initialSubjectGroupsState,
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

export const getSubjectGroupState = createFeatureSelector<SubjectGroupDtoModel>('subjectGroups');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
