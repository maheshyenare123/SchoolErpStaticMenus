
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ComplainTypesDataSource, ComplaintTypeModel,selectComplaintTypesActionLoading } from 'src/app/core/front-office';
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
import { ComplaintModel, selectComplaintsActionLoading } from '../../../../../core/front-office';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintTypesPageRequested, OneComplaintTypeDeleted, ManyComplaintTypesDeleted, ComplaintTypesStatusUpdated, ComplaintTypeUpdated, ComplaintTypeOnServerCreated, selectLastCreatedComplaintTypeId } from '../../../../../core/front-office';

@Component({
  selector: 'kt-complain-type',
  templateUrl: './complain-type.component.html',
  styleUrls: ['./complain-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplainTypeComponent implements OnInit {
  
// Table fields
dataSource: ComplainTypesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'complaintType', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ComplaintTypeModel>(true, []);
complaintTypesResult: ComplaintTypeModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
complaintType: ComplaintTypeModel;
complaintTypeForm: FormGroup;
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
			tap(() => this.loadComplaintTypeList())
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
				this.loadComplaintTypeList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ComplainTypesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.complaintTypesResult = res;
			if(this.complaintTypesResult.length==0)this.dataSource.hasItems=false;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadComplaintTypeList();
		}); // Remove this line, just loading imitation

this.addComplaintType();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load ComplaintTypes List from service through data-source
	 */
	loadComplaintTypeList() {
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
		this.store.dispatch(new ComplaintTypesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.complaintType = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete ComplaintType
	 *
	 * @param _item: ComplaintTypeModel
	 */
	deleteComplaintType(_item: ComplaintTypeModel) {

		const _title = 'Complain Type';
		const _description = 'Are you sure to permanently delete selected check out policy?';
		const _waitDesciption = 'Complain Type is deleting...';
		const _deleteMessage = ' Selected check out policy has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneComplaintTypeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadComplaintTypeList();
		});
		

	}

	/**
	 * Show add ComplaintType dialog
	 */
	addComplaintType() {
		this.complaintType=new ComplaintTypeModel();
		this.complaintType.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit ComplaintType dialog and save after success close result
	 * @param complaintType: ComplaintTypeModel
	 */
	editComplaintType(complaintType: ComplaintTypeModel) {
		
		this.complaintType=complaintType;
		this.createForm();

	}



createForm() {
	debugger;
	this.complaintTypeForm = this.fb.group({
		complaintType: [this.complaintType.complaintType, Validators.required],
		description: [this.complaintType.description, ],
		isActive: [this.complaintType.isActive, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.complaintTypeForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared complaintType
 */
prepareComplaintType(): ComplaintTypeModel {
	const controls = this.complaintTypeForm.controls;
	const _complaintType = new ComplaintTypeModel();
	_complaintType.id = this.complaintType.id;
	_complaintType.complaintType = controls.complaintType.value;
	_complaintType.description = controls.description.value;
	if(_complaintType.id>0){
	_complaintType.isActive = controls.isActive.value;
}else{
	_complaintType.isActive = 'yes';
}
	return _complaintType;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.complaintTypeForm.controls;
	/** check form */
	if (this.complaintTypeForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedComplaintType = this.prepareComplaintType();
	if (editedComplaintType.id > 0) {
		this.updateComplaintType(editedComplaintType);
	} else {
		this.createComplaintType(editedComplaintType);
	}
	this.loadComplaintTypeList();
	const	_saveMessage= editedComplaintType.id > 0 ? 'Complain Type  has been updated' : 'Complain Type has been created';
		
	const _messageType = editedComplaintType.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
		this.complaintTypeForm.reset();
		// this.complaintType.clear();
		// this.createForm();
		this.addComplaintType();

}
onCancel(){
	this.complaintTypeForm.reset();
	// this.complaintType.clear();
	// this.createForm();
	this.addComplaintType();
}
/**
 * Update ComplaintType
 *
 * @param _complaintType: ComplaintTypeModel
 */
updateComplaintType(_complaintType: ComplaintTypeModel) {
	const updateComplaintType: Update<ComplaintTypeModel> = {
		id: _complaintType.id,
		changes: _complaintType
	};
	this.store.dispatch(new ComplaintTypeUpdated({
		partialComplaintType: updateComplaintType,
		complaintType: _complaintType
	}));


}

/**
 * Create ComplaintType
 *
 * @param _complaintType: ComplaintTypeModel
 */
createComplaintType(_complaintType:ComplaintTypeModel) {
	this.store.dispatch(new ComplaintTypeOnServerCreated({ complaintType: _complaintType }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedComplaintTypeId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _complaintType, isEdit: false });
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