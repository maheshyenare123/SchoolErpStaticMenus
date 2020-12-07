import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExpensesDataSource, ExpenseModel,selectExpensesActionLoading, ExpenseHeadService, ExpenseHeadModel } from 'src/app/core/expense';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService  } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesPageRequested, OneExpenseDeleted, ManyExpensesDeleted, ExpensesStatusUpdated, ExpenseUpdated, ExpenseOnServerCreated, selectLastCreatedExpenseId } from '../../../../core/expense';


@Component({
  selector: 'kt-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {

  // Table fields
dataSource: ExpensesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'name', 'invoiceNo', 'date', 'expenseHead', 'amount', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ExpenseModel>(true, []);
expensesResult: ExpenseModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
expense: ExpenseModel;
expenseForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
expenseHeadList: ExpenseHeadModel[] = [];
	searchType: any;


  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private expenseHeadService:ExpenseHeadService) { }

  ngOnInit() {

	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadExpenseList())
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
				this.loadExpenseList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ExpensesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.expensesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadExpenseList();
		}); // Remove this line, just loading imitation

this.addExpense();
this.loadAllExpenseHead()
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	loadAllExpenseHead() {
		debugger
		this.expenseHeadService.getAllExpenseHeads().subscribe(res => {
			const data = res['data'];
			this.expenseHeadList = data['content'];
			console.log(this.expenseHeadList)
		}, err => {
		});
	}
	/**
	 * Load Expenses List from service through data-source
	 */
	loadExpenseList() {
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
		this.store.dispatch(new ExpensesPageRequested({ page: queryParams,searchTerm:this.searchType }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.Expense = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Expense
	 *
	 * @param _item: ExpenseModel
	 */
	deleteExpense(_item: ExpenseModel) {

		const _title = 'Expense';
		const _description = 'Are you sure to permanently delete selected Expense?';
		const _waitDesciption = 'Expense is deleting...';
		const _deleteMessage = ' Selected Expense has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneExpenseDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadExpenseList();
		});
		

	}

	/**
	 * Show add Expense dialog
	 */
	addExpense() {
		this.expense=new ExpenseModel();
		this.expense.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Expense dialog and save after success close result
	 * @param expense: ExpenseModel
	 */
	editExpense(expense: ExpenseModel) {
		
		this.expense=expense;
		this.createForm();

	}



createForm() {
	debugger;
	this.expenseForm = this.fb.group({
    // amount: number;
    // date: string;
    // documents: string;
    // id: number;
    // incHeadId: string;
    // invoiceNo: string;
    // isActive: string;
    // name: string;
    // note: string;
    amount: [this.expense.amount, Validators.required],
    date: [this.typesUtilsService.getDateFromString(this.expense.date), Validators.compose([Validators.nullValidator])],
    documents: [this.expense.documents, ],
    expHeadId: [this.expense.expHeadId, Validators.required],
    invoiceNo: [this.expense.invoiceNo, ],
    name: [this.expense.name, Validators.required],
    note: [this.expense.note, ],
    isActive: [this.expense.isActive, ],
		isDeleted: [this.expense.isDeleted, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.expenseForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared expense
 */
prepareExpense(): ExpenseModel {
	const controls = this.expenseForm.controls;
	const _expense = new ExpenseModel();
  _expense.id = this.expense.id;
  // amount: number;
    // date: string;
    // documents: string;
    // id: number;
    // incHeadId: string;
    // invoiceNo: string;
    // isActive: string;
    // name: string;
    // : string;

    _expense.amount = controls.amount.value;
    const _date = controls.date.value;
    if (_date) {
      _expense.date = this.typesUtilsService.dateFormat(_date);
    } else {
      _expense.date = '';
    }
  _expense.documents = controls.documents.value;
  _expense.expHeadId = controls.expHeadId.value;
  _expense.invoiceNo = controls.invoiceNo.value;
  if(_expense.id>0){
	_expense.isActive = controls.isActive.value;
  }else{
	_expense.isActive = 'yes';
  }
  if(_expense.id>0){
	_expense.isDeleted = controls.isDeleted.value;
  }else{
	_expense.isDeleted = 'yes';
  }

	_expense.name = controls.name.value;
  _expense.note = controls.note.value;


	return _expense;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.expenseForm.controls;
	/** check form */
	if (this.expenseForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedExpense = this.prepareExpense();
	if (editedExpense.id > 0) {
		this.updateExpense(editedExpense);
	} else {
		this.createExpense(editedExpense);
	}

	const	_saveMessage= editedExpense.id > 0 ? 'Expense  has been updated' : 'Expense has been created';
		
	const _messageType = editedExpense.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadExpenseList();
		this.expenseForm.reset();
		this.addExpense();
		// this.expense.clear();
		// this.createForm();

}
onCancel(){
	this.expenseForm.reset();
	this.addExpense();
	// this.expense.clear();
	// this.createForm();
}
/**
 * Update Expense
 *
 * @param _expense: ExpenseModel
 */
updateExpense(_expense: ExpenseModel) {
	const updateExpense: Update<ExpenseModel> = {
		id: _expense.id,
		changes: _expense
	};
	this.store.dispatch(new ExpenseUpdated({
		partialExpense: updateExpense,
		expense: _expense
	}));


}

/**
 * Create Expense
 *
 * @param _expense: ExpenseModel
 */
createExpense(_expense:ExpenseModel) {
	this.store.dispatch(new ExpenseOnServerCreated({ expense: _expense }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedExpenseId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _expense, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}
onSelect(event) {
	console.log(event);
	this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
	console.log(event);
	this.files.splice(this.files.indexOf(event), 1);
  }
  _keyPress(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();
	
		}
	}
}