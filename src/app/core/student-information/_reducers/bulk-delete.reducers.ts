// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { BulkDeleteActions, BulkDeleteActionTypes } from '../_actions/bulk-delete.actions';
// Models
import { StudentDtoModel } from '../_models/studentDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface BulkDeletesState extends EntityState<StudentDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedBulkDeleteId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<StudentDtoModel> = createEntityAdapter<StudentDtoModel>();

export const initialBulkDeletesState: BulkDeletesState = adapter.getInitialState({
  bulkDeleteForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedBulkDeleteId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function bulkDeletesReducer(state = initialBulkDeletesState, action: BulkDeleteActions): BulkDeletesState {
  switch (action.type) {
    case BulkDeleteActionTypes.BulkDeletesPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedBulkDeleteId: undefined
      };
    }
    case BulkDeleteActionTypes.BulkDeleteActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case BulkDeleteActionTypes.BulkDeleteOnServerCreated:
      return {
        ...state
      };
    case BulkDeleteActionTypes.BulkDeleteCreated:
      return adapter.addOne(action.payload.bulkDelete, {
        ...state, lastCreatedBulkDeleteId: action.payload.bulkDelete.id
      });
    case BulkDeleteActionTypes.BulkDeleteUpdated:
      return adapter.updateOne(action.payload.partialBulkDelete, state);
    // case BulkDeleteActionTypes.BulkDeletesStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialBulkDeletes: Update<StudentDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.bulkDeletes.length; i++) {
    //     _partialBulkDeletes.push({
    //       id: action.payload.bulkDeletes[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialBulkDeletes, state);
    // }
    case BulkDeleteActionTypes.OneBulkDeleteDeleted:
      return adapter.removeOne(action.payload.id, state);
    case BulkDeleteActionTypes.ManyBulkDeletesDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case BulkDeleteActionTypes.BulkDeletesPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case BulkDeleteActionTypes.BulkDeletesPageLoaded: {
      return adapter.addMany(action.payload.bulkDeletes, {
        ...initialBulkDeletesState,
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

export const getBulkDeleteState = createFeatureSelector<StudentDtoModel>('bulkDeletes');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
