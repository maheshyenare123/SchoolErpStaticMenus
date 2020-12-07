// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { FeesRemindersState } from '../_reducers/fees-reminder.reducers';
import { FeesReminderModel } from '../_models/fees-reminder.model';

export const selectFeesRemindersState = createFeatureSelector<FeesRemindersState>('feesReminders');

export const selectFeesReminderById = (feesReminderId: number) => createSelector(
    selectFeesRemindersState,
    feesRemindersState => feesRemindersState.entities[feesReminderId]
);

export const selectFeesRemindersPageLoading = createSelector(
    selectFeesRemindersState,
    feesRemindersState => feesRemindersState.listLoading
);

export const selectFeesRemindersActionLoading = createSelector(
    selectFeesRemindersState,
    feesRemindersState => feesRemindersState.actionsloading
);

export const selectLastCreatedFeesReminderId = createSelector(
    selectFeesRemindersState,
    feesRemindersState => feesRemindersState.lastCreatedFeesReminderId
);

export const selectFeesRemindersShowInitWaitingMessage = createSelector(
    selectFeesRemindersState,
    feesRemindersState => feesRemindersState.showInitWaitingMessage
);

export const selectFeesRemindersInStore = createSelector(
    selectFeesRemindersState,
    feesRemindersState => {
      const items: FeesReminderModel[] = [];
      each(feesRemindersState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: FeesReminderModel[] =
        httpExtension.sortArray(items, feesRemindersState.lastQuery.sortField, feesRemindersState.lastQuery.sortOrder);
      return new QueryResultsModel(result, feesRemindersState.totalCount, '');
    }
);
