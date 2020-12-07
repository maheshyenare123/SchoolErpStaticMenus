import {QueryParamsModel} from '../../_base/crud/models/query-models/query-params.model';
import {forkJoin, of} from 'rxjs';
// Angular
import {Injectable} from '@angular/core';
// RxJS
import {map, mergeMap, tap} from 'rxjs/operators';
// NGRX
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
// CRUD
import {QueryResultsModel, FindResultsModel} from '../../_base/crud';
// Services
import {SectionService} from '../_services/section.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  SectionActionToggleLoading,
  SectionActionTypes,
  SectionCreated,
  SectionOnServerCreated,
  SectionsPageLoaded,
  SectionsPageRequested,
  SectionsPageToggleLoading,
  SectionsStatusUpdated,
  SectionUpdated,
  ManySectionsDeleted,
  OneSectionDeleted
} from '../_actions/section.actions';

@Injectable()
export class SectionEffects {
  showPageLoadingDistpatcher = new SectionsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new SectionActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new SectionActionToggleLoading({isLoading: false});

  @Effect()
  loadSectionsPage$ = this.actions$.pipe(
    ofType<SectionsPageRequested>(SectionActionTypes.SectionsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.sectionsService.findSections(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new SectionsPageLoaded({
        sections: data.content,
    totalCount: data.totalPages,
    page: lastQuery
      });
    })
  );
 
  
  @Effect()
  deleteSection$ = this.actions$
    .pipe(
      ofType<OneSectionDeleted>(SectionActionTypes.OneSectionDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.sectionsService.deleteSection(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteSections$ = this.actions$
    .pipe(
      ofType<ManySectionsDeleted>(SectionActionTypes.ManySectionsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.sectionsService.deleteSections(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateSection$ = this.actions$
    .pipe(
      ofType<SectionUpdated>(SectionActionTypes.SectionUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sectionsService.updateSection(payload.section);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateSectionsStatus$ = this.actions$
    .pipe(
      ofType<SectionsStatusUpdated>(SectionActionTypes.SectionsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sectionsService.updateStatusForSection(payload.sections, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createSection$ = this.actions$
    .pipe(
      ofType<SectionOnServerCreated>(SectionActionTypes.SectionOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.sectionsService.createSection(payload.section).pipe(
          tap(res => {
            this.store.dispatch(new SectionCreated({section: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private sectionsService: SectionService, private store: Store<AppState>) {
  }
}
