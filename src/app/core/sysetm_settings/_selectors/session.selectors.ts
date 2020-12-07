// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import {  SessionsState} from '../_reducers/session.reducers';
import { SessionModel } from '../_models/session.model';

export const selectSessionState = createFeatureSelector<SessionsState>('sessions');

export const selectClassById = (classId: number) => createSelector(
    selectSessionState,
    sessionState => sessionState.entities[classId]
);

export const selectSessionPageLoading = createSelector(
    selectSessionState,
    sessionState => sessionState.listLoading
);

export const selectSessionActionLoading = createSelector(
    selectSessionState,
    sessionState => sessionState.actionsloading
);

export const selectLastCreatedSessionId = createSelector(
    selectSessionState,
    sessionState => sessionState.lastCreatedSessionId
);

export const selectSessionShowInitWaitingMessage = createSelector(
    selectSessionState,
    sessionState => sessionState.showInitWaitingMessage
);

export const selectSessionInStore = createSelector(
    selectSessionState,
    sessionState => {
      const items: SessionModel[] = [];
      each(sessionState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: SessionModel[] =
        httpExtension.sortArray(items, sessionState.lastQuery.sortField, sessionState.lastQuery.sortOrder);
      return new QueryResultsModel(result, sessionState.totalCount, '');
    }
);
