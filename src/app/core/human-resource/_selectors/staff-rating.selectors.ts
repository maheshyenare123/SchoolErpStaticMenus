// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { StaffRatingsState } from '../_reducers/staff-rating.reducers';
import { StaffRatingModel } from '../_models/staff-rating.model';

export const selectStaffRatingsState = createFeatureSelector<StaffRatingsState>('staffRatings');

export const selectStaffRatingById = (staffRatingId: number) => createSelector(
    selectStaffRatingsState,
    staffRatingsState => staffRatingsState.entities[staffRatingId]
);

export const selectStaffRatingsPageLoading = createSelector(
    selectStaffRatingsState,
    staffRatingsState => staffRatingsState.listLoading
);

export const selectStaffRatingsActionLoading = createSelector(
    selectStaffRatingsState,
    staffRatingsState => staffRatingsState.actionsloading
);

export const selectLastCreatedStaffRatingId = createSelector(
    selectStaffRatingsState,
    staffRatingsState => staffRatingsState.lastCreatedStaffRatingId
);

export const selectStaffRatingsShowInitWaitingMessage = createSelector(
    selectStaffRatingsState,
    staffRatingsState => staffRatingsState.showInitWaitingMessage
);

export const selectStaffRatingsInStore = createSelector(
    selectStaffRatingsState,
    staffRatingsState => {
      const items: StaffRatingModel[] = [];
      each(staffRatingsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: StaffRatingModel[] =
        httpExtension.sortArray(items, staffRatingsState.lastQuery.sortField, staffRatingsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, staffRatingsState.totalCount, '');
    }
);
