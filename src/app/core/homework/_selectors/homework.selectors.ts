// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { HomeworksState } from '../_reducers/homework.reducers';
import { HomeworkDtoModel } from '../_models/homeworkDto.model';

export const selectHomeworksState = createFeatureSelector<HomeworksState>('homeworks');

export const selectHomeworkById = (homeworkId: number) => createSelector(
    selectHomeworksState,
    homeworksState => homeworksState.entities[homeworkId]
);

export const selectHomeworksPageLoading = createSelector(
    selectHomeworksState,
    homeworksState => homeworksState.listLoading
);

export const selectHomeworksActionLoading = createSelector(
    selectHomeworksState,
    homeworksState => homeworksState.actionsloading
);

export const selectLastCreatedHomeworkId = createSelector(
    selectHomeworksState,
    homeworksState => homeworksState.lastCreatedHomeworkId
);

export const selectHomeworksShowInitWaitingMessage = createSelector(
    selectHomeworksState,
    homeworksState => homeworksState.showInitWaitingMessage
);

export const selectHomeworksInStore = createSelector(
    selectHomeworksState,
    homeworksState => {
      const items: HomeworkDtoModel[] = [];
      each(homeworksState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: HomeworkDtoModel[] =
        httpExtension.sortArray(items, homeworksState.lastQuery.sortField, homeworksState.lastQuery.sortOrder);
      return new QueryResultsModel(result, homeworksState.totalCount, '');
    }
);
