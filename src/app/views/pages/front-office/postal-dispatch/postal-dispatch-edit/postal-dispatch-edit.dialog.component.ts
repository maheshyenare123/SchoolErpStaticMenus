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
import { DispatchReceiveModel, selectPostalDispatchsActionLoading, PostalDispatchUpdated, selectLastCreatedPostalDispatchId, PostalDispatchOnServerCreated } from '../../../../../core/front-office';
import { Constants } from 'src/app/core/api_url';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-postal-dispatch-edit-dialog',
	templateUrl: './postal-dispatch-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class PostalDispatchEditDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
postalDispatch: DispatchReceiveModel;
postalDispatchForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

constructor(public dialogRef: MatDialogRef<PostalDispatchEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService) {
}

/**
 * On init
 */
ngOnInit() {
	this.store.pipe(select(selectPostalDispatchsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	this.postalDispatch = this.data.postalDispatch;
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
	this.postalDispatchForm = this.fb.group({

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

		address: [this.postalDispatch.address, ''],
		date: [this.typesUtilsService.getDateFromString(this.postalDispatch.date), Validators.compose([Validators.nullValidator])],
		fromTitle: [this.postalDispatch.fromTitle, ''],
		image: [this.postalDispatch.image, ''],
		isActive: [this.postalDispatch.isActive, ''],
		note: [this.postalDispatch.note, ''],
		referenceNo: [this.postalDispatch.referenceNo,''],
		toTitle: [this.postalDispatch.toTitle, Validators.required],
		type: [this.postalDispatch.type, ''],
		// isActive: string;


	});
}

/**
 * Returns page title
 */
getTitle(): string {
	if (this.postalDispatch.id > 0) {
		return `Edit Postal Dispatch '${this.postalDispatch.toTitle}'`;
	}

	return 'New Postal Dispatch';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.postalDispatchForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared postalDispatch
 */
preparepostalDispatch(): DispatchReceiveModel {
	const controls = this.postalDispatchForm.controls;
	const _postalDispatch = new DispatchReceiveModel();
	_postalDispatch.id = this.postalDispatch.id;

	if(_postalDispatch.id>0){
		_postalDispatch.isActive = controls.isActive.value;
	}else{
		_postalDispatch.isActive = 'yes';
	}
		_postalDispatch.address = controls.address.value;
		const _date = controls.date.value;
		if (_date) {
			_postalDispatch.date = this.typesUtilsService.dateFormat(_date);
		} else {
			_postalDispatch.date = '';
		}
	_postalDispatch.fromTitle = controls.fromTitle.value;
	_postalDispatch.image = controls.image.value;
	
	_postalDispatch.note = controls.note.value;
	_postalDispatch.referenceNo = controls.referenceNo.value;
	_postalDispatch.toTitle = controls.toTitle.value;
	_postalDispatch.type = Constants.DISPATCH;
	// _postalDispatch.isActive='yes'
	return _postalDispatch;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.postalDispatchForm.controls;
	/** check form */
	if (this.postalDispatchForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedpostalDispatch = this.preparepostalDispatch();
	if (editedpostalDispatch.id > 0) {
		this.updatePostalDispatch(editedpostalDispatch);
	} else {
		this.createPostalDispatch(editedpostalDispatch);
	}
}

/**
 * Update postalDispatch
 *
 * @param _postalDispatch: DispatchReceiveModel
 */
updatePostalDispatch(_postalDispatch: DispatchReceiveModel) {
	const updatePostalDispatch: Update<DispatchReceiveModel> = {
		id: _postalDispatch.id,
		changes: _postalDispatch
	};
	this.store.dispatch(new PostalDispatchUpdated({
		partialPostalDispatch: updatePostalDispatch,
		postalDispatch: _postalDispatch
	}));

	// integrate postalDispatch  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _postalDispatch, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _postalDispatch, isEdit: true }
}

/**
 * Create postalDispatch
 *
 * @param _postalDispatch: DispatchReceiveModel
 */
createPostalDispatch(_postalDispatch: DispatchReceiveModel) {
	this.store.dispatch(new PostalDispatchOnServerCreated({ postalDispatch: _postalDispatch }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedPostalDispatchId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _postalDispatch, isEdit: false });
	});

	// integrate postalDispatch  create api
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

