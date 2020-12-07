// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { DisabledStudentsState } from '../_reducers/disabled-student.reducers';
import { StudentDtoModel } from '../_models/studentDto.model';

export const selectDisabledStudentsState = createFeatureSelector<DisabledStudentsState>('disabledStudents');

export const selectDisabledStudentById = (disabledStudentId: number) => createSelector(
    selectDisabledStudentsState,
    disabledStudentsState => disabledStudentsState.entities[disabledStudentId]
);

export const selectDisabledStudentsPageLoading = createSelector(
    selectDisabledStudentsState,
    disabledStudentsState => disabledStudentsState.listLoading
);

export const selectDisabledStudentsActionLoading = createSelector(
    selectDisabledStudentsState,
    disabledStudentsState => disabledStudentsState.actionsloading
);

export const selectLastCreatedDisabledStudentId = createSelector(
    selectDisabledStudentsState,
    disabledStudentsState => disabledStudentsState.lastCreatedDisabledStudentId
);

export const selectDisabledStudentsShowInitWaitingMessage = createSelector(
    selectDisabledStudentsState,
    disabledStudentsState => disabledStudentsState.showInitWaitingMessage
);

export const selectDisabledStudentsInStore = createSelector(
    selectDisabledStudentsState,
    disabledStudentsState => {
      const items: StudentDtoModel[] = [];
      each(disabledStudentsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StudentDtoModel[] =
        httpExtension.sortArray(items, disabledStudentsState.lastQuery.sortField, disabledStudentsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, disabledStudentsState.totalCount, '');
    }
);
