// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StaffLeaveRequestModel, selectStaffLeaveRequestsActionLoading, StaffLeaveRequestUpdated, selectLastCreatedStaffLeaveRequestId, StaffLeaveRequestOnServerCreated, LeaveTypeService, LeaveTypeModel } from '../../../../../core/human-resource';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-approve-leave-request-edit-dialog',
	templateUrl: './approve-leave-request-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ApproveLeaveRequestEditDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
staffLeaveRequest: StaffLeaveRequestModel;
staffLeaveRequestForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
leaveTypeList: LeaveTypeModel[] = [];
constructor(public dialogRef: MatDialogRef<ApproveLeaveRequestEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService,
	private leaveTypeService: LeaveTypeService) {
}

/**
 * On init
 */
ngOnInit() {
	debugger
	this.store.pipe(select(selectStaffLeaveRequestsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	this.staffLeaveRequest = this.data.staffLeaveRequest;
	this.createForm();
	this.loadAllLeadType()
}

/**
 * On destroy
 */
ngOnDestroy() {
	if (this.componentSubscriptions) {
		this.componentSubscriptions.unsubscribe();
	}
}


loadAllLeadType() {
	debugger
	this.leaveTypeService.getAllLeaveTypes().subscribe(res => {
		const data = res['data'];
		this.leaveTypeList = data['content'];
		console.log(this.leaveTypeList)
	}, err => {
	});
}

createForm() {
	this.staffLeaveRequestForm = this.fb.group({
		date: [this.typesUtilsService.getDateFromString(this.staffLeaveRequest.date), Validators.compose([Validators.nullValidator])],
		leaveFrom: [this.typesUtilsService.getDateFromString(this.staffLeaveRequest.leaveFrom), Validators.compose([Validators.nullValidator])],
		leaveTo: [this.typesUtilsService.getDateFromString(this.staffLeaveRequest.leaveTo), Validators.compose([Validators.nullValidator])],
		adminRemark: [this.staffLeaveRequest.adminRemark,],
		documentFile: [this.staffLeaveRequest.documentFile, ],
		leaveDays: [this.staffLeaveRequest.leaveDays, 0],
		leaveType: [this.staffLeaveRequest.leaveType,],
		leaveTypeId: [this.staffLeaveRequest.leaveTypeId,],
		reason: [this.staffLeaveRequest.reason, ],
		sessionID: [this.staffLeaveRequest.sessionID,],
		staffId: [this.staffLeaveRequest.staffId,],
		staffName: [this.staffLeaveRequest.staffName,],
		status: [this.staffLeaveRequest.status,],	
	});
}
getLeaveType($event){
	//leaveType  set leaveType String from id
	//this.staffLeaveRequestForm.get('leaveType').setValue();
}
/**
 * Returns page title
 */
getTitle(): string {
	// if (this.staffLeaveRequest.id > 0) {
	// 	return `Edit Leave '${this.staffLeaveRequest.staffName}'`;
	// }

	return 'Approve Leave';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.staffLeaveRequestForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared staffLeaveRequest
 */
preparestaffLeaveRequest(): StaffLeaveRequestModel {
	const controls = this.staffLeaveRequestForm.controls;
	const _staffLeaveRequest = new StaffLeaveRequestModel();
	_staffLeaveRequest.id = this.staffLeaveRequest.id;
		
		_staffLeaveRequest.adminRemark = controls.adminRemark.value;
		_staffLeaveRequest.documentFile = controls.documentFile.value;
		_staffLeaveRequest.leaveDays = controls.leaveDays.value;
		_staffLeaveRequest.leaveType = controls.leaveType.value;
		_staffLeaveRequest.leaveTypeId = controls.leaveTypeId.value;
		_staffLeaveRequest.reason = controls.reason.value;
		_staffLeaveRequest.sessionID = controls.sessionID.value;
		_staffLeaveRequest.staffId = controls.staffId.value;
		_staffLeaveRequest.staffName = controls.staffName.value;
		_staffLeaveRequest.status = controls.status.value;

		const _date = controls.date.value;
		if (_date) {
			_staffLeaveRequest.date = this.typesUtilsService.dateFormat(_date);
		} else {
			_staffLeaveRequest.date = '';
		}
		const _leaveFrom = controls.leaveFrom.value;
		if (_leaveFrom) {
			_staffLeaveRequest.leaveFrom = this.typesUtilsService.dateFormat(_leaveFrom);
		} else {
			_staffLeaveRequest.leaveFrom = '';
		}
		const _leaveTo = controls.leaveTo.value;
		if (_leaveTo) {
			_staffLeaveRequest.leaveTo = this.typesUtilsService.dateFormat(_leaveTo);
		} else {
			_staffLeaveRequest.leaveTo = '';
		}


	return _staffLeaveRequest;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.staffLeaveRequestForm.controls;
	/** check form */
	if (this.staffLeaveRequestForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedStaffLeaveRequest = this.preparestaffLeaveRequest();
	if (editedStaffLeaveRequest.id > 0) {
		this.updateStaffLeaveRequest(editedStaffLeaveRequest);
	} else {
		this.createStaffLeaveRequest(editedStaffLeaveRequest);
	}
}

/**
 * Update StaffLeaveRequest
 *
 * @param _staffLeaveRequest: StaffLeaveRequestModel
 */
updateStaffLeaveRequest(_staffLeaveRequest: StaffLeaveRequestModel) {
	const updateStaffLeaveRequest: Update<StaffLeaveRequestModel> = {
		id: _staffLeaveRequest.id,
		changes: _staffLeaveRequest
	};
	this.store.dispatch(new StaffLeaveRequestUpdated({
		partialStaffLeaveRequest: updateStaffLeaveRequest,
		staffLeaveRequest: _staffLeaveRequest
	}));

	// integrate StaffLeaveRequest  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _staffLeaveRequest, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _staffLeaveRequest, isEdit: true }
}

/**
 * Create StaffLeaveRequest
 *
 * @param _staffLeaveRequest: StaffLeaveRequestModel
 */
createStaffLeaveRequest(_staffLeaveRequest: StaffLeaveRequestModel) {
	this.store.dispatch(new StaffLeaveRequestOnServerCreated({ staffLeaveRequest: _staffLeaveRequest }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedStaffLeaveRequestId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _staffLeaveRequest, isEdit: false });
	});

	// integrate StaffLeaveRequest  create api
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

