// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { DisabledStudentActions, DisabledStudentActionTypes } from '../_actions/disabled-student.actions';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface DisabledStudentsState extends EntityState<StudentDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedDisabledStudentId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentDtoModel> = createEntityAdapter<StudentDtoModel>();

export const initialDisabledStudentsState: DisabledStudentsState = adapter.getInitialState({
  disabledStudentForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedDisabledStudentId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function disabledStudentsReducer(state = initialDisabledStudentsState, action: DisabledStudentActions): DisabledStudentsState {
  switch (action.type) {
    case DisabledStudentActionTypes.DisabledStudentsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedDisabledStudentId: undefined
      };
    }
    case DisabledStudentActionTypes.DisabledStudentActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case DisabledStudentActionTypes.DisabledStudentOnServerCreated:
      return {
        ...state
      };
    case DisabledStudentActionTypes.DisabledStudentCreated:
      return adapter.addOne(action.payload.disabledStudent, {
        ...state, lastCreatedDisabledStudentId: action.payload.disabledStudent.id
      });
    case DisabledStudentActionTypes.DisabledStudentUpdated:
      return adapter.updateOne(action.payload.partialDisabledStudent, state);
    // case DisabledStudentActionTypes.DisabledStudentsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialDisabledStudents: Update<StudentDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.disabledStudents.length; i++) {
    //     _partialDisabledStudents.push({
    //       id: action.payload.disabledStudents[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialDisabledStudents, state);
    // }
    case DisabledStudentActionTypes.OneDisabledStudentDeleted:
      return adapter.removeOne(action.payload.id, state);
    case DisabledStudentActionTypes.ManyDisabledStudentsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case DisabledStudentActionTypes.DisabledStudentsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case DisabledStudentActionTypes.DisabledStudentsPageLoaded: {
      return adapter.addMany(action.payload.disabledStudents, {
        ...initialDisabledStudentsState,
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

export const getDisabledStudentState = createFeatureSelector<StudentDtoModel>('disabledStudents');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
