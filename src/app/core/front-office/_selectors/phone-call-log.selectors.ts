// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { PhoneCallLogsState } from '../_reducers/phone-call-log.reducers';
import { GeneralCallModel } from '../_models/general-call.model';

export const selectPhoneCallLogsState = createFeatureSelector<PhoneCallLogsState>('phoneCallLogs');

export const selectPhoneCallLogById = (phoneCallLogId: number) => createSelector(
    selectPhoneCallLogsState,
    phoneCallLogsState => phoneCallLogsState.entities[phoneCallLogId]
);

export const selectPhoneCallLogsPageLoading = createSelector(
    selectPhoneCallLogsState,
    phoneCallLogsState => phoneCallLogsState.listLoading
);

export const selectPhoneCallLogsActionLoading = createSelector(
    selectPhoneCallLogsState,
    phoneCallLogsState => phoneCallLogsState.actionsloading
);

export const selectLastCreatedPhoneCallLogId = createSelector(
    selectPhoneCallLogsState,
    phoneCallLogsState => phoneCallLogsState.lastCreatedPhoneCallLogId
);

export const selectPhoneCallLogsShowInitWaitingMessage = createSelector(
    selectPhoneCallLogsState,
    phoneCallLogsState => phoneCallLogsState.showInitWaitingMessage
);

export const selectPhoneCallLogsInStore = createSelector(
    selectPhoneCallLogsState,
    phoneCallLogsState => {
      const items: GeneralCallModel[] = [];
      each(phoneCallLogsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: GeneralCallModel[] =
        httpExtension.sortArray(items, phoneCallLogsState.lastQuery.sortField, phoneCallLogsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, phoneCallLogsState.totalCount, '');
    }
);
