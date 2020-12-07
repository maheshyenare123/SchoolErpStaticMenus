// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StaffRatingActions, StaffRatingActionTypes } from '../_actions/staff-rating.actions';
// Models
import { StaffRatingModel } from '../_models/staff-rating.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StaffRatingsState extends EntityState<StaffRatingModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStaffRatingId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StaffRatingModel> = createEntityAdapter<StaffRatingModel>();

export const initialStaffRatingsState: StaffRatingsState = adapter.getInitialState({
  staffRatingForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStaffRatingId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function staffRatingsReducer(state = initialStaffRatingsState, action: StaffRatingActions): StaffRatingsState {
  switch (action.type) {
    case StaffRatingActionTypes.StaffRatingsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStaffRatingId: undefined
      };
    }
    case StaffRatingActionTypes.StaffRatingActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StaffRatingActionTypes.StaffRatingOnServerCreated:
      return {
        ...state
      };
    case StaffRatingActionTypes.StaffRatingCreated:
      return adapter.addOne(action.payload.staffRating, {
        ...state, lastCreatedStaffRatingId: action.payload.staffRating.id
      });
    case StaffRatingActionTypes.StaffRatingUpdated:
      return adapter.updateOne(action.payload.partialStaffRating, state);
    // case StaffRatingActionTypes.StaffRatingsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStaffRatings: Update<StaffRatingModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.staffRatings.length; i++) {
    //     _partialStaffRatings.push({
    //       id: action.payload.staffRatings[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStaffRatings, state);
    // }
    case StaffRatingActionTypes.OneStaffRatingDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StaffRatingActionTypes.ManyStaffRatingsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StaffRatingActionTypes.StaffRatingsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StaffRatingActionTypes.StaffRatingsPageLoaded: {
      return adapter.addMany(action.payload.staffRatings, {
        ...initialStaffRatingsState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false
      });
    }
    default:
      return state;
  }
}

export const getStaffRatingState = createFeatureSelector<StaffRatingModel>('staffRatings');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
