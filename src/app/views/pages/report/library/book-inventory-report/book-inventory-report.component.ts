import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BooksDataSource, BookModel, BooksPageRequested, OneBookDeleted, ManyBooksDeleted } from 'src/app/core/library';
import { QueryParamsModel, LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
@Component({
  selector: 'kt-book-inventory-report',
  templateUrl: './book-inventory-report.component.html',
  styleUrls: ['./book-inventory-report.component.scss']
})
export class BookInventoryReportComponent implements OnInit {

  // Table fields
  dataSource: BooksDataSource;
  displayedColumns = ['bookTitle', 'bookNumber', 'isbnNumber', 'publisher', 'author', 'subject', 'rackNumber', 'qty', 'available', 'issued', 'bookPrice', 'postDate'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('sort1', {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  filterStatus = '';
  filterCondition = '';
  lastQuery: QueryParamsModel;
  // Selection
  selection = new SelectionModel<BookModel>(true, []);
  booksResult: BookModel[] = [];
  private subscriptions: Subscription[] = [];
  
  
  constructor(public dialog: MatDialog,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private subheaderService: SubheaderService,
               private layoutUtilsService: LayoutUtilsService,
               private store: Store<AppState>) { }
  
  
  /**
   * On init
   */
  ngOnInit() {
   this.getAllBookList()
   // If the user changes the sort order, reset back to the first page.
   const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
   this.subscriptions.push(sortSubscription);
  
   /* Data load will be triggered in two cases:
   - when a pagination event occurs => this.paginator.page
   - when a sort event occurs => this.sort.sortChange
   **/
   const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
     tap(() => this.loadBooksList())
   )
   .subscribe();
   this.subscriptions.push(paginatorSubscriptions);
  
   // Filtration, bind to searchInput
   const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
     // tslint:disable-next-line:max-line-length
     debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
     distinctUntilChanged(), // This operator will eliminate duplicate values
     tap(() => {
       this.paginator.pageIndex = 0;
       this.loadBooksList();
     })
   )
   .subscribe();
   this.subscriptions.push(searchSubscription);
  
   // Init DataSource
   this.dataSource = new BooksDataSource(this.store);
   const entitiesSubscription = this.dataSource.entitySubject.pipe(
     skip(1),
     distinctUntilChanged()
   ).subscribe(res => {
     this.booksResult = res;
     console.log(this.booksResult);
   });
   this.subscriptions.push(entitiesSubscription);
   // First load
   of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
     this.loadBooksList();
   }); // Remove this line, just loading imitation
  }
  getAllBookList() {
    // this.enqService.getList().subscribe((res: any) => {
    //   var data = res['data'];
    //   var content = data['content'];
    //   this.booksResult = content.map((key) => ({ ...key }));
    
    // }, (err) => {
    //   console.log('Error while fetching data');
    //   console.error(err);
    // });
  }

  bookIssueReport() {
		this.router.navigate(["/report/book-issue-report"])
  }

  bookDueReport() {
		this.router.navigate(["/report/book-due-report"])
  }

  bookInventoryReport() {
		this.router.navigate(["/report/book-inventory-report"])
  }

  bookIssueReturnReport() {
		this.router.navigate(["/report/book-issue-return-report"])
  }

/**
 * On Destroy
 */
ngOnDestroy() {
  this.subscriptions.forEach(el => el.unsubscribe());
}

/**
 * Load Products List
 */
loadBooksList() {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new BooksPageRequested({ page: queryParams }));
 
  this.selection.clear();
}

/**
 * Returns object for filter
 */
filterConfiguration(): any {
  const filter: any = {};
  const searchText: string = this.searchInput.nativeElement.value;

  if (this.filterStatus && this.filterStatus.length > 0) {
    filter.status = +this.filterStatus;
  }

  if (this.filterCondition && this.filterCondition.length > 0) {
    filter.condition = +this.filterCondition;
  }

  filter.model = searchText;

  filter.manufacture = searchText;
  filter.color = searchText;
  filter.VINCode = searchText;
  return filter;
}

/**
 * Restore state
 *
 * @param queryParams: QueryParamsModel
 * @param id: number
 */
restoreState(queryParams: QueryParamsModel, id: number) {

  if (!queryParams.filter) {
    return;
  }

  if ('condition' in queryParams.filter) {
    this.filterCondition = queryParams.filter.condition.toString();
  }

  if ('status' in queryParams.filter) {
    this.filterStatus = queryParams.filter.status.toString();
  }

  if (queryParams.filter.model) {
    this.searchInput.nativeElement.value = queryParams.filter.model;
  }
}

}
