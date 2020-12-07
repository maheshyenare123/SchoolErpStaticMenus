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
import {LibraryMemberListService} from '../_services/library-member-list.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  LibraryMemberListActionToggleLoading,
  LibraryMemberListActionTypes,
  LibraryMemberListCreated,
  LibraryMemberListOnServerCreated,
  LibraryMemberListsPageLoaded,
  LibraryMemberListsPageRequested,
  LibraryMemberListsPageToggleLoading,
  LibraryMemberListsStatusUpdated,
  LibraryMemberListUpdated,
  ManyLibraryMemberListsDeleted,
  OneLibraryMemberListDeleted
} from '../_actions/library-member-list.actions';

@Injectable()
export class LibraryMemberListEffects {
  showPageLoadingDistpatcher = new LibraryMemberListsPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new LibraryMemberListActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new LibraryMemberListActionToggleLoading({isLoading: false});

  @Effect()
  loadLibraryMemberListsPage$ = this.actions$.pipe(
    ofType<LibraryMemberListsPageRequested>(LibraryMemberListActionTypes.LibraryMemberListsPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.libraryMemberListsService.findLibraryMemberLists(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new LibraryMemberListsPageLoaded({
        libraryMemberLists: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteLibraryMemberList$ = this.actions$
    .pipe(
      ofType<OneLibraryMemberListDeleted>(LibraryMemberListActionTypes.OneLibraryMemberListDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.libraryMemberListsService.deleteLibraryMemberList(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteLibraryMemberLists$ = this.actions$
    .pipe(
      ofType<ManyLibraryMemberListsDeleted>(LibraryMemberListActionTypes.ManyLibraryMemberListsDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.libraryMemberListsService.deleteLibraryMemberLists(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateLibraryMemberList$ = this.actions$
    .pipe(
      ofType<LibraryMemberListUpdated>(LibraryMemberListActionTypes.LibraryMemberListUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryMemberListsService.updateLibraryMemberList(payload.libraryMemberList);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateLibraryMemberListsStatus$ = this.actions$
    .pipe(
      ofType<LibraryMemberListsStatusUpdated>(LibraryMemberListActionTypes.LibraryMemberListsStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryMemberListsService.updateStatusForLibraryMemberList(payload.libraryMemberLists, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createLibraryMemberList$ = this.actions$
    .pipe(
      ofType<LibraryMemberListOnServerCreated>(LibraryMemberListActionTypes.LibraryMemberListOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryMemberListsService.createLibraryMemberList(payload.libraryMemberList).pipe(
          tap(res => {
            this.store.dispatch(new LibraryMemberListCreated({libraryMemberList: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private libraryMemberListsService: LibraryMemberListService, private store: Store<AppState>) {
  }
}
