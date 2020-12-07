// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { CategoryActions, CategoryActionTypes } from '../_actions/student-categories.actions';
// Models
import { CategoryDtoModel } from '../_models/categoryDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface CategorysState extends EntityState<CategoryDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedCategoryId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<CategoryDtoModel> = createEntityAdapter<CategoryDtoModel>();

export const initialCategorysState: CategorysState = adapter.getInitialState({
  categoryForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedCategoryId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function categorysReducer(state = initialCategorysState, action: CategoryActions): CategorysState {
  switch (action.type) {
    case CategoryActionTypes.CategorysPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedCategoryId: undefined
      };
    }
    case CategoryActionTypes.CategoryActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case CategoryActionTypes.CategoryOnServerCreated:
      return {
        ...state
      };
    case CategoryActionTypes.CategoryCreated:
      return adapter.addOne(action.payload.category, {
        ...state, lastCreatedCategoryId: action.payload.category.id
      });
    case CategoryActionTypes.CategoryUpdated:
      return adapter.updateOne(action.payload.partialCategory, state);
    // case CategoryActionTypes.CategorysStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialCategorys: Update<CategoryDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.categorys.length; i++) {
    //     _partialCategorys.push({
    //       id: action.payload.categorys[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialCategorys, state);
    // }
    case CategoryActionTypes.OneCategoryDeleted:
      return adapter.removeOne(action.payload.id, state);
    case CategoryActionTypes.ManyCategorysDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case CategoryActionTypes.CategorysPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case CategoryActionTypes.CategorysPageLoaded: {
      return adapter.addMany(action.payload.categorys, {
        ...initialCategorysState,
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

export const getCategoryState = createFeatureSelector<CategoryDtoModel>('categorys');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
