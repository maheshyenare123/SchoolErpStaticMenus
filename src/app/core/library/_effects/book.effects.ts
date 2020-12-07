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
import {BookService} from '../_services/book.service';
// State
import {AppState} from '../../reducers';
// Actions
import {
  BookActionToggleLoading,
  BookActionTypes,
  BookCreated,
  BookOnServerCreated,
  BooksPageLoaded,
  BooksPageRequested,
  BooksPageToggleLoading,
  BooksStatusUpdated,
  BookUpdated,
  ManyBooksDeleted,
  OneBookDeleted
} from '../_actions/book.actions';

@Injectable()
export class BookEffects {
  showPageLoadingDistpatcher = new BooksPageToggleLoading({isLoading: true});
  showActionLoadingDistpatcher = new BookActionToggleLoading({isLoading: true});
  hideActionLoadingDistpatcher = new BookActionToggleLoading({isLoading: false});

  @Effect()
  loadBooksPage$ = this.actions$.pipe(
    ofType<BooksPageRequested>(BookActionTypes.BooksPageRequested),
    mergeMap(({payload}) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.booksService.findBooks(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin(requestToServer, lastQuery);
    }),
    map(response => {
      const result: QueryResultsModel = response[0];
      const lastQuery: QueryParamsModel = response[1];
      const data : FindResultsModel= result['data'];
      return new BooksPageLoaded({
        books: data.content,
        totalCount: data.totalPages,
        page: lastQuery
      });
    })
  );

  @Effect()
  deleteBook$ = this.actions$
    .pipe(
      ofType<OneBookDeleted>(BookActionTypes.OneBookDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.booksService.deleteBook(payload.id);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteBooks$ = this.actions$
    .pipe(
      ofType<ManyBooksDeleted>(BookActionTypes.ManyBooksDeleted),
      mergeMap(({payload}) => {
          this.store.dispatch(this.showActionLoadingDistpatcher);
          return this.booksService.deleteBooks(payload.ids);
        }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateBook$ = this.actions$
    .pipe(
      ofType<BookUpdated>(BookActionTypes.BookUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.booksService.updateBook(payload.book);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateBooksStatus$ = this.actions$
    .pipe(
      ofType<BooksStatusUpdated>(BookActionTypes.BooksStatusUpdated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.booksService.updateStatusForBook(payload.books, payload.status);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  createBook$ = this.actions$
    .pipe(
      ofType<BookOnServerCreated>(BookActionTypes.BookOnServerCreated),
      mergeMap(({payload}) => {
        this.store.dispatch(this.showActionLoadingDistpatcher);
        return this.booksService.createBook(payload.book).pipe(
          tap(res => {
            this.store.dispatch(new BookCreated({book: res['data']}));
          })
        );
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  constructor(private actions$: Actions, private booksService: BookService, private store: Store<AppState>) {
  }
}
