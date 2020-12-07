import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IncomesDataSource, IncomeModel,selectIncomesActionLoading, IncomeService, IncomeHeadService, IncomeHeadModel } from 'src/app/core/income';
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
import { IncomesPageRequested, OneIncomeDeleted, ManyIncomesDeleted, IncomesStatusUpdated, IncomeUpdated, IncomeOnServerCreated, selectLastCreatedIncomeId } from '../../../../core/income';


@Component({
  selector: 'kt-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {

  // Table fields
dataSource: IncomesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'name', 'invoiceNo', 'date', 'incomeHead', 'amount', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<IncomeModel>(true, []);
incomesResult: IncomeModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
income: IncomeModel;
incomeForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
incomeHeadList: IncomeHeadModel[] = [];
searchType:any

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private incomeHeadService:IncomeHeadService) { }

  ngOnInit() {

	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadIncomeList())
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
				this.loadIncomeList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new IncomesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.incomesResult = res;
			console.log()
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadIncomeList();
		}); // Remove this line, just loading imitation

this.addIncome();
this.loadAllIncomeHead();
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
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
	/**
	 * Load Incomes List from service through data-source
	 */
	loadIncomeList() {
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
		this.store.dispatch(new IncomesPageRequested({ page: queryParams,searchTerm:this.searchType }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.Income = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Income
	 *
	 * @param _item: IncomeModel
	 */
	deleteIncome(_item: IncomeModel) {

		const _title = 'Income';
		const _description = 'Are you sure to permanently delete selected Income?';
		const _waitDesciption = 'Income is deleting...';
		const _deleteMessage = ' Selected Income has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneIncomeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadIncomeList();
		});
		

	}

	/**
	 * Show add Income dialog
	 */
	addIncome() {
		this.income=new IncomeModel();
		this.income.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Income dialog and save after success close result
	 * @param income: IncomeModel
	 */
	editIncome(income: IncomeModel) {
		
		this.income=income;
		this.createForm();

	}



createForm() {
	debugger;
	this.incomeForm = this.fb.group({
    // amount: number;
    // date: string;
    // documents: string;
    // id: number;
    // incHeadId: string;
    // invoiceNo: string;
    // isActive: string;
    // name: string;
    // note: string;
    amount: [this.income.amount, Validators.required],
    date: [this.typesUtilsService.getDateFromString(this.income.date), Validators.compose([Validators.nullValidator])],
    documents: [this.income.documents, ],
    incHeadId: [this.income.incHeadId, Validators.required],
    invoiceNo: [this.income.invoiceNo, ],
    name: [this.income.name, Validators.required],
    note: [this.income.note, ],
    isActive: [this.income.isActive, ],
		
	});
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
 * Returns prepared income
 */
prepareIncome(): IncomeModel {
	const controls = this.incomeForm.controls;
	const _income = new IncomeModel();
  _income.id = this.income.id;
  // amount: number;
    // date: string;
    // documents: string;
    // id: number;
    // incHeadId: string;
    // invoiceNo: string;
    // isActive: string;
    // name: string;
    // : string;

    _income.amount = controls.amount.value;
    const _date = controls.date.value;
    if (_date) {
      _income.date = this.typesUtilsService.dateFormat(_date);
    } else {
      _income.date = '';
    }
  _income.documents = controls.documents.value;
  _income.incHeadId = controls.incHeadId.value;
  _income.invoiceNo = controls.invoiceNo.value;
  if(_income.id>0){
	_income.isActive = controls.isActive.value;
  }else{
	_income.isActive = 'yes';
  }
 
	_income.name = controls.name.value;
  _income.note = controls.note.value;


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

	const	_saveMessage= editedIncome.id > 0 ? 'Income  has been updated' : 'Income has been created';
		
	const _messageType = editedIncome.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadIncomeList();
		this.incomeForm.reset();
		this.addIncome();
		// this.income.clear();
		// this.createForm();

}
onCancel(){
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
createIncome(_income:IncomeModel) {
	this.store.dispatch(new IncomeOnServerCreated({ income: _income }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedIncomeId),
		delay(1000), // Remove this line
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



