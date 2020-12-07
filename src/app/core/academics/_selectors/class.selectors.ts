// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ClasssState } from '../_reducers/class.reducers';
import { ClassDtoModel } from '../_models/classDto.model';

export const selectClasssState = createFeatureSelector<ClasssState>('classs');

export const selectClassById = (classId: number) => createSelector(
    selectClasssState,
    classsState => classsState.entities[classId]
);

export const selectClasssPageLoading = createSelector(
    selectClasssState,
    classsState => classsState.listLoading
);

export const selectClasssActionLoading = createSelector(
    selectClasssState,
    classsState => classsState.actionsloading
);

export const selectLastCreatedClassId = createSelector(
    selectClasssState,
    classsState => classsState.lastCreatedClassId
);

export const selectClasssShowInitWaitingMessage = createSelector(
    selectClasssState,
    classsState => classsState.showInitWaitingMessage
);

export const selectClasssInStore = createSelector(
    selectClasssState,
    classsState => {
      const items: ClassDtoModel[] = [];
      each(classsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ClassDtoModel[] =
        httpExtension.sortArray(items, classsState.lastQuery.sortField, classsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, classsState.totalCount, '');
    }
);
