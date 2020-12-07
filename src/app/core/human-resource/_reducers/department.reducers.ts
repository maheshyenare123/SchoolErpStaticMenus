// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { DepartmentActions, DepartmentActionTypes } from '../_actions/department.actions';
// Models
import { DepartmentModel } from '../_models/department.model';
import { QueryParamsModel } from '../../_base/crud';

export interface DepartmentsState extends EntityState<DepartmentModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedDepartmentId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<DepartmentModel> = createEntityAdapter<DepartmentModel>();

export const initialDepartmentsState: DepartmentsState = adapter.getInitialState({
  departmentForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedDepartmentId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function departmentsReducer(state = initialDepartmentsState, action: DepartmentActions): DepartmentsState {
  switch (action.type) {
    case DepartmentActionTypes.DepartmentsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedDepartmentId: undefined
      };
    }
    case DepartmentActionTypes.DepartmentActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case DepartmentActionTypes.DepartmentOnServerCreated:
      return {
        ...state
      };
    case DepartmentActionTypes.DepartmentCreated:
      return adapter.addOne(action.payload.department, {
        ...state, lastCreatedDepartmentId: action.payload.department.id
      });
    case DepartmentActionTypes.DepartmentUpdated:
      return adapter.updateOne(action.payload.partialDepartment, state);
    // case DepartmentActionTypes.DepartmentsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialDepartments: Update<DepartmentModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.departments.length; i++) {
    //     _partialDepartments.push({
    //       id: action.payload.departments[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialDepartments, state);
    // }
    case DepartmentActionTypes.OneDepartmentDeleted:
      return adapter.removeOne(action.payload.id, state);
    case DepartmentActionTypes.ManyDepartmentsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case DepartmentActionTypes.DepartmentsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case DepartmentActionTypes.DepartmentsPageLoaded: {
      return adapter.addMany(action.payload.departments, {
        ...initialDepartmentsState,
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

export const getDepartmentState = createFeatureSelector<DepartmentModel>('departments');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
