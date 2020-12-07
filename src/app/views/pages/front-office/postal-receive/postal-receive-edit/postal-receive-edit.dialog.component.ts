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
import { DispatchReceiveModel, selectPostalReceivesActionLoading, PostalReceiveUpdated, PostalReceiveOnServerCreated, selectLastCreatedPostalReceiveId } from '../../../../../core/front-office';
import { Constants } from 'src/app/core/api_url';
// // Services and Models



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-postal-receive-edit-dialog',
	templateUrl: './postal-receive-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class PostalReceiveEditDialogComponent implements OnInit, OnDestroy {
	
	
	// Public properties
postalReceive: DispatchReceiveModel;
postalReceiveForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

constructor(public dialogRef: MatDialogRef<PostalReceiveEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService) {
}

/**
 * On init
 */
ngOnInit() {
	this.store.pipe(select(selectPostalReceivesActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	this.postalReceive = this.data.postalReceive;
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
	this.postalReceiveForm = this.fb.group({

		// address: string;
		// date: string;
		// fromTitle: string;
		// id: number;
		// image: string;
		// isActive: string;
		// note: string;
		// referenceNo: string;
		// toTitle: string;
		// type: string;

		address: [this.postalReceive.address, ''],
		date: [this.typesUtilsService.getDateFromString(this.postalReceive.date), Validators.compose([Validators.nullValidator])],
		fromTitle: [this.postalReceive.fromTitle,  Validators.required],
		image: [this.postalReceive.image, ''],
		isActive: [this.postalReceive.isActive, ''],
		note: [this.postalReceive.note, ''],
		referenceNo: [this.postalReceive.referenceNo,''],
		toTitle: [this.postalReceive.toTitle, ''],
		type: [this.postalReceive.type, ''],
		// isActive: string;


	});
}

/**
 * Returns page title
 */
getTitle(): string {
	if (this.postalReceive.id > 0) {
		return `Edit Postal Receive '${this.postalReceive.toTitle}'`;
	}

	return 'New Postal Receive';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.postalReceiveForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared postalReceive
 */
preparepostalReceive(): DispatchReceiveModel {
	const controls = this.postalReceiveForm.controls;
	const _postalReceive = new DispatchReceiveModel();
	_postalReceive.id = this.postalReceive.id;


if(_postalReceive.id>0){
	_postalReceive.isActive = controls.isActive.value;
}else{
	_postalReceive.isActive = 'yes';
}

		_postalReceive.address = controls.address.value;
		const _date = controls.date.value;
		if (_date) {
			_postalReceive.date = this.typesUtilsService.dateFormat(_date);
		} else {
			_postalReceive.date = '';
		}
	_postalReceive.fromTitle = controls.fromTitle.value;
	_postalReceive.image = controls.image.value;
	_postalReceive.note = controls.note.value;
	_postalReceive.referenceNo = controls.referenceNo.value;
	_postalReceive.toTitle = controls.toTitle.value;
	_postalReceive.type = Constants.RECEIVE;
	// _postalReceive.isActive='yes'
	return _postalReceive;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.postalReceiveForm.controls;
	/** check form */
	if (this.postalReceiveForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedpostalReceive = this.preparepostalReceive();
	if (editedpostalReceive.id > 0) {
		this.updatePostalReceive(editedpostalReceive);
	} else {
		this.createPostalReceive(editedpostalReceive);
	}
}

/**
 * Update postalReceive
 *
 * @param _postalReceive: DispatchReceiveModel
 */
updatePostalReceive(_postalReceive: DispatchReceiveModel) {
	const updatepostalReceive: Update<DispatchReceiveModel> = {
		id: _postalReceive.id,
		changes: _postalReceive
	};
	this.store.dispatch(new PostalReceiveUpdated({
		partialPostalReceive: updatepostalReceive,
		postalReceive: _postalReceive
	}));

	// integrate postalReceive  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _postalReceive, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _postalReceive, isEdit: true }
}

/**
 * Create postalReceive
 *
 * @param _postalReceive: DispatchReceiveModel
 */
createPostalReceive(_postalReceive: DispatchReceiveModel) {
	this.store.dispatch(new PostalReceiveOnServerCreated({ postalReceive: _postalReceive }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedPostalReceiveId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _postalReceive, isEdit: false });
	});

	// integrate postalReceive  create api
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

