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
import {LibraryStudentMemberService} from '../_services/library-student-member.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  LibraryStudentMemberActionToggleLoading,
  LibraryStudentMemberActionTypes,
  LibraryStudentMemberCreated,
  LibraryStudentMemberOnServerCreated,
  LibraryStudentMembersPageLoaded,
  LibraryStudentMembersPageRequested,
  LibraryStudentMembersPageToggleLoading,
  LibraryStudentMembersStatusUpdated,
  LibraryStudentMemberUpdated,
  ManyLibraryStudentMembersDeleted,
  OneLibraryStudentMemberDeleted
} from '../_actions/library-student-member.actions';

@Injectable()
export class LibraryStudentMemberEffects {
  showPageLoadingDistpatcher = new LibraryStudentMembersPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new LibraryStudentMemberActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new LibraryStudentMemberActionToggleLoading({isLoading: false});

  @Effect()
  loadLibraryStudentMembersPage$ = this.actions$.pipe(
    ofType<LibraryStudentMembersPageRequested>(LibraryStudentMemberActionTypes.LibraryStudentMembersPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.libraryStudentMembersService.findLibraryStudentMembers(payload.page,payload.classId,payload.sectionId);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new LibraryStudentMembersPageLoaded({
        libraryStudentMembers: data.content,
    totalCount: data.totalElements,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteLibraryStudentMember$ = this.actions$
    .pipe(
      ofType<OneLibraryStudentMemberDeleted>(LibraryStudentMemberActionTypes.OneLibraryStudentMemberDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.libraryStudentMembersService.deleteLibraryStudentMember(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteLibraryStudentMembers$ = this.actions$
    .pipe(
      ofType<ManyLibraryStudentMembersDeleted>(LibraryStudentMemberActionTypes.ManyLibraryStudentMembersDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.libraryStudentMembersService.deleteLibraryStudentMembers(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateLibraryStudentMember$ = this.actions$
    .pipe(
      ofType<LibraryStudentMemberUpdated>(LibraryStudentMemberActionTypes.LibraryStudentMemberUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryStudentMembersService.updateLibraryStudentMember(payload.libraryStudentMember);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateLibraryStudentMembersStatus$ = this.actions$
    .pipe(
      ofType<LibraryStudentMembersStatusUpdated>(LibraryStudentMemberActionTypes.LibraryStudentMembersStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryStudentMembersService.updateStatusForLibraryStudentMember(payload.libraryStudentMembers, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createLibraryStudentMember$ = this.actions$
    .pipe(
      ofType<LibraryStudentMemberOnServerCreated>(LibraryStudentMemberActionTypes.LibraryStudentMemberOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.libraryStudentMembersService.createLibraryStudentMember(payload.libraryStudentMember).pipe(
          tap(res => {
            this.store.dispatch(new LibraryStudentMemberCreated({libraryStudentMember: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private libraryStudentMembersService: LibraryStudentMemberService, private store: Store<AppState>) {
  }
}
