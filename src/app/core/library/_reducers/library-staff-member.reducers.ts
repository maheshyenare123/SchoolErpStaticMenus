// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { LibraryStaffMemberActions, LibraryStaffMemberActionTypes } from '../_actions/library-staff-member.actions';
// Models
import { LibraryStaffMemberModel } from '../_models/library-staff-member.model';
import { QueryParamsModel } from '../../_base/crud';

export interface LibraryStaffMembersState extends EntityState<LibraryStaffMemberModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedLibraryStaffMemberId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<LibraryStaffMemberModel> = createEntityAdapter<LibraryStaffMemberModel>();

export const initialLibraryStaffMembersState: LibraryStaffMembersState = adapter.getInitialState({
  libraryStaffMemberForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedLibraryStaffMemberId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function libraryStaffMembersReducer(state = initialLibraryStaffMembersState, action: LibraryStaffMemberActions): LibraryStaffMembersState {
  switch (action.type) {
    case LibraryStaffMemberActionTypes.LibraryStaffMembersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedLibraryStaffMemberId: undefined
      };
    }
    case LibraryStaffMemberActionTypes.LibraryStaffMemberActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case LibraryStaffMemberActionTypes.LibraryStaffMemberOnServerCreated:
      return {
        ...state
      };
    case LibraryStaffMemberActionTypes.LibraryStaffMemberCreated:
      return adapter.addOne(action.payload.libraryStaffMember, {
        ...state, lastCreatedLibraryStaffMemberId: action.payload.libraryStaffMember.memberId
      });
    case LibraryStaffMemberActionTypes.LibraryStaffMemberUpdated:
      return adapter.updateOne(action.payload.partialLibraryStaffMember, state);
    // case LibraryStaffMemberActionTypes.LibraryStaffMembersStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialLibraryStaffMembers: Update<LibraryStaffMemberModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.libraryStaffMembers.length; i++) {
    //     _partialLibraryStaffMembers.push({
    //       id: action.payload.libraryStaffMembers[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialLibraryStaffMembers, state);
    // }
    case LibraryStaffMemberActionTypes.OneLibraryStaffMemberDeleted:
      return adapter.removeOne(action.payload.id, state);
    case LibraryStaffMemberActionTypes.ManyLibraryStaffMembersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case LibraryStaffMemberActionTypes.LibraryStaffMembersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case LibraryStaffMemberActionTypes.LibraryStaffMembersPageLoaded: {
      return adapter.addMany(action.payload.libraryStaffMembers, {
        ...initialLibraryStaffMembersState,
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

export const getLibraryStaffMemberState = createFeatureSelector<LibraryStaffMemberModel>('libraryStaffMembers');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
