// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { SessionActions, SessionActionTypes } from '../_actions/session.actions';
// Models
import { SessionModel } from '../_models/session.model';
import { QueryParamsModel } from '../../_base/crud';

export interface SessionsState extends EntityState<SessionModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedSessionId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SessionModel> = createEntityAdapter<SessionModel>();

export const initialSessionsState: SessionsState = adapter.getInitialState({
  sessionForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedSessionId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function sessionsReducer(state = initialSessionsState, action: SessionActions): SessionsState {
  switch (action.type) {
    case SessionActionTypes.SessionsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedSessionId: undefined
      };
    }
    case SessionActionTypes.SessionActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case SessionActionTypes.SessionOnServerCreated:
      return {
        ...state
      };
    case SessionActionTypes.SessionCreated:
      return adapter.addOne(action.payload.session, {
        ...state, lastCreatedSessionId: action.payload.session.id
      });
    case SessionActionTypes.SessionUpdated:
      return adapter.updateOne(action.payload.partialSession, state);
    // case SessionActionTypes.SessionsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialSessions: Update<SessionModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.sessions.length; i++) {
    //     _partialSessions.push({
    //       id: action.payload.sessions[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialSessions, state);
    // }
    case SessionActionTypes.OneSessionDeleted:
      return adapter.removeOne(action.payload.id, state);
    case SessionActionTypes.ManySessionsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case SessionActionTypes.SessionsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case SessionActionTypes.SessionsPageLoaded: {
      return adapter.addMany(action.payload.sessions, {
        ...initialSessionsState,
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

export const getSessionState = createFeatureSelector<SessionModel>('sessions');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
