
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LeaveTypesDataSource, LeaveTypeModel,selectLeaveTypesActionLoading } from 'src/app/core/human-resource';
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
import { LeaveTypesPageRequested, OneLeaveTypeDeleted, ManyLeaveTypesDeleted, LeaveTypesStatusUpdated, LeaveTypeUpdated, LeaveTypeOnServerCreated, selectLastCreatedLeaveTypeId } from '../../../../core/human-resource';


@Component({
  selector: 'kt-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {

    // Table fields
dataSource: LeaveTypesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'leaveType', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<LeaveTypeModel>(true, []);
leaveTypesResult: LeaveTypeModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
leaveType: LeaveTypeModel;
leaveTypeForm: FormGroup;
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
			tap(() => this.loadLeaveTypeList())
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
				this.loadLeaveTypeList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new LeaveTypesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.leaveTypesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadLeaveTypeList();
		}); // Remove this line, just loading imitation

this.addLeaveType();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load LeaveTypes List from service through data-source
	 */
	loadLeaveTypeList() {
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
		this.store.dispatch(new LeaveTypesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.leaveType = searchText;
		if (!searchText) {
			return filter;
		}
		filter.leaveType = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete LeaveType
	 *
	 * @param _item: LeaveTypeModel
	 */
	deleteLeaveType(_item: LeaveTypeModel) {

		const _title = 'Leave Type';
		const _description = 'Are you sure to permanently delete selected Leave Type?';
		const _waitDesciption = 'Leave Type is deleting...';
		const _deleteMessage = ' Selected Leave Type has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneLeaveTypeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadLeaveTypeList();
		});
		

	}

	/**
	 * Show add LeaveType dialog
	 */
	addLeaveType() {
		this.leaveType=new LeaveTypeModel();
		this.leaveType.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit LeaveType dialog and save after success close result
	 * @param leaveType: LeaveTypeModel
	 */
	editLeaveType(leaveType: LeaveTypeModel) {
		
		this.leaveType=leaveType;
		this.createForm();

	}



createForm() {
	debugger;
	this.leaveTypeForm = this.fb.group({
		type: [this.leaveType.type, Validators.required],
		isActive: [this.leaveType.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.leaveTypeForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared LeaveType
 */
prepareLeaveType(): LeaveTypeModel {
	const controls = this.leaveTypeForm.controls;
	const _leaveType = new LeaveTypeModel();
	_leaveType.id = this.leaveType.id;
	_leaveType.type = controls.type.value;
	_leaveType.isActive='yes';
	return _leaveType;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.leaveTypeForm.controls;
	/** check form */
	if (this.leaveTypeForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedLeaveType = this.prepareLeaveType();
	if (editedLeaveType.id > 0) {
		this.updateLeaveType(editedLeaveType);
	} else {
		this.createLeaveType(editedLeaveType);
	}

	const	_saveMessage= editedLeaveType.id > 0 ? 'Leave Type  has been updated' : 'Leave Type has been created';
		
	const _messageType = editedLeaveType.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadLeaveTypeList();
		this.leaveTypeForm.reset();
		this.addLeaveType();
		// this.leaveType.clear();
		// this.createForm();

}
onCancel(){
	this.leaveTypeForm.reset();
	this.addLeaveType();
	// this.leaveType.clear();
	// this.createForm();
}
/**
 * Update LeaveType
 *
 * @param _leaveType: LeaveTypeModel
 */
updateLeaveType(_leaveType: LeaveTypeModel) {
	const updateLeaveType: Update<LeaveTypeModel> = {
		id: _leaveType.id,
		changes: _leaveType
	};
	this.store.dispatch(new LeaveTypeUpdated({
		partialLeaveType: updateLeaveType,
	leaveType: _leaveType
	}));


}

/**
 * Create LeaveType
 *
 * @param _leaveType: LeaveTypeModel
 */
createLeaveType(_leaveType:LeaveTypeModel) {
	this.store.dispatch(new LeaveTypeOnServerCreated({ leaveType: _leaveType }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedLeaveTypeId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _leaveType, isEdit: false });
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


