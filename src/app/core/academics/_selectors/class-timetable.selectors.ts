// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { ClassTimetablesState } from '../_reducers/class-timetable.reducers';
import { ClassTimetableModel } from '../_models/class-timetable.model';

export const selectClassTimetablesState = createFeatureSelector<ClassTimetablesState>('classTimetables');

export const selectClassTimetableById = (classTimetableId: number) => createSelector(
    selectClassTimetablesState,
    classTimetablesState => classTimetablesState.entities[classTimetableId]
);

export const selectClassTimetablesPageLoading = createSelector(
    selectClassTimetablesState,
    classTimetablesState => classTimetablesState.listLoading
);

export const selectClassTimetablesActionLoading = createSelector(
    selectClassTimetablesState,
    classTimetablesState => classTimetablesState.actionsloading
);

export const selectLastCreatedClassTimetableId = createSelector(
    selectClassTimetablesState,
    classTimetablesState => classTimetablesState.lastCreatedClassTimetableId
);

export const selectClassTimetablesShowInitWaitingMessage = createSelector(
    selectClassTimetablesState,
    classTimetablesState => classTimetablesState.showInitWaitingMessage
);

export const selectClassTimetablesInStore = createSelector(
    selectClassTimetablesState,
    classTimetablesState => {
      const items: ClassTimetableModel[] = [];
      each(classTimetablesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: ClassTimetableModel[] =
        httpExtension.sortArray(items, classTimetablesState.lastQuery.sortField, classTimetablesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, classTimetablesState.totalCount, '');
    }
);
