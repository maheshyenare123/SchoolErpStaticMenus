// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// Lodash
import { each } from 'lodash';
// CRUD
import { QueryResultsModel, HttpExtenstionsModel } from '../../_base/crud';
// State
import { SectionsState } from '../_reducers/section.reducers';
import { SectionDtoModel } from '../_models/sectionDto.model';

export const selectSectionsState = createFeatureSelector<SectionsState>('sections');

export const selectSectionById = (sectionId: number) => createSelector(
    selectSectionsState,
    sectionsState => sectionsState.entities[sectionId]
);

export const selectSectionsPageLoading = createSelector(
    selectSectionsState,
    sectionsState => sectionsState.listLoading
);

export const selectSectionsActionLoading = createSelector(
    selectSectionsState,
    sectionsState => sectionsState.actionsloading
);

export const selectLastCreatedSectionId = createSelector(
    selectSectionsState,
    sectionsState => sectionsState.lastCreatedSectionId
);

export const selectSectionsShowInitWaitingMessage = createSelector(
    selectSectionsState,
    sectionsState => sectionsState.showInitWaitingMessage
);

export const selectSectionsInStore = createSelector(
    selectSectionsState,
    sectionsState => {
      const items: SectionDtoModel[] = [];
      each(sectionsState.entities, element => {
        items.push(element);
      });
      const httpExtension = new HttpExtenstionsModel();
      const result: SectionDtoModel[] =
        httpExtension.sortArray(items, sectionsState.lastQuery.sortField, sectionsState.lastQuery.sortOrder);
      return new QueryResultsModel(result, sectionsState.totalCount, '');
    }
);
