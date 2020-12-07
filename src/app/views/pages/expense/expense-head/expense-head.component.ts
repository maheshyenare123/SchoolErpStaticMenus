
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExpenseHeadsDataSource, ExpenseHeadModel,selectExpenseHeadsActionLoading } from 'src/app/core/expense';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseHeadsPageRequested, OneExpenseHeadDeleted, ManyExpenseHeadsDeleted, ExpenseHeadsStatusUpdated, ExpenseHeadUpdated, ExpenseHeadOnServerCreated, selectLastCreatedExpenseHeadId } from '../../../../core/expense';



@Component({
  selector: 'kt-expense-head',
  templateUrl: './expense-head.component.html',
  styleUrls: ['./expense-head.component.scss']
})
export class ExpenseHeadComponent implements OnInit {

 // Table fields
dataSource: ExpenseHeadsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'expenseHead', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ExpenseHeadModel>(true, []);
expenseHeadsResult: ExpenseHeadModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
expenseHead: ExpenseHeadModel;
expenseHeadForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;




  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService) { }

  ngOnInit() {

	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadExpenseHeadList())
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
				this.loadExpenseHeadList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ExpenseHeadsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.expenseHeadsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadExpenseHeadList();
		}); // Remove this line, just loading imitation

this.addExpenseHead();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load ExpenseHeads List from service through data-source
	 */
	loadExpenseHeadList() {
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
		this.store.dispatch(new ExpenseHeadsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.ExpenseHead = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete ExpenseHead
	 *
	 * @param _item: ExpenseHeadModel
	 */
	deleteExpenseHead(_item: ExpenseHeadModel) {

		const _title = 'ExpenseHead';
		const _description = 'Are you sure to permanently delete selected ExpenseHead?';
		const _waitDesciption = 'ExpenseHead is deleting...';
		const _deleteMessage = ' Selected ExpenseHead has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneExpenseHeadDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadExpenseHeadList();
		});
		

	}

	/**
	 * Show add ExpenseHead dialog
	 */
	addExpenseHead() {
		this.expenseHead=new ExpenseHeadModel();
		this.expenseHead.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit ExpenseHead dialog and save after success close result
	 * @param expenseHead: ExpenseHeadModel
	 */
	editExpenseHead(expenseHead: ExpenseHeadModel) {
		
		this.expenseHead=expenseHead;
		this.createForm();

	}



createForm() {
	debugger;
	this.expenseHeadForm = this.fb.group({
   
    expCategory: [this.expenseHead.expCategory, Validators.required],
    description: [this.expenseHead.description, ],
    isActive: [this.expenseHead.isActive, ],
	isDeleted: [this.expenseHead.isDeleted, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.expenseHeadForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared expenseHead
 */
prepareExpenseHead(): ExpenseHeadModel {
	const controls = this.expenseHeadForm.controls;
	const _expenseHead = new ExpenseHeadModel();
	_expenseHead.id = this.expenseHead.id;
  _expenseHead.expCategory = controls.expCategory.value;
  _expenseHead.description = controls.description.value;
  if(_expenseHead.id>0){
	_expenseHead.isActive = controls.isActive.value;
  }else{
	_expenseHead.isActive = 'yes';
  }
  if(_expenseHead.id>0){
	_expenseHead.isDeleted = controls.isDeleted.value;
  }else{
	_expenseHead.isDeleted = 'yes';
  }
 
	return _expenseHead;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.expenseHeadForm.controls;
	/** check form */
	if (this.expenseHeadForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedExpenseHead = this.prepareExpenseHead();
	if (editedExpenseHead.id > 0) {
		this.updateExpenseHead(editedExpenseHead);
	} else {
		this.createExpenseHead(editedExpenseHead);
	}

	const	_saveMessage= editedExpenseHead.id > 0 ? 'ExpenseHead  has been updated' : 'ExpenseHead has been created';
		
	const _messageType = editedExpenseHead.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadExpenseHeadList();
		this.expenseHeadForm.reset();
		this.addExpenseHead();
		// this.expenseHead.clear();
		// this.createForm();

}
onCancel(){
	this.expenseHeadForm.reset();
	this.addExpenseHead();
	// this.expenseHead.clear();
	// this.createForm();
}
/**
 * Update ExpenseHead
 *
 * @param _expenseHead: ExpenseHeadModel
 */
updateExpenseHead(_expenseHead: ExpenseHeadModel) {
	const updateExpenseHead: Update<ExpenseHeadModel> = {
		id: _expenseHead.id,
		changes: _expenseHead
	};
	this.store.dispatch(new ExpenseHeadUpdated({
		partialExpenseHead: updateExpenseHead,
		expenseHead: _expenseHead
	}));


}

/**
 * Create ExpenseHead
 *
 * @param _expenseHead: ExpenseHeadModel
 */
createExpenseHead(_expenseHead:ExpenseHeadModel) {
	this.store.dispatch(new ExpenseHeadOnServerCreated({ expenseHead: _expenseHead }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedExpenseHeadId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _expenseHead, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}


