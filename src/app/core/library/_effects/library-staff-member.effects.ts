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
import {LibraryStaffMemberService} from '../_services/library-staff-member.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  LibraryStaffMemberActionToggleLoading,
  LibraryStaffMemberActionTypes,
  LibraryStaffMemberCreated,
  LibraryStaffMemberOnServerCreated,
  LibraryStaffMembersPageLoaded,
  LibraryStaffMembersPageRequested,
  LibraryStaffMembersPageToggleLoading,
  LibraryStaffMembersStatusUpdated,
  LibraryStaffMemberUpdated,
  ManyLibraryStaffMembersDeleted,
  OneLibraryStaffMemberDeleted
} from '../_actions/library-staff-member.actions';

@Injectable()
export class LibraryStaffMemberEffects {
  showPageLoadingDistpatcher = new LibraryStaffMembersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new LibraryStaffMemberActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new LibraryStaffMemberActionToggleLoading({isLoading: false});

  @Effect()
  loadLibraryStaffMembersPage$ = this.actions$.pipe(
    ofType<LibraryStaffMembersPageRequested>(LibraryStaffMemberActionTypes.LibraryStaffMembersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.libraryStaffMembersService.findLibraryStaffMembers(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new LibraryStaffMembersPageLoaded({
        libraryStaffMembers: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteLibraryStaffMember$ = this.actions$
    .pipe(
      ofType<OneLibraryStaffMemberDeleted>(LibraryStaffMemberActionTypes.OneLibraryStaffMemberDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.libraryStaffMembersService.deleteLibraryStaffMember(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteLibraryStaffMembers$ = this.actions$
    .pipe(
      ofType<ManyLibraryStaffMembersDeleted>(LibraryStaffMemberActionTypes.ManyLibraryStaffMembersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.libraryStaffMembersService.deleteLibraryStaffMembers(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateLibraryStaffMember$ = this.actions$
    .pipe(
      ofType<LibraryStaffMemberUpdated>(LibraryStaffMemberActionTypes.LibraryStaffMemberUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryStaffMembersService.updateLibraryStaffMember(payload.libraryStaffMember);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateLibraryStaffMembersStatus$ = this.actions$
    .pipe(
      ofType<LibraryStaffMembersStatusUpdated>(LibraryStaffMemberActionTypes.LibraryStaffMembersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryStaffMembersService.updateStatusForLibraryStaffMember(payload.libraryStaffMembers, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createLibraryStaffMember$ = this.actions$
    .pipe(
      ofType<LibraryStaffMemberOnServerCreated>(LibraryStaffMemberActionTypes.LibraryStaffMemberOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryStaffMembersService.createLibraryStaffMember(payload.libraryStaffMember).pipe(
          tap(res => {
            this.store.dispatch(new LibraryStaffMemberCreated({libraryStaffMember: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private libraryStaffMembersService: LibraryStaffMemberService, private store: Store<AppState>) {
  }
}
