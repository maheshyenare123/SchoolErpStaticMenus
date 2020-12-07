
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IncomesDataSource, IncomeModel, selectIncomesActionLoading, IncomeService } from '../../../../core/income';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { IncomesPageRequested, OneIncomeDeleted, ManyIncomesDeleted, IncomesStatusUpdated, IncomeUpdated, IncomeOnServerCreated, selectLastCreatedIncomeId } from '../../../../core/income';


@Component({
  selector: 'kt-search-income',
  templateUrl: './search-income.component.html',
  styleUrls: ['./search-income.component.scss']
})
export class SearchIncomeComponent implements OnInit {

 // Table fields
 dataSource: IncomesDataSource;
 //  dataSource = new MatTableDataSource(ELEMENT_DATA);


 displayedColumns = ['id', 'name', 'invoiceNo', 'incomeHead', 'date', 'amount'];
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



 markAsHoliday:boolean=false;
 constructor(public dialog: MatDialog,
   public snackBar: MatSnackBar,
   private layoutUtilsService: LayoutUtilsService,
   private translate: TranslateService,
   private store: Store<AppState>,
   private fb: FormBuilder,
   private typesUtilsService: TypesUtilsService,
   private incomeService:IncomeService) { }

 ngOnInit() {


   this.addIncome();
   // Init DataSource
   this.dataSource = new IncomesDataSource(this.store);

 }

//get All Class List

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

getAllIncomeList(searchType){


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
    this.store.dispatch(new IncomesPageRequested({ page: queryParams, searchTerm: searchType}));
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

 /** ACTIONS */
 /**
  * Delete Income
  *
  * @param _item: IncomeModel
  */
 deleteIncome(_item: IncomeModel) {

   const _title = 'Purpose';
   const _description = 'Are you sure to permanently delete selected purpose?';
   const _waitDesciption = 'Purpose is deleting...';
   const _deleteMessage = ' Selected purpose has been deleted';



   const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
   dialogRef.afterClosed().subscribe(res => {
     if (!res) {
       return;
     }

     this.store.dispatch(new OneIncomeDeleted({ id: _item.id }));
     this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

   });


 }

 /**
  * Show add Income dialog
  */
 addIncome() {
   this.income = new IncomeModel();
   this.income.clear(); //
   this.createForm();

 }

 /**
  * Show Edit Income dialog and save after success close result
  * @param Income: IncomeModel
  */
 editIncome(income: IncomeModel) {

   this.income = income;
   this.createForm();

 }



 createForm() {
   debugger;
   this.searchForm = this.fb.group({
     searchType: [this.searchType, ],
     searchText: [this.searchText, ],
   })
 }


 /**
  * Check control is invalid
  * @param controlName: string
  */
 isControlInvalid(controlName: string): boolean {
   const control = this.incomeForm.controls[controlName];
   const result = control.invalid && control.touched;
   return result;
 }

 /** ACTIONS */

 /**
  * Returns prepared Income
  */
 prepareIncome(): IncomeModel {
   const controls = this.incomeForm.controls;
   const _income = new IncomeModel();
   _income.id = this.income.id;

   
   return _income;
 }

 /**
  * On Submit
  */
 onSubmit() {
   this.hasFormErrors = false;
   const controls = this.incomeForm.controls;
   /** check form */
   if (this.incomeForm.invalid) {
     Object.keys(controls).forEach(controlName =>
       controls[controlName].markAsTouched()
     );

     this.hasFormErrors = true;
     return;
   }

   const editedIncome = this.prepareIncome();
   if (editedIncome.id > 0) {
     this.updateIncome(editedIncome);
   } else {
     this.createIncome(editedIncome);
   }

   const _saveMessage = editedIncome.id > 0 ? 'Purpose  has been updated' : 'Purpose has been created';

   const _messageType = editedIncome.id > 0 ? MessageType.Update : MessageType.Create;

   this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

   this.incomeForm.reset();

   this.addIncome();
   // this.income.clear();
   // this.createForm();

 }
 onCancel() {
   this.incomeForm.reset();
   this.addIncome();
   // this.income.clear();
   // this.createForm();
 }




 /**
  * Update Income
  *
  * @param _income: IncomeModel
  */
 updateIncome(_income: IncomeModel) {
   const updateIncome: Update<IncomeModel> = {
     id: _income.id,
     changes: _income
   };
   this.store.dispatch(new IncomeUpdated({
     partialIncome: updateIncome,
     income: _income
   }));


 }

 /**
  * Create Income
  *
  * @param _income: IncomeModel
  */
 createIncome(_income: IncomeModel) {
   this.store.dispatch(new IncomeOnServerCreated({ income: _income }));
   this.componentSubscriptions = this.store.pipe(
     select(selectLastCreatedIncomeId),
     // delay(1000), // Remove this line
   ).subscribe(res => {
     if (!res) {
       return;
     }

     // this.dialogRef.close({ _income, isEdit: false });
   });
 }

 /** Alect Close event */
 onAlertClose($event) {
   this.hasFormErrors = false;
 }

}
// export class NgbdTimepickerSteps {
//     time: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
//     hourStep = 1;
//     minuteStep = 15;
//     secondStep = 30;
// }

