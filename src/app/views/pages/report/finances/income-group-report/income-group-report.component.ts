import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IncomesDataSource, IncomeModel, selectIncomesActionLoading, IncomeService, IncomeHeadModel, IncomeHeadService } from '../../../../../core/income';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from '../../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { IncomesPageRequested, OneIncomeDeleted, ManyIncomesDeleted, IncomesStatusUpdated, IncomeUpdated, IncomeOnServerCreated, selectLastCreatedIncomeId } from '../../../../../core/income';


@Component({
  selector: 'kt-income-group-report',
  templateUrl: './income-group-report.component.html',
  styleUrls: ['./income-group-report.component.scss']
})
export class IncomeGroupReportComponent implements OnInit {
  // Table fields
  dataSource: IncomesDataSource;
  //  dataSource = new MatTableDataSource(ELEMENT_DATA);


  displayedColumns = ['id', 'incomeHead', 'name', 'invoiceNo', 'date', 'amount'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  // Filter fields
  // @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  filterStatus = '';
  filterType = '';
  // Selection
  selection = new SelectionModel<IncomeModel>(true, []);
  incomesResult: IncomeModel[] = [];
  incomeForFill: IncomeModel[] = [];
  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Public properties
  income: IncomeModel;
  incomeForm: FormGroup;
  searchForm: FormGroup;
  hasFormErrors = false;
  viewLoading = false;
  // Private properties
  private componentSubscriptions: Subscription;

  searchType: string;
  searchText: string;

  incomeHeadList: IncomeHeadModel[] = [];

  constructor(public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private typesUtilsService: TypesUtilsService,
    private incomeService: IncomeService,
    private router: Router,
    private incomeHeadService: IncomeHeadService) { }

  ngOnInit() {
    this.createForm();
    // Init DataSource
    this.dataSource = new IncomesDataSource(this.store);
    this.loadAllIncomeHead();
  }

  feesStatement() {
    this.router.navigate(["/report/fees-statement"])
  }

  balanceFeesReport() {
    this.router.navigate(["/report/balance-fees-report"])
  }

  feesCollectionReport() {
    this.router.navigate(["/report/fees-collection-report"])
  }

  onlineFeesCollectionReport() {
    this.router.navigate(["/report/online-fees-collection-report"])
  }

  incomeReport() {
    this.router.navigate(["/report/income-report"])
  }

  expenseReport() {
    this.router.navigate(["/report/expense-report"])
  }

  payrollReport() {
    this.router.navigate(["/report/payroll-report"])
  }

  incomeGroupReport() {
    this.router.navigate(["/report/income-group-report"])
  }

  expenseGroupReport() {
    this.router.navigate(["/report/expense-group-report"])
  }

  loadAllIncomeHead() {
    debugger
    this.incomeHeadService.getAllIncomeHeads().subscribe(res => {
      const data = res['data'];
      this.incomeHeadList = data['content'];
      console.log(this.incomeHeadList)
    }, err => {
    });
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

    this.getAllIncomeList(controls.searchType.value);


  }

  getAllIncomeList(searchType) {


    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadIncomeList(searchType))
    )
      .subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    // // Filtration, bind to searchInput
    // const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
    //   // tslint:disable-next-line:max-line-length
    //   debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
    //   distinctUntilChanged(), // This operator will eliminate duplicate values
    //   tap(() => {
    //     this.paginator.pageIndex = 0;
    //     this.loadStudentsList(classId,sectionId);
    //   })
    // )
    // .subscribe();
    // this.subscriptions.push(searchSubscription);

    // Init DataSource
    this.dataSource = new IncomesDataSource(this.store);
    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      this.incomesResult = res;
      console.log(this.incomesResult);
    });
    this.subscriptions.push(entitiesSubscription);
    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadIncomeList(searchType);
    }); // Remove this line, just loading imitation

  }

  /**
     * On Destroy
     */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  /**
   * Load Incomes List from service through data-source
   */
  loadIncomeList(searchType) {
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
    this.store.dispatch(new IncomesPageRequested({ page: queryParams, searchTerm: searchType }));
    this.selection.clear();
  }



  /**
   * Returns object for filter
   */
  filterConfiguration(): any {
    const filter: any = {};
    // const searchText: string = this.searchInput.nativeElement.value;
    const searchText: string = '';
    filter.class = searchText;
    if (!searchText) {
      return filter;
    }
    filter.Income = searchText;
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

