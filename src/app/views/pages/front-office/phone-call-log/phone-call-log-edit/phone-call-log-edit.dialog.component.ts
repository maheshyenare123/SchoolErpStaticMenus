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
import { GeneralCallModel, selectPhoneCallLogsActionLoading, PhoneCallLogUpdated, PhoneCallLogOnServerCreated, selectLastCreatedPhoneCallLogId } from '../../../../../core/front-office';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-phone-call-log-edit-dialog',
	templateUrl: './phone-call-log-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class PhoneCallLogEditDialogComponent implements OnInit, OnDestroy {
	
	// Public properties
	phoneCall: GeneralCallModel;
	phoneCallForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;


	constructor(public dialogRef: MatDialogRef<PhoneCallLogEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.store.pipe(select(selectPhoneCallLogsActionLoading)).subscribe(res => this.viewLoading = res);
		// loadding
		this.phoneCall = this.data.phoneCall;
		this.createForm();
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
		this.phoneCallForm = this.fb.group({

			// callDureation: string;
			// callType: string;
			// contact: string;
			// date: string;
			// description: string;
			// followUpDate: string;
			// id: number;
			// isActive: string;
			// name: string;
			// note: string;

			callDureation: [this.phoneCall.callDureation, ''],
			callType: [this.phoneCall.callType, ''],
			contact: [this.phoneCall.contact, [Validators.required,
				Validators.pattern("^[0-9]*$"),
				Validators.maxLength(10)]],
			date: [this.typesUtilsService.getDateFromString(this.phoneCall.date), Validators.compose([Validators.nullValidator])],
			description: [this.phoneCall.description, ''],
			followUpDate: [this.typesUtilsService.getDateFromString(this.phoneCall.followUpDate), Validators.compose([Validators.nullValidator])],
			isActive: [this.phoneCall.isActive, ''],
			name: [this.phoneCall.name,],
			note: [this.phoneCall.note, ''],
			
			// isActive: string;


		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.phoneCall.id > 0) {
			return `Edit phone Call '${this.phoneCall.name}'`;
		}

		return 'New phone Call';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.phoneCallForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared phoneCall
	 */
	preparephoneCall(): GeneralCallModel {
		const controls = this.phoneCallForm.controls;
		const _phoneCall = new GeneralCallModel();
		_phoneCall.id = this.phoneCall.id;

		// callDureation: string;
			// callType: string;
			// contact: string;
			// date: string;
			// description: string;
			// followUpDate: string;
			// id: number;
			// isActive: string;
			// name: string;
			// note: string;
			

		_phoneCall.callDureation = controls.callDureation.value;
		_phoneCall.callType = controls.callType.value;
		_phoneCall.contact = controls.contact.value;
		const _date = controls.date.value;
		if (_date) {
			_phoneCall.date = this.typesUtilsService.dateFormat(_date);
		} else {
			_phoneCall.date = '';
		}
		_phoneCall.description = controls.description.value;
		const _followupdate = controls.followUpDate.value;
		if (_followupdate) {
			_phoneCall.followUpDate = this.typesUtilsService.dateFormat(_followupdate);
		} else {
			_phoneCall.followUpDate = '';
		}
		if(_phoneCall.id > 0){
			_phoneCall.isActive = controls.isActive.value;
		}else{
			_phoneCall.isActive = 'yes';
		}

		_phoneCall.name = controls.name.value;
		_phoneCall.note = controls.note.value;
		
		return _phoneCall;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.phoneCallForm.controls;
		/** check form */
		if (this.phoneCallForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedphoneCall = this.preparephoneCall();
		console.log(editedphoneCall);
		if (editedphoneCall.id > 0) {
			this.updatePhoneCall(editedphoneCall);
		} else {
			this.createPhoneCall(editedphoneCall);
		}
	}

	/**
	 * Update phoneCall
	 *
	 * @param _phoneCall: GeneralCallModel
	 */
	updatePhoneCall(_phoneCall: GeneralCallModel) {
		const updatePhoneCall: Update<GeneralCallModel> = {
			id: _phoneCall.id,
			changes: _phoneCall
		};
		this.store.dispatch(new PhoneCallLogUpdated({
			partialPhoneCallLog: updatePhoneCall,
			phoneCallLog: _phoneCall
		}));

		// integrate phoneCall  update api

		// Remove this line
		// of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _phoneCall, isEdit: true }));
		// Uncomment this line
		this.dialogRef.close({ _phoneCall, isEdit: true })
		
	}

	/**
	 * Create phoneCall
	 *
	 * @param _phoneCall: GeneralCallModel
	 */
	createPhoneCall(_phoneCall: GeneralCallModel) {
		this.store.dispatch(new PhoneCallLogOnServerCreated({ phoneCallLog: _phoneCall }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedPhoneCallLogId),
			// delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _phoneCall, isEdit: false });
		});

		// integrate phoneCall  create api
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

