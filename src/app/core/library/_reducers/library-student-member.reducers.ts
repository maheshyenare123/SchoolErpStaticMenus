// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { LibraryStudentMemberActions, LibraryStudentMemberActionTypes } from '../_actions/library-student-member.actions';
// Models
import { LibraryStudentMemberModel } from '../_models/library-student-member.model';
import { QueryParamsModel } from '../../_base/crud';

export interface LibraryStudentMembersState extends EntityState<LibraryStudentMemberModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedLibraryStudentMemberId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<LibraryStudentMemberModel> = createEntityAdapter<LibraryStudentMemberModel>();

export const initialLibraryStudentMembersState: LibraryStudentMembersState = adapter.getInitialState({
  libraryStudentMemberForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedLibraryStudentMemberId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function libraryStudentMembersReducer(state = initialLibraryStudentMembersState, action: LibraryStudentMemberActions): LibraryStudentMembersState {
  switch (action.type) {
    case LibraryStudentMemberActionTypes.LibraryStudentMembersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedLibraryStudentMemberId: undefined
      };
    }
    case LibraryStudentMemberActionTypes.LibraryStudentMemberActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case LibraryStudentMemberActionTypes.LibraryStudentMemberOnServerCreated:
      return {
        ...state
      };
    case LibraryStudentMemberActionTypes.LibraryStudentMemberCreated:
      return adapter.addOne(action.payload.libraryStudentMember, {
        ...state, lastCreatedLibraryStudentMemberId: action.payload.libraryStudentMember.memberId
      });
    case LibraryStudentMemberActionTypes.LibraryStudentMemberUpdated:
      return adapter.updateOne(action.payload.partialLibraryStudentMember, state);
    // case LibraryStudentMemberActionTypes.LibraryStudentMembersStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialLibraryStudentMembers: Update<LibraryStudentMemberModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.libraryStudentMembers.length; i++) {
    //     _partialLibraryStudentMembers.push({
    //       id: action.payload.libraryStudentMembers[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialLibraryStudentMembers, state);
    // }
    case LibraryStudentMemberActionTypes.OneLibraryStudentMemberDeleted:
      return adapter.removeOne(action.payload.id, state);
    case LibraryStudentMemberActionTypes.ManyLibraryStudentMembersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case LibraryStudentMemberActionTypes.LibraryStudentMembersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case LibraryStudentMemberActionTypes.LibraryStudentMembersPageLoaded: {
      return adapter.addMany(action.payload.libraryStudentMembers, {
        ...initialLibraryStudentMembersState,
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

export const getLibraryStudentMemberState = createFeatureSelector<LibraryStudentMemberModel>('libraryStudentMembers');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
