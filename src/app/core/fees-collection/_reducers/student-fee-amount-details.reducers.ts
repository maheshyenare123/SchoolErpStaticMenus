// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { StudentFeeAmountDetailsActions, StudentFeeAmountDetailsActionTypes } from '../_actions/student-fee-amount-details.actions';
// Models
import { StudentFeeAmountDetailsModel } from '../_models/student-fee-amount-details.model';
import { QueryParamsModel } from '../../_base/crud';

export interface StudentFeeAmountDetailssState extends EntityState<StudentFeeAmountDetailsModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedStudentFeeAmountDetailsId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentFeeAmountDetailsModel> = createEntityAdapter<StudentFeeAmountDetailsModel>();

export const initialStudentFeeAmountDetailssState: StudentFeeAmountDetailssState = adapter.getInitialState({
  studentFeeAmountDetailsForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedStudentFeeAmountDetailsId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function studentFeeAmountDetailssReducer(state = initialStudentFeeAmountDetailssState, action: StudentFeeAmountDetailsActions): StudentFeeAmountDetailssState {
  switch (action.type) {
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedStudentFeeAmountDetailsId: undefined
      };
    }
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsOnServerCreated:
      return {
        ...state
      };
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsCreated:
      return adapter.addOne(action.payload.studentFeeAmountDetails, {
        ...state, lastCreatedStudentFeeAmountDetailsId: action.payload.studentFeeAmountDetails.feeMastersId
      });
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailsUpdated:
      return adapter.updateOne(action.payload.partialStudentFeeAmountDetails, state);
    // case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialStudentFeeAmountDetailss: Update<StudentFeeAmountDetailsModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.studentFeeAmountDetailss.length; i++) {
    //     _partialStudentFeeAmountDetailss.push({
    //       id: action.payload.studentFeeAmountDetailss[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialStudentFeeAmountDetailss, state);
    // }
    case StudentFeeAmountDetailsActionTypes.OneStudentFeeAmountDetailsDeleted:
      return adapter.removeOne(action.payload.id, state);
    case StudentFeeAmountDetailsActionTypes.ManyStudentFeeAmountDetailssDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case StudentFeeAmountDetailsActionTypes.StudentFeeAmountDetailssPageLoaded: {
      return adapter.addMany(action.payload.studentFeeAmountDetailss, {
        ...initialStudentFeeAmountDetailssState,
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

export const getStudentFeeAmountDetailsState = createFeatureSelector<StudentFeeAmountDetailsModel>('studentFeeAmountDetailss');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
