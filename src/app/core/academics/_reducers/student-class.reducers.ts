// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentClassActions, StudentClassActionTypes } from '../_actions/student-class.actions';
// Models
import { StudentClassModel } from '../_models/student-class.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentClasssState extends EntityState<StudentClassModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentClassId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentClassModel> = createEntityAdapter<StudentClassModel>();

export const initialStudentClasssState: StudentClasssState = adapter.getInitialState({
  studentClassForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentClassId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentClasssReducer(state = initialStudentClasssState, action: StudentClassActions): StudentClasssState {
  switch (action.type) {
    case StudentClassActionTypes.StudentClasssPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentClassId: undefined
      };
    }
    case StudentClassActionTypes.StudentClassActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentClassActionTypes.StudentClassOnServerCreated:
      return {
        ...state
      };
    case StudentClassActionTypes.StudentClassCreated:
      return adapter.addOne(action.payload.studentClass, {
        ...state, lastCreatedStudentClassId: action.payload.studentClass.id
      });
    case StudentClassActionTypes.StudentClassUpdated:
      return adapter.updateOne(action.payload.partialStudentClass, state);
    // case StudentClassActionTypes.StudentClasssStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStudentClasss: Update<StudentClassModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.studentClasss.length; i++) {
    //     _partialStudentClasss.push({
    //       id: action.payload.studentClasss[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStudentClasss, state);
    // }
    case StudentClassActionTypes.OneStudentClassDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentClassActionTypes.ManyStudentClasssDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentClassActionTypes.StudentClasssPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentClassActionTypes.StudentClasssPageLoaded: {
      return adapter.addMany(action.payload.studentClasss, {
        ...initialStudentClasssState,
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

export const getStudentClassState = createFeatureSelector<StudentClassModel>('studentClasss');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
