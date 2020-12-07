// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { AssignClassTeachersState } from '../_reducers/assign-class-teacher.reducers';
import { AssignClassTeacherModel } from '../_models/assign-class-teacher.model';

export const selectAssignClassTeachersState = createFeatureSelector<AssignClassTeachersState>('assignClassTeachers');

export const selectAssignClassTeacherById = (assignClassTeacherId: number) => createSelector(
    selectAssignClassTeachersState,
    assignClassTeachersState => assignClassTeachersState.entities[assignClassTeacherId]
);

export const selectAssignClassTeachersPageLoading = createSelector(
    selectAssignClassTeachersState,
    assignClassTeachersState => assignClassTeachersState.listLoading
);

export const selectAssignClassTeachersActionLoading = createSelector(
    selectAssignClassTeachersState,
    assignClassTeachersState => assignClassTeachersState.actionsloading
);

export const selectLastCreatedAssignClassTeacherId = createSelector(
    selectAssignClassTeachersState,
    assignClassTeachersState => assignClassTeachersState.lastCreatedAssignClassTeacherId
);

export const selectAssignClassTeachersShowInitWaitingMessage = createSelector(
    selectAssignClassTeachersState,
    assignClassTeachersState => assignClassTeachersState.showInitWaitingMessage
);

export const selectAssignClassTeachersInStore = createSelector(
    selectAssignClassTeachersState,
    assignClassTeachersState => {
      const items: AssignClassTeacherModel[] = [];
      each(assignClassTeachersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: AssignClassTeacherModel[] =
        httpExtension.sortArray(items, assignClassTeachersState.lastQuery.sortField, assignClassTeachersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, assignClassTeachersState.totalCount, '');
    }
);
