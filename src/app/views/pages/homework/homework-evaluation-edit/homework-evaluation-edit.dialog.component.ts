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
import { AppState } from '../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeworkDtoModel, HomeworkEvaluationDtoModel, selectHomeworksActionLoading, HomeworkUpdated, HomeworkOnServerCreated, selectLastCreatedHomeworkId, HomeworkService, HomeworkEvaluationService } from '../../../../core/homework';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-homework-evaluation-edit-dialog',
	templateUrl: './homework-evaluation-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class HomeworkEvaluationEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	homework: HomeworkDtoModel;
	homeworkevaluationList: HomeworkEvaluationDtoModel[] = [];
	homeworkForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;
	files: File[] = [];
	ckeConfig: any;
	

	homeworkEvaluationStudentList: HomeworkEvaluationDtoModel[] = [];
	homeworkEvaluationCheckBoxList: HomeworkEvaluationCheckBox[] = [];
	constructor(public dialogRef: MatDialogRef<HomeworkEvaluationEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
	
		private homeworkEvaluationService: HomeworkEvaluationService
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {

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
		

		this.store.pipe(select(selectHomeworksActionLoading)).subscribe(res => this.viewLoading = res);

		this.homework = this.data.homework;
		this.homeworkEvaluationStudentList = this.data.homeworkEvaluationStudentList;
		this.createForm();
		this.setSectionDataInChecboxList();
		// this.getStudentDataForEvaluation(this.homework.id);
	}

	// getStudentDataForEvaluation(homeworkId){
	// 	this.homeworkEvaluationService.findStudentHomeworkEvaluations(homeworkId).subscribe(res=>{

	// 		const data=res['data'];
	// 		this.homeworkEvaluationStudentList=data['content'];
	// 		// this.setSectionDataInChecboxList();
	// 		// console.log(res);
	// 	})

	// }


	setSectionDataInChecboxList() {
		this.homeworkEvaluationCheckBoxList = [];
		this.homeworkEvaluationStudentList.forEach(ele => {
			if (ele.status === "approved") {
				this.homeworkEvaluationCheckBoxList.push({ 'data': new HomeworkEvaluationDtoModel(ele.id, ele.date, ele.homeworkId, ele.isActive, ele.status, ele.studentAdmissionNo, ele.studentFirstName, ele.studentId, ele.studentLastName, ele.studentSessionId), 'isChecked': true })
			} else {
				this.homeworkEvaluationCheckBoxList.push({ 'data': new HomeworkEvaluationDtoModel(ele.id, ele.date, ele.homeworkId, ele.isActive, ele.status, ele.studentAdmissionNo, ele.studentFirstName, ele.studentId, ele.studentLastName, ele.studentSessionId), 'isChecked': false })
			}

		})

	}
	onStudentCheckBoxChanges(_isChecked: boolean, id: number) {
		// get current position of the changes element by ID
		const index = this.homeworkEvaluationCheckBoxList.findIndex(_ => _.data.id === id);
		
		if (_isChecked) {
			this.homeworkEvaluationCheckBoxList[index].isChecked = _isChecked;
			this.homeworkEvaluationCheckBoxList[index].data.status = "approved";
		} else {
			this.homeworkEvaluationCheckBoxList[index].isChecked = _isChecked;
			this.homeworkEvaluationCheckBoxList[index].data.status = "pending";
		}



	}

	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm() {
		this.homeworkForm = this.fb.group({
			evaluationDate: [this.typesUtilsService.getDateFromString(this.homework.evaluationDate), Validators.compose([Validators.nullValidator])],

		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.homework.id > 0) {
			return `Edit homework '${this.homework.description}'`;
		}

		return 'New homework';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.homeworkForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared homework
	 */
	preparehomework(): HomeworkEvaluationDtoModel[] {
		const controls = this.homeworkForm.controls;
		const _homeworkEvaluationList: HomeworkEvaluationDtoModel[] = [];


		const _evaluationDate = controls.evaluationDate.value;
		let evaluateDate;
		if (_evaluationDate) {
			evaluateDate = this.typesUtilsService.dateFormat(_evaluationDate);
		} else {
			evaluateDate = '';
		}

		this.homeworkEvaluationCheckBoxList.forEach(element => {
			if (element.isChecked) {
				element.data.date = evaluateDate;
				_homeworkEvaluationList.push(element.data);
			}
		})


		return _homeworkEvaluationList;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		//this.homeworkevaluationList check list empty if empty not submit
		this.hasFormErrors = false;
		const controls = this.homeworkForm.controls;
		/** check form */
		if (this.homeworkForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedHomework = this.preparehomework();
		// if (editedHomework.id > 0) {
		// 	this.updateHomework(editedHomework);
		// } else {
		this.createHomework(editedHomework);
		// }

		

	}

	onCancel() {
		this.homeworkEvaluationCheckBoxList = [];
	}

	/**
	 * Create homework evaluation
	 *
	 */
	createHomework(_homeworkEvaluation: HomeworkEvaluationDtoModel[]) {
		this.homeworkEvaluationService.createHomeworkEvaluation(_homeworkEvaluation).subscribe(res => {
			console.log(res);
			this.dialogRef.close({ _homeworkEvaluation, isEdit: false });
			this.homeworkEvaluationCheckBoxList = [];
		}, err => {

		});
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
	_keyPress(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();

		}
	}
}

export class HomeworkEvaluationCheckBox {
	data: HomeworkEvaluationDtoModel;
	isChecked: boolean;
}