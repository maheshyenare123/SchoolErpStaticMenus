// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { FeesReminderActions, FeesReminderActionTypes } from '../_actions/fees-reminder.actions';
// Models
import { FeesReminderModel } from '../_models/fees-reminder.model';
import { QueryParamsModel } from '../../_base/crud';

export interface FeesRemindersState extends EntityState<FeesReminderModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedFeesReminderId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<FeesReminderModel> = createEntityAdapter<FeesReminderModel>();

export const initialFeesRemindersState: FeesRemindersState = adapter.getInitialState({
  feesReminderForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedFeesReminderId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function feesRemindersReducer(state = initialFeesRemindersState, action: FeesReminderActions): FeesRemindersState {
  switch (action.type) {
    case FeesReminderActionTypes.FeesRemindersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedFeesReminderId: undefined
      };
    }
    case FeesReminderActionTypes.FeesReminderActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case FeesReminderActionTypes.FeesReminderOnServerCreated:
      return {
        ...state
      };
    case FeesReminderActionTypes.FeesReminderCreated:
      return adapter.addOne(action.payload.feesReminder, {
        ...state, lastCreatedFeesReminderId: action.payload.feesReminder.id
      });
    case FeesReminderActionTypes.FeesReminderUpdated:
      return adapter.updateOne(action.payload.partialFeesReminder, state);
    // case FeesReminderActionTypes.FeesRemindersStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialFeesReminders: Update<FeesReminderModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.feesReminders.length; i++) {
    //     _partialFeesReminders.push({
    //       id: action.payload.feesReminders[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialFeesReminders, state);
    // }
    case FeesReminderActionTypes.OneFeesReminderDeleted:
      return adapter.removeOne(action.payload.id, state);
    case FeesReminderActionTypes.ManyFeesRemindersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case FeesReminderActionTypes.FeesRemindersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case FeesReminderActionTypes.FeesRemindersPageLoaded: {
      return adapter.addMany(action.payload.feesReminders, {
        ...initialFeesRemindersState,
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

export const getFeesReminderState = createFeatureSelector<FeesReminderModel>('feesReminders');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
