
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BookIssueReturnsDataSource, BookIssueReturnModel, selectBookIssueReturnsActionLoading, BookService, BookModel } from 'src/app/core/library';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookIssueReturnsPageRequested, OneBookIssueReturnDeleted, ManyBookIssueReturnsDeleted, BookIssueReturnsStatusUpdated, BookIssueReturnUpdated, BookIssueReturnOnServerCreated, selectLastCreatedBookIssueReturnId } from '../../../../../core/library';



@Component({
  selector: 'kt-book-issue-report',
  templateUrl: './book-issue-report.component.html',
  styleUrls: ['./book-issue-report.component.scss']
})
export class BookIssueReportComponent implements OnInit {
		// Table fields
    dataSource: BookIssueReturnsDataSource;
    //  dataSource = new MatTableDataSource(ELEMENT_DATA);
    displayedColumns = ['bookTitle', 'bookNumber', 'issueDate', 'dueReturnDate', 'returnDate', 'memberId', 'libraryCardNo', 'admissionNo', 'issueBy', 'membersType'];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('sort1', { static: true }) sort: MatSort;
    // Filter fields
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
    filterStatus = '';
    filterType = '';
    // Selection
    selection = new SelectionModel<BookIssueReturnModel>(true, []);
    bookIssueReturnsResult: BookIssueReturnModel[] = [];
    // Subscriptions
    private subscriptions: Subscription[] = [];
  
    // Public properties
    bookIssueReturn: BookIssueReturnModel;
    bookIssueReturnForm: FormGroup;
    hasFormErrors = false;
    viewLoading = false;
    // Private properties
    private componentSubscriptions: Subscription;
    libraryMember: BookIssueReturnModel;
    showReturnDate: boolean = false;
    searchForm: FormGroup;
    searchType: string;
    searchText: string;
  
    constructor(public dialog: MatDialog,
      public snackBar: MatSnackBar,
      private layoutUtilsService: LayoutUtilsService,
      private translate: TranslateService,
      private store: Store<AppState>,
      private fb: FormBuilder,
      private typesUtilsService: TypesUtilsService,
      public bookService: BookService,
      private router: Router,) { }
  
    ngOnInit() {
  
     // Init DataSource
     this.dataSource = new BookIssueReturnsDataSource(this.store);
      this.createForm();
  
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
  
    onSearch() {
      debugger;
      this.hasFormErrors = false;
      const controls = this.searchForm.controls;
      /** check form */
      if (this.searchForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
  
        this.hasFormErrors = true;
        return;
      }
  
      this.getAllBookIssueReturnList(controls.searchType.value);
  
  
    }
  
  
    getAllBookIssueReturnList(searchType){
      const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
      this.subscriptions.push(sortSubscription);
  
      /* Data load will be triggered in two cases:
      - when a pagination event occurs => this.paginator.page
      - when a sort event occurs => this.sort.sortChange
      **/
      const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
        tap(() => this.loadBookIssueReturnList(this.libraryMember.libararyMemberId))
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
          this.loadBookIssueReturnList(this.libraryMember.libararyMemberId);
        })
      )
        .subscribe();
      this.subscriptions.push(searchSubscription);
  
      // Init DataSource
      this.dataSource = new BookIssueReturnsDataSource(this.store);
  
      const entitiesSubscription = this.dataSource.entitySubject.pipe(
        skip(1),
        distinctUntilChanged()
      ).subscribe(res => {
        debugger
        console.log(res);
        this.bookIssueReturnsResult = res;
      });
      this.subscriptions.push(entitiesSubscription);
      // First load
      of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
        this.loadBookIssueReturnList(this.libraryMember.libararyMemberId);
      }); // Remove this line, just loading imitation
  
    }
  
  
  
    /**
       * On Destroy
       */
    ngOnDestroy() {
      this.subscriptions.forEach(el => el.unsubscribe());
    }
  
    /**
     * Load BookIssueReturns List from service through data-source
     */
    loadBookIssueReturnList(id) {
      debugger;
      this.selection.clear();
      const queryParams = new QueryParamsModel(
        this.filterConfiguration(),
        this.sort.direction,
        this.sort.active,
        this.paginator.pageIndex,
        this.paginator.pageSize
      );
      // Call request from server
      this.store.dispatch(new BookIssueReturnsPageRequested({ page: queryParams, id: id }));
      this.selection.clear();
    }
  
    /**
     * Returns object for filter
     */
    filterConfiguration(): any {
      const filter: any = {};
      const searchText: string = this.searchInput.nativeElement.value;
  
      filter.visitorsPurpose = searchText;
      if (!searchText) {
        return filter;
      }
      filter.description = searchText;
      return filter;
    }
    
    createForm() {
      debugger;
      this.searchForm = this.fb.group({
        searchType: [this.searchType,],
        searchText: [this.searchText,],
      })
    }
  
  }