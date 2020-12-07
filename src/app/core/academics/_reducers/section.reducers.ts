// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
// Actions
import { SectionActions, SectionActionTypes } from '../_actions/section.actions';
// Models
import { SectionDtoModel } from '../_models/sectionDto.model';
import { QueryParamsModel } from '../../_base/crud';

export interface SectionsState extends EntityState<SectionDtoModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastCreatedSectionId: number;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<SectionDtoModel> = createEntityAdapter<SectionDtoModel>();

export const initialSectionsState: SectionsState = adapter.getInitialState({
  sectionForEdit: null,
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastCreatedSectionId: undefined,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function sectionsReducer(state = initialSectionsState, action: SectionActions): SectionsState {
  switch (action.type) {
    case SectionActionTypes.SectionsPageToggleLoading: {
      return {
        ...state, listLoading: action.payload.isLoading, lastCreatedSectionId: undefined
      };
    }
    case SectionActionTypes.SectionActionToggleLoading: {
      return {
        ...state, actionsloading: action.payload.isLoading
      };
    }
    case SectionActionTypes.SectionOnServerCreated:
      return {
        ...state
      };
    case SectionActionTypes.SectionCreated:
      return adapter.addOne(action.payload.section, {
        ...state, lastCreatedSectionId: action.payload.section.id
      });
    case SectionActionTypes.SectionUpdated:
      return adapter.updateOne(action.payload.partialSection, state);
    // case SectionActionTypes.SectionsStatusUpdated: {
    //   // tslint:disable-next-line
    //   const _partialSections: Update<SectionDtoModel>[] = [];
    //   // tslint:disable-next-line:prefer-const
    //   // tslint:disable-next-line
    //   for (let i = 0; i < action.payload.sections.length; i++) {
    //     _partialSections.push({
    //       id: action.payload.sections[i].id,
    //       changes: {
    //         status: action.payload.status
    //       }
    //     });
    //   }
    //   return adapter.updateMany(_partialSections, state);
    // }
    case SectionActionTypes.OneSectionDeleted:
      return adapter.removeOne(action.payload.id, state);
    case SectionActionTypes.ManySectionsDeleted:
      return adapter.removeMany(action.payload.ids, state);
    case SectionActionTypes.SectionsPageCancelled: {
      return {
        ...state, listLoading: false, lastQuery: new QueryParamsModel({})
      };
    }
    case SectionActionTypes.SectionsPageLoaded: {
      return adapter.addMany(action.payload.sections, {
        ...initialSectionsState,
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

export const getSectionState = createFeatureSelector<SectionDtoModel>('sections');

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
