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
import { NoticeBoardModel, selectNoticeBoardsActionLoading, NoticeBoardUpdated, NoticeBoardOnServerCreated, selectLastCreatedNoticeBoardId, NoticeBoardService } from '../../../../../core/communication';
import { StudentClassService } from '../../../../../core/academics';
import { RolesDtoModel } from 'src/app/core/Models/rolesDto.model';
import { RoleService } from 'src/app/core/human-resource';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-notice-board-edit-dialog',
	templateUrl: './notice-board-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class NoticeBoardEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	noticeboard: NoticeBoardModel;
	noticeboardForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;
	ckeConfig: any;
	roleCheckBoxList: RoleCheckBox[] = [];
	rolesList: RolesDtoModel[] = [];
	constructor(public dialogRef: MatDialogRef<NoticeBoardEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private roleService:RoleService,
		private studentClassService:StudentClassService
		) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.store.pipe(select(selectNoticeBoardsActionLoading)).subscribe(res => this.viewLoading = res);
		
		this.noticeboard = this.data.noticeboard;
		this.createForm();


		this.ckeConfig = {
			height: 50,
			enterMode: 2,
			allowedContent: true,
			forcePasteAsPlainText: true,
	  
			font_names: 'Arial;Comic Sans Ms;Times New Roman;Verdana;Tahoma',
			toolbarGroups: [
			  { name: 'document', groups: ['mode', 'document', 'doctools'] },
			  { name: 'clipboard', groups: ['clipboard', 'undo'] },
			  { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
			  { name: 'forms', groups: ['forms'] },
			  // '/',
			  { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
			  { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
			  // { name: 'links', groups: ['links'] },
			  // { name: 'insert', groups: ['insert'] },
			  // '/',
			  { name: 'styles', groups: ['styles'] },
			  { name: 'colors', groups: ['colors'] },
			  { name: 'tools', groups: ['tools'] },
			  { name: 'others', groups: ['others'] },
			  { name: 'about', groups: ['about'] },
	  
			],
	  
	  
			removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
		  };
	  
		  this.ckeConfig.extraPlugins = 'autogrow';
		  this.ckeConfig.autoGrow_minHeight = 250;
		  this.ckeConfig.autoGrow_maxHeight = 600;

		  this.loadAllRoles();
		  
	}


	loadAllRoles() {
		debugger
		this.roleService.getAllRoles().subscribe(res => {
		  const data = res['data'];
		  this.rolesList = data['content'];
		  console.log(this.rolesList)
		  this.setRoleDataInChecboxList();
		}, err => {
		});

			//by default check role checkbox
	this.roleCheckBoxList.forEach(element => {
		this.noticeboard.messageTo.forEach(innerElement => {
			if (element.data.id == innerElement.id) {
				element.isChecked = true;
			}
		})


	})
	  }

	onChangedescription($event: any): void {

		console.log("onChange");

		// this.adminChallangeForm.get('description').value
		// console.log("CK Tag=" + this.adminChallangeForm.get('description').value);
		// let a = this.adminChallangeForm.get('description').value;

		// let d = document.createElement('div');
		// d.innerHTML = a;
		// console.log(d.innerText);
		// //set
		// this.adminChallangeForm.get('sponserDescription').setValue(d.innerText);

	}

	onPastedescription($event: any): void {

		console.log("onPaste" + $event.data.dataValue);
		//this.log += new Date() + "<br />";
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
		this.noticeboardForm = this.fb.group({
			title: [this.noticeboard.title, Validators.required],
			message: [this.noticeboard.message, Validators.required],
			messageTo: [this.noticeboard.messageTo, Validators.required],
			noticeDate: [this.typesUtilsService.getDateFromString(this.noticeboard.noticeDate), Validators.compose([Validators.nullValidator])],
			publishOn: [this.typesUtilsService.getDateFromString(this.noticeboard.publishOn), Validators.compose([Validators.nullValidator])],
			isActive: [this.noticeboard.isActive, ''],
		});
	}
	setRoleDataInChecboxList(){
		this.rolesList.forEach(element => {
		
			this.roleCheckBoxList.push({ 'data':	new RolesDtoModel(element.id,element.name), 'isChecked': false })
			console.log(this.roleCheckBoxList)
		})
	}

	onRoleCheckBoxChanges(_isChecked: boolean, id: number) {
		// get current position of the changes element by ID
		const index = this.roleCheckBoxList.findIndex(_ => _.data.id === id);
		// if (!(index > -1)) return;
	
		// const isChecked = this.checkBoxes[index].isChecked;
		if (_isChecked) {
			this.roleCheckBoxList[index].isChecked = _isChecked;
		}else{
			this.roleCheckBoxList[index].isChecked = _isChecked;
		}
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.noticeboard.id > 0) {
			return `Edit noticeboard '${this.noticeboard.title}'`;
		}

		return 'New noticeboard';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.noticeboardForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared noticeboard
	 */
	preparenoticeboard(): NoticeBoardModel {
		const controls = this.noticeboardForm.controls;
		const _noticeboard = new NoticeBoardModel();
		_noticeboard.id = this.noticeboard.id;

		// title: string;
			// message: string;
			// messageTo: string;
			// id: number;
			// isActive: string;
			// noticeDate: string;
			// publishOn: string;


		_noticeboard.title = controls.title.value;
		_noticeboard.message = controls.message.value;
		_noticeboard.messageTo = controls.messageTo.value;

		const _noticeDate = controls.noticeDate.value;
		if (_noticeDate) {
			_noticeboard.noticeDate = this.typesUtilsService.dateFormat(_noticeDate);
		} else {
			_noticeboard.noticeDate = '';
		}
		const _publishOn = controls.publishOn.value;
		if (_publishOn) {
			_noticeboard.publishOn = this.typesUtilsService.dateFormat(_publishOn);
		} else {
			_noticeboard.publishOn = '';
		}

		_noticeboard.isActive='yes'


	

		const roleData: RolesDtoModel[] = [];
		this.roleCheckBoxList.forEach(element => {
			if (element.isChecked) {
				roleData.push(element.data);
			}
		})

		return _noticeboard;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.noticeboardForm.controls;
		/** check form */
		if (this.noticeboardForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editednoticeboard = this.preparenoticeboard();
		if (editednoticeboard.id > 0) {
			this.updateNoticeBoard(editednoticeboard);
		} else {
			this.createNoticeBoard(editednoticeboard);
		}
		this.roleCheckBoxList = [];

		
	}

	/**
	 * Update noticeboard
	 *
	 * @param _noticeboard: NoticeBoardModel
	 */
	updateNoticeBoard(_noticeboard: NoticeBoardModel) {
		const updateNoticeBoard: Update<NoticeBoardModel> = {
			id: _noticeboard.id,
			changes: _noticeboard
		};
		this.store.dispatch(new NoticeBoardUpdated({
			partialNoticeBoard: updateNoticeBoard,
			noticeBoard: _noticeboard
		}));

		

		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _noticeboard, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _noticeboard, isEdit: true }
	}

	/**
	 * Create noticeboard
	 *
	 * @param _noticeboard: NoticeBoardModel
	 */
	createNoticeBoard(_noticeboard: NoticeBoardModel) {
		this.store.dispatch(new NoticeBoardOnServerCreated({ noticeBoard: _noticeboard }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedNoticeBoardId),
			delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _noticeboard, isEdit: false });
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

export class RoleCheckBox {
	data:RolesDtoModel;
	isChecked:boolean;
  }