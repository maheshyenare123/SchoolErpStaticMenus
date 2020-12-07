// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { AssignClassTeacherActions, AssignClassTeacherActionTypes } from '../_actions/assign-class-teacher.actions';
// Models
import { AssignClassTeacherModel } from '../_models/assign-class-teacher.model';
import { QueryParamsModel } from '../../_base/crud';

export interface AssignClassTeachersState extends EntityState<AssignClassTeacherModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedAssignClassTeacherId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<AssignClassTeacherModel> = createEntityAdapter<AssignClassTeacherModel>();

export const initialAssignClassTeachersState: AssignClassTeachersState = adapter.getInitialState({
  assignClassTeacherForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedAssignClassTeacherId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function assignClassTeachersReducer(state = initialAssignClassTeachersState, action: AssignClassTeacherActions): AssignClassTeachersState {
  switch (action.type) {
    case AssignClassTeacherActionTypes.AssignClassTeachersPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedAssignClassTeacherId: undefined
      };
    }
    case AssignClassTeacherActionTypes.AssignClassTeacherActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case AssignClassTeacherActionTypes.AssignClassTeacherOnServerCreated:
      return {
        ...state
      };
    case AssignClassTeacherActionTypes.AssignClassTeacherCreated:
      return adapter.addOne(action.payload.assignClassTeacher, {
        ...state, lastCreatedAssignClassTeacherId: action.payload.assignClassTeacher.id
      });
    case AssignClassTeacherActionTypes.AssignClassTeacherUpdated:
      return adapter.updateOne(action.payload.partialAssignClassTeacher, state);
    // case AssignClassTeacherActionTypes.AssignClassTeachersStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialAssignClassTeachers: Update<AssignClassTeacherModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.assignClassTeachers.length; i++) {
    //     _partialAssignClassTeachers.push({
    //       id: action.payload.assignClassTeachers[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialAssignClassTeachers, state);
    // }
    case AssignClassTeacherActionTypes.OneAssignClassTeacherDeleted:
      return adapter.removeOne(action.payload.id, state);
    case AssignClassTeacherActionTypes.ManyAssignClassTeachersDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case AssignClassTeacherActionTypes.AssignClassTeachersPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case AssignClassTeacherActionTypes.AssignClassTeachersPageLoaded: {
      return adapter.addMany(action.payload.assignClassTeachers, {
        ...initialAssignClassTeachersState,
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

export const getAssignClassTeacherState = createFeatureSelector<AssignClassTeacherModel>('assignClassTeachers');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
