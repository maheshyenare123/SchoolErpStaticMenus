// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StudentHousesState } from '../_reducers/student-house.reducers';
import { SchoolHousModel } from '../_models/schoolHous.model';

export const selectStudentHousesState = createFeatureSelector<StudentHousesState>('studentHouses');

export const selectStudentHouseById = (studentHouseId: number) => createSelector(
    selectStudentHousesState,
    studentHousesState => studentHousesState.entities[studentHouseId]
);

export const selectStudentHousesPageLoading = createSelector(
    selectStudentHousesState,
    studentHousesState => studentHousesState.listLoading
);

export const selectStudentHousesActionLoading = createSelector(
    selectStudentHousesState,
    studentHousesState => studentHousesState.actionsloading
);

export const selectLastCreatedStudentHouseId = createSelector(
    selectStudentHousesState,
    studentHousesState => studentHousesState.lastCreatedStudentHouseId
);

export const selectStudentHousesShowInitWaitingMessage = createSelector(
    selectStudentHousesState,
    studentHousesState => studentHousesState.showInitWaitingMessage
);

export const selectStudentHousesInStore = createSelector(
    selectStudentHousesState,
    studentHousesState => {
      const items: SchoolHousModel[] = [];
      each(studentHousesState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: SchoolHousModel[] =
        httpExtension.sortArray(items, studentHousesState.lastQuery.sortField, studentHousesState.lastQuery.sortOrder);
      return new QueryResultsModel(result, studentHousesState.totalCount, '');
    }
);
