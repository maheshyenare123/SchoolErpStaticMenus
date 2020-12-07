// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { HomeworkActions, HomeworkActionTypes } from '../_actions/homework.actions';
// Models
import { HomeworkDtoModel } from '../_models/homeworkDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface HomeworksState extends EntityState<HomeworkDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedHomeworkId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<HomeworkDtoModel> = createEntityAdapter<HomeworkDtoModel>();

export const initialHomeworksState: HomeworksState = adapter.getInitialState({
  homeworkForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedHomeworkId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function homeworksReducer(state = initialHomeworksState, action: HomeworkActions): HomeworksState {
  switch (action.type) {
    case HomeworkActionTypes.HomeworksPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedHomeworkId: undefined
      };
    }
    case HomeworkActionTypes.HomeworkActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case HomeworkActionTypes.HomeworkOnServerCreated:
      return {
        ...state
      };
    case HomeworkActionTypes.HomeworkCreated:
      return adapter.addOne(action.payload.homework, {
        ...state, lastCreatedHomeworkId: action.payload.homework.id
      });
    case HomeworkActionTypes.HomeworkUpdated:
      return adapter.updateOne(action.payload.partialHomework, state);
    // case HomeworkActionTypes.HomeworksStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialHomeworks: Update<HomeworkDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.homeworks.length; i++) {
    //     _partialHomeworks.push({
    //       id: action.payload.homeworks[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialHomeworks, state);
    // }
    case HomeworkActionTypes.OneHomeworkDeleted:
      return adapter.removeOne(action.payload.id, state);
    case HomeworkActionTypes.ManyHomeworksDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case HomeworkActionTypes.HomeworksPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case HomeworkActionTypes.HomeworksPageLoaded: {
      return adapter.addMany(action.payload.homeworks, {
        ...initialHomeworksState,
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

export const getHomeworkState = createFeatureSelector<HomeworkDtoModel>('homeworks');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
