// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { PhoneCallLogActions, PhoneCallLogActionTypes } from '../_actions/phone-call-log.actions';
// Models
import { GeneralCallModel } from '../_models/general-call.model';
import { QueryParamsModel } from '../../_base/crud';

export interface PhoneCallLogsState extends EntityState<GeneralCallModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedPhoneCallLogId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<GeneralCallModel> = createEntityAdapter<GeneralCallModel>();

export const initialPhoneCallLogsState: PhoneCallLogsState = adapter.getInitialState({
  phoneCallLogForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedPhoneCallLogId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function phoneCallLogsReducer(state = initialPhoneCallLogsState, action: PhoneCallLogActions): PhoneCallLogsState {
  switch (action.type) {
    case PhoneCallLogActionTypes.PhoneCallLogsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedPhoneCallLogId: undefined
      };
    }
    case PhoneCallLogActionTypes.PhoneCallLogActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case PhoneCallLogActionTypes.PhoneCallLogOnServerCreated:
      return {
        ...state
      };
    case PhoneCallLogActionTypes.PhoneCallLogCreated:
      return adapter.addOne(action.payload.phoneCallLog, {
        ...state, lastCreatedPhoneCallLogId: action.payload.phoneCallLog.id
      });

      


    case PhoneCallLogActionTypes.PhoneCallLogUpdated:
      return adapter.updateOne(action.payload.partialPhoneCallLog, state);
    // case PhoneCallLogActionTypes.PhoneCallLogsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialPhoneCallLogs: Update<GeneralCallModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.phoneCallLogs.length; i++) {
    //     _partialPhoneCallLogs.push({
    //       id: action.payload.phoneCallLogs[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialPhoneCallLogs, state);
    // }
    case PhoneCallLogActionTypes.OnePhoneCallLogDeleted:
      return adapter.removeOne(action.payload.id, state);
    case PhoneCallLogActionTypes.ManyPhoneCallLogsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case PhoneCallLogActionTypes.PhoneCallLogsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case PhoneCallLogActionTypes.PhoneCallLogsPageLoaded: {
      return adapter.addMany(action.payload.phoneCallLogs, {
        ...initialPhoneCallLogsState,
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

export const getPhoneCallLogState = createFeatureSelector<GeneralCallModel>('phoneCallLogs');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
