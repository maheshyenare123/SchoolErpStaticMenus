
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
import { EmailModel } from 'src/app/core/sysetm_settings/_models/email.model';
import { EmailService } from 'src/app/core/sysetm_settings/_services/email.service';



@Component({
  selector: 'kt-email-setting',
  templateUrl: './email-setting.component.html',
  styleUrls: ['./email-setting.component.scss']
})
export class EmailSettingComponent implements OnInit {

 // Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
email: EmailModel;
emailForm: FormGroup;
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
    private emailService: EmailService) { }

  ngOnInit() {
    this.addEmail();
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}


	/** ACTIONS */
	/**
	 * Delete email
	 *
	 * @param _item: EmailModel
	 */
	// deleteEmail(_item: EmailModel) {

	// 	const _title = 'Email';
	// 	const _description = 'Are you sure to permanently delete selected email?';
	// 	const _waitDesciption = 'Email is deleting...';
	// 	const _deleteMessage = ' Selected email has been deleted';



	// 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		this.store.dispatch(new OneEmailDeleted({ id: _item.id }));
	// 		this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
	// 		this.loadEmailList();
	// 	});
		

	// }

	/**
	 * Show add email dialog
	 */
	addEmail() {
		this.email=new EmailModel();
		this.email.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit email dialog and save after success close result
	 * @param email: EmailModel
	 */
	editEmail(email: EmailModel) {
		
		this.email=email;
		this.createForm();

	}



createForm() {
  debugger;
  
	this.emailForm = this.fb.group({
		emailEngine: [this.email.emailEngine, ],
		smtpUsername: [this.email.smtpUsername, Validators.required],
		smtpPassword: [this.email.smtpPassword, Validators.required],
    smtpServer: [this.email.smtpServer, Validators.required],
    smtpPort: [this.email.smtpPort, Validators.required],
		smtpSecurity: [this.email.smtpSecurity, Validators.required],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.emailForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared email
 */
prepareEmail(): EmailModel {
	const controls = this.emailForm.controls;
	const _email = new EmailModel();
// emailEngine: string;
  // smtpUsername: string;
  // smtpPassword: string;
  // smtpServer: string;
  // smtpPort: string;
  // smtpSecurity: string;
	_email.emailEngine = controls.emailEngine.value;
	_email.smtpUsername = controls.smtpUsername.value;
	_email.smtpPassword = controls.smtpPassword.value;
  _email.smtpServer = controls.smtpServer.value;
  _email.smtpPort = controls.smtpPort.value;
	_email.smtpSecurity = controls.smtpSecurity.value;
	return _email;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.emailForm.controls;
	/** check form */
	if (this.emailForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedEmail = this.prepareEmail();
	// if (editedEmail.id > 0) {
	// 	this.updateEmail(editedEmail);
	// } else {
		this.createEmail(editedEmail);
	// }

	// const	_saveMessage= editedEmail.id > 0 ? 'Email  has been updated' : 'Email has been created';
		
  // const _messageType = editedEmail.id > 0 ? MessageType.Update : MessageType.Create;
  
  const	_saveMessage=   'Email has been created';
		
	const _messageType =  MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.emailForm.reset();
		this.addEmail();
		// this.email.clear();
		// this.createForm();

}
onCancel(){
	this.emailForm.reset();
	this.addEmail();
	// this.email.clear();
	// this.createForm();
}
/**
 * Update Email
 *
 * @param _email: EmailModel
 */
// updateEmail(_email: EmailModel) {
// 	const updateEmail: Update<EmailModel> = {
// 		id: _email.id,
// 		changes: _email
// 	};
// 	this.store.dispatch(new EmailUpdated({
// 		partialEmail: updateEmail,
// 		email: _email
// 	}));


// }

/**
 * Create email
 *
 * @param _email: EmailModel
 */
createEmail(_email:EmailModel) {
  this.emailService.createEmail(_email).subscribe(response=>{
    response
    return
  },err=>{

  })

	// this.store.dispatch(new EmailOnServerCreated({ email: _email }));
	// this.componentSubscriptions = this.store.pipe(
	// 	select(selectLastCreatedEmailId),
	// 	delay(1000), // Remove this line
	// ).subscribe(res => {
	// 	if (!res) {
	// 		return;
	// 	}

	// 	// this.dialogRef.close({ _email, isEdit: false });
	// });
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
