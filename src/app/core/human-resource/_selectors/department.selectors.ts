// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DepartmentsState } from '../_reducers/department.reducers';
import { DepartmentModel } from '../_models/department.model';

export const selectDepartmentsState = createFeatureSelector<DepartmentsState>('departments');

export const selectDepartmentById = (departmentId: number) => createSelector(
    selectDepartmentsState,
    departmentsState => departmentsState.entities[departmentId]
);

export const selectDepartmentsPageLoading = createSelector(
    selectDepartmentsState,
    departmentsState => departmentsState.listLoading
);

export const selectDepartmentsActionLoading = createSelector(
    selectDepartmentsState,
    departmentsState => departmentsState.actionsloading
);

export const selectLastCreatedDepartmentId = createSelector(
    selectDepartmentsState,
    departmentsState => departmentsState.lastCreatedDepartmentId
);

export const selectDepartmentsShowInitWaitingMessage = createSelector(
    selectDepartmentsState,
    departmentsState => departmentsState.showInitWaitingMessage
);

export const selectDepartmentsInStore = createSelector(
    selectDepartmentsState,
    departmentsState => {
      const items: DepartmentModel[] = [];
      each(departmentsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: DepartmentModel[] =
        httpExtension.sortArray(items, departmentsState.lastQuery.sortField, departmentsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, departmentsState.totalCount, '');
    }
);
