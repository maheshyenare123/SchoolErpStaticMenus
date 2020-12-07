
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
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
import { SmsModel } from 'src/app/core/sysetm_settings/_models/sms.model';
import { SmsService } from 'src/app/core/sysetm_settings/_services/sms.service';

@Component({
  selector: 'kt-sms-setting',
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.scss']
})
export class SmsSettingComponent implements OnInit {

   // Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
sms: SmsModel;
smsForm: FormGroup;
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
    private typesUtilsService: TypesUtilsService,
    private smsService: SmsService) { }

  ngOnInit() {
    this.addSms();
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}


	/** ACTIONS */
	/**
	 * Delete sms
	 *
	 * @param _item: SmsModel
	 */
	// deleteSms(_item: SmsModel) {

	// 	const _title = 'Sms';
	// 	const _description = 'Are you sure to permanently delete selected sms?';
	// 	const _waitDesciption = 'Sms is deleting...';
	// 	const _deleteMessage = ' Selected sms has been deleted';



	// 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		this.store.dispatch(new OneSmsDeleted({ id: _item.id }));
	// 		this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	// 		this.loadSmsList();
	// 	});
		

	// }

	/**
	 * Show add sms dialog
	 */
	addSms() {
		this.sms=new SmsModel();
		this.sms.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit sms dialog and save after success close result
	 * @param sms: SmsModel
	 */
	editSms(sms: SmsModel) {
		
		this.sms=sms;
		this.createForm();

	}



createForm() {
  debugger;
  
	this.smsForm = this.fb.group({
		url: [this.sms.url, Validators.required],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.smsForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared sms
 */
prepareSms(): SmsModel {
	const controls = this.smsForm.controls;
	const _sms = new SmsModel();

	_sms.url = controls.url.value;
	return _sms;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.smsForm.controls;
	/** check form */
	if (this.smsForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedSms = this.prepareSms();
	// if (editedSms.id > 0) {
	// 	this.updateSms(editedSms);
	// } else {
		this.createSms(editedSms);
	// }

	// const	_saveMessage= editedSms.id > 0 ? 'Sms  has been updated' : 'Sms has been created';
		
  // const _messageType = editedSms.id > 0 ? MessageType.Update : MessageType.Create;
  
  const	_saveMessage=   'Sms has been created';
		
	const _messageType =  MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.smsForm.reset();
		this.addSms();
		// this.sms.clear();
		// this.createForm();

}
onCancel(){
	this.smsForm.reset();
	this.addSms();
	// this.sms.clear();
	// this.createForm();
}
/**
 * Update Sms
 *
 * @param _sms: SmsModel
 */
// updateSms(_sms: SmsModel) {
// 	const updateSms: Update<SmsModel> = {
// 		id: _sms.id,
// 		changes: _sms
// 	};
// 	this.store.dispatch(new SmsUpdated({
// 		partialSms: updateSms,
// 		sms: _sms
// 	}));


// }

/**
 * Create sms
 *
 * @param _sms: SmsModel
 */
createSms(_sms:SmsModel) {
  this.smsService.createSms(_sms).subscribe(response=>{
    response
    return
  },err=>{

  })

	// this.store.dispatch(new SmsOnServerCreated({ sms: _sms }));
	// this.componentSubscriptions = this.store.pipe(
	// 	select(selectLastCreatedSmsId),
	// 	delay(1000), // Remove this line
	// ).subscribe(res => {
	// 	if (!res) {
	// 		return;
	// 	}

	// 	// this.dialogRef.close({ _sms, isEdit: false });
	// });
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
