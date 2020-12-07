// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentFeeDepositeActions, StudentFeeDepositeActionTypes } from '../_actions/student-fee-deposite.actions';
// Models
import { StudentFeeDepositeModel } from '../_models/student-fee-deposite.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentFeeDepositesState extends EntityState<StudentFeeDepositeModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentFeeDepositeId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentFeeDepositeModel> = createEntityAdapter<StudentFeeDepositeModel>();

export const initialStudentFeeDepositesState: StudentFeeDepositesState = adapter.getInitialState({
  studentFeeDepositeForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentFeeDepositeId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentFeeDepositesReducer(state = initialStudentFeeDepositesState, action: StudentFeeDepositeActions): StudentFeeDepositesState {
  switch (action.type) {
    case StudentFeeDepositeActionTypes.StudentFeeDepositesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentFeeDepositeId: undefined
      };
    }
    case StudentFeeDepositeActionTypes.StudentFeeDepositeActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentFeeDepositeActionTypes.StudentFeeDepositeOnServerCreated:
      return {
        ...state
      };
    case StudentFeeDepositeActionTypes.StudentFeeDepositeCreated:
      return adapter.addOne(action.payload.studentFeeDeposite, {
        ...state, lastCreatedStudentFeeDepositeId: action.payload.studentFeeDeposite.feeGroupId
      });
    case StudentFeeDepositeActionTypes.StudentFeeDepositeUpdated:
      return adapter.updateOne(action.payload.partialStudentFeeDeposite, state);
    // case StudentFeeDepositeActionTypes.StudentFeeDepositesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStudentFeeDeposites: Update<StudentFeeDepositeModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.studentFeeDeposites.length; i++) {
    //     _partialStudentFeeDeposites.push({
    //       id: action.payload.studentFeeDeposites[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStudentFeeDeposites, state);
    // }
    case StudentFeeDepositeActionTypes.OneStudentFeeDepositeDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentFeeDepositeActionTypes.ManyStudentFeeDepositesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentFeeDepositeActionTypes.StudentFeeDepositesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentFeeDepositeActionTypes.StudentFeeDepositesPageLoaded: {
      return adapter.addMany(action.payload.studentFeeDeposites, {
        ...initialStudentFeeDepositesState,
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

export const getStudentFeeDepositeState = createFeatureSelector<StudentFeeDepositeModel>('studentFeeDeposites');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
