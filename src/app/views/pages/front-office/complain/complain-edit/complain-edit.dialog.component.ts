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
import { ComplaintModel, selectComplaintsActionLoading, ComplaintUpdated, ComplaintOnServerCreated, selectLastCreatedComplaintId, ComplaintTypeModel, SourceModel, ComplaintTypeService, SourceService } from '../../../../../core/front-office';
import { TimestampModel } from '../../../../../core/front-office/_models/timestamp.model';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-complain-edit-dialog',
	templateUrl: './complain-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ComplainEditDialogComponent implements OnInit, OnDestroy {
	
	
	// Public properties
	complain: ComplaintModel;
	complainForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;
	files: File[] = [];

	complaintTypeList: ComplaintTypeModel[] = [];
	sourceList:SourceModel[]=[];

	constructor(public dialogRef: MatDialogRef<ComplainEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private complainTypeService:ComplaintTypeService,
		private sourceService:SourceService,
		) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.loadAllComplaintTypes();
		this.loadAllSources();
		this.store.pipe(select(selectComplaintsActionLoading)).subscribe(res => this.viewLoading = res);
		// loadding
		this.complain = this.data.complain;
		this.createForm();

	}
//get All Complain Type List
loadAllComplaintTypes() {
	debugger
	this.complainTypeService.getAllComplaintTypes().subscribe(res => {
		const data=res['data'];
		this.complaintTypeList=data['content'];
		// this.ManageRoomType();
		console.log("Get All room type"+res);
	}, err => {

	});
}
	//get All Source List
loadAllSources() {
	debugger
	this.sourceService.getAllSources().subscribe(res => {
		const data=res['data'];
		this.sourceList=data['content'];
		// this.ManageRoomType();
		console.log("Get All room type"+res);
	}, err => {

	});

}
	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm() {
		this.complainForm = this.fb.group({
	
			actionTaken: [this.complain.actionTaken, ''],
			assigned: [this.complain.assigned, ''],
			complaintType: [this.complain.complaintType, ''],
			contact: [this.complain.contact,[Validators.required,
				Validators.pattern("^[0-9]*$"),
				Validators.maxLength(10)]],
			date: [this.typesUtilsService.getDateFromString(this.complain.date), Validators.compose([Validators.nullValidator])],
			description: [this.complain.description, ''],
			email: [this.complain.email, Validators.compose([ Validators.email])],
			image: [this.complain.image, ''],
			isActive: [this.complain.isActive, ''],
			name: [this.complain.name, Validators.required],
			note: [this.complain.note, ''],
			source: [this.complain.source, Validators.required],

		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.complain.id > 0) {
			return `Edit complain '${this.complain.name}'`;
		}

		return 'New complain';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.complainForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared complain
	 */
	preparecomplain(): ComplaintModel {
		const controls = this.complainForm.controls;
		const _complain = new ComplaintModel();
		_complain.id = this.complain.id;
		_complain.actionTaken = controls.actionTaken.value;
		_complain.assigned = controls.assigned.value;
		_complain.complaintType = controls.complaintType.value;
		_complain.contact = controls.contact.value;
	
		const _date = controls.date.value;
		if (_date) {
			_complain.date = this.typesUtilsService.dateFormat(_date);
		} else {
			_complain.date = '';
		}
		_complain.description = controls.description.value;
		_complain.email = controls.email.value;
		_complain.image = controls.image.value;
	
		_complain.name = controls.name.value;
		_complain.note = controls.note.value;
		_complain.source = controls.source.value;

		if(_complain.id > 0){
			_complain.isActive = controls.isActive.value;
		}else{
			_complain.isActive = 'yes';
		}

		
		return _complain;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.complainForm.controls;
		/** check form */
		if (this.complainForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedcomplain = this.preparecomplain();
		console.log(editedcomplain);
		if (editedcomplain.id > 0) {
			this.updateComplain(editedcomplain);
		} else {
			this.createComplain(editedcomplain);
		}
	}

	/**
	 * Update complain
	 *
	 * @param _complain: ComplaintModel
	 */
	updateComplain(_complain: ComplaintModel) {
		const updateComplain: Update<ComplaintModel> = {
			id: _complain.id,
			changes: _complain
		};
		this.store.dispatch(new ComplaintUpdated({
			partialComplaint: updateComplain,
			complaint: _complain
		}));

		// integrate complain  update api

		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _complain, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _complain, isEdit: true }
	}

	/**
	 * Create complain
	 *
	 * @param _complain: ComplaintModel
	 */
	createComplain(_complain: ComplaintModel) {
		this.store.dispatch(new ComplaintOnServerCreated({ complaint: _complain }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedComplaintId),
			// delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _complain, isEdit: false });
		});

		// integrate complain  create api
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

