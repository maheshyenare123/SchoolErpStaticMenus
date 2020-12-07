
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FeesDiscountsDataSource, FeesDiscountModel,selectFeesDiscountsActionLoading, AssignFeesStudentModel } from 'src/app/core/fees-collection';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
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
import { FeesDiscountsPageRequested, OneFeesDiscountDeleted, ManyFeesDiscountsDeleted, FeesDiscountsStatusUpdated, FeesDiscountUpdated, FeesDiscountOnServerCreated, selectLastCreatedFeesDiscountId } from '../../../../../core/fees-collection';
import { FeesDiscountAssignStudentDialogComponent } from '../fees-discount-assign-student/fees-discount-assign-student.dialog.component';


@Component({
  selector: 'kt-fees-discount',
  templateUrl: './fees-discount.component.html',
  styleUrls: ['./fees-discount.component.scss']
})
export class FeesDiscountComponent implements OnInit {

  // Table fields
dataSource: FeesDiscountsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'name', 'code', 'amount', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<FeesDiscountModel>(true, []);
feesDiscountsResult: FeesDiscountModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
feesDiscount: FeesDiscountModel;
feesDiscountForm: FormGroup;
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

	// debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadFeesDiscountList())
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
				this.loadFeesDiscountList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new FeesDiscountsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			// debugger
	console.log(res);
			this.feesDiscountsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadFeesDiscountList();
		}); // Remove this line, just loading imitation

this.addFeesDiscount();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load FeesDiscounts List from service through data-source
	 */
	loadFeesDiscountList() {
		// debugger;
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(new FeesDiscountsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.name = searchText;
		if (!searchText) {
			return filter;
		}
		filter.code = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete FeesDiscount
	 *
	 * @param _item: FeesDiscountModel
	 */
	deleteFeesDiscount(_item: FeesDiscountModel) {

		const _title = 'FeesDiscount';
		const _description = 'Are you sure to permanently delete selected FeesDiscount?';
		const _waitDesciption = 'FeesDiscount is deleting...';
		const _deleteMessage = ' Selected FeesDiscount has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneFeesDiscountDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadFeesDiscountList();
		});
		

	}

	/**
	 * Show add FeesDiscount dialog
	 */
	addFeesDiscount() {
		this.feesDiscount=new FeesDiscountModel();
		this.feesDiscount.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit FeesDiscount dialog and save after success close result
	 * @param feesDiscount: FeesDiscountModel
	 */
	editFeesDiscount(feesDiscount: FeesDiscountModel) {
		
		this.feesDiscount=feesDiscount;
		this.createForm();

	}



createForm() {
	// debugger;
	this.feesDiscountForm = this.fb.group({
		name: [this.feesDiscount.name, Validators.required],
		code: [this.feesDiscount.code, Validators.required],
		amount: [this.feesDiscount.amount, Validators.required],
		description: [this.feesDiscount.description, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.feesDiscountForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared feesDiscount
 */
prepareFeesDiscount(): FeesDiscountModel {
	const controls = this.feesDiscountForm.controls;
	const _feesDiscount = new FeesDiscountModel();
	_feesDiscount.id = this.feesDiscount.id;
  _feesDiscount.name = controls.name.value;
  _feesDiscount.code = controls.code.value;
  _feesDiscount.amount = controls.amount.value;
	_feesDiscount.description = controls.description.value;
	_feesDiscount.isActive='yes';
	return _feesDiscount;
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.feesDiscountForm.controls;
	/** check form */
	if (this.feesDiscountForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedFeesDiscount = this.prepareFeesDiscount();
	if (editedFeesDiscount.id > 0) {
		this.updateFeesDiscount(editedFeesDiscount);
	} else {
		this.createFeesDiscount(editedFeesDiscount);
	}

	const	_saveMessage= editedFeesDiscount.id > 0 ? 'FeesDiscount  has been updated' : 'FeesDiscount has been created';
		
	const _messageType = editedFeesDiscount.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadFeesDiscountList();
		this.feesDiscountForm.reset();
		this.addFeesDiscount();
		// this.feesDiscount.clear();
		// this.createForm();

}

assignDiscountFeesToStudent(assignFeesStudent: AssignFeesStudentModel) {
	let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
//const _saveMessage = homework.id > 0 ? 'Edit  Homework' : 'Create  Homework';

	//const _messageType = homework.id > 0 ? MessageType.Update : MessageType.Create;
	const dialogRef = this.dialog.open(FeesDiscountAssignStudentDialogComponent, { data: { assignFeesStudent } });
	dialogRef.afterClosed().subscribe(res => {
		if (!res) {
			return;
		}

	//	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
	});
}
onCancel(){
	this.feesDiscountForm.reset();
	this.addFeesDiscount();
	// this.feesDiscount.clear();
	// this.createForm();
}
/**
 * Update FeesDiscount
 *
 * @param _feesDiscount: FeesDiscountModel
 */
updateFeesDiscount(_feesDiscount: FeesDiscountModel) {
	const updateFeesDiscount: Update<FeesDiscountModel> = {
		id: _feesDiscount.id,
		changes: _feesDiscount
	};
	this.store.dispatch(new FeesDiscountUpdated({
		partialFeesDiscount: updateFeesDiscount,
		feesDiscount: _feesDiscount
	}));


}

/**
 * Create FeesDiscount
 *
 * @param _feesDiscount: FeesDiscountModel
 */
createFeesDiscount(_feesDiscount:FeesDiscountModel) {
	this.store.dispatch(new FeesDiscountOnServerCreated({ feesDiscount: _feesDiscount }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedFeesDiscountId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _feesDiscount, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}
_keyPress(event: any) {
	const pattern = /[0-9]/;
	let inputChar = String.fromCharCode(event.charCode);
	if (!pattern.test(inputChar)) {
		event.preventDefault();

	}
}
}



