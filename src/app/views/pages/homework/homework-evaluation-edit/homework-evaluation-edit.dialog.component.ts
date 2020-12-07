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
import { HomeworkDtoModel, HomeworkEvaluationDtoModel, selectHomeworksActionLoading, HomeworkUpdated, HomeworkOnServerCreated, selectLastCreatedHomeworkId,  HomeworkService } from '../../../../core/homework';
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
	ckeConfig:any;
	// referenceList:ReferenceModel[] = [];
	// sourceList:SourceModel[]=[];
classList=[]
	constructor(public dialogRef: MatDialogRef<HomeworkEvaluationEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		// private referenceService:ReferenceService,
		// private sourceService:SourceService,
		private homeworkService:HomeworkService
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
		//All Get Call
		// this.loadAllReferences();
		// this.loadAllSources();
		//this.loadAllClasses();

		this.store.pipe(select(selectHomeworksActionLoading)).subscribe(res => this.viewLoading = res);
		
		this.homework = this.data.homework;
		this.createForm();
	}

// 	//get All Complain Type List
// loadAllReferences() {
// 	debugger
// 	this.referenceService.getAllReferences().subscribe(res => {
// 		const data=res['data'];
// 		this.referenceList=data['content'];
// 	}, err => {
// 	});
// }
// 	//get All Source List
// loadAllSources() {
// 	debugger
// 	this.sourceService.getAllSources().subscribe(res => {
// 		const data=res['data'];
// 		this.sourceList=data['content'];
// 	}, err => {
// 	});
// }
	//get All Class List
	// loadAllClasses() {
	// 	debugger
	// 	this.homeworkService.getAllClasses().subscribe(res => {
	// 		const data=res['data'];
	// 		this.classList=data['content'];
	// 		console.log(this.classList)
	// 	}, err => {
	// 	});
	// }
	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm() {
		this.homeworkForm = this.fb.group({
			classes: [this.homework.classes, Validators.required],
			classesId: [this.homework.classesId, Validators.required],
			section: [this.homework.section, Validators.required],
			sectionId: [this.homework.sectionId, Validators.required],
			subjectGroupSubjectId: [this.homework.subjectGroupSubjectId, Validators.required],
			subjectId: [this.homework.subjectId, Validators.required],
			subjectName: [this.homework.subjectName, Validators.required],
			homeworkDate: [this.typesUtilsService.getDateFromString(this.homework.homeworkDate), Validators.compose([Validators.nullValidator])],
			submitDate: [this.typesUtilsService.getDateFromString(this.homework.submitDate), Validators.compose([Validators.nullValidator])],
			evaluationDate: [this.typesUtilsService.getDateFromString(this.homework.evaluationDate), Validators.compose([Validators.nullValidator])],
			description: [this.homework.description, Validators.required],
			
			// isActive: string;

		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.homework.id > 0) {
			return `Edit homework '${this.homework.staffName}'`;
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
	preparehomework(): HomeworkDtoModel {
		const controls = this.homeworkForm.controls;
		const _homework = new HomeworkDtoModel();
		_homework.id = this.homework.id;
	
		_homework.classes = controls.classes.value;
		_homework.classesId = controls.classesId.value;
		_homework.section = controls.section.value;
		_homework.sectionId = controls.sectionId.value;
		_homework.subjectGroupSubjectId = controls.subjectGroupSubjectId.value;
		_homework.subjectId = controls.subjectId.value;
		_homework.subjectName = controls.subjectName.value;
		_homework.description = controls.description.value;
		

		const _homeworkDate = controls.homeworkDate.value;
		if (_homeworkDate) {
			_homework.homeworkDate = this.typesUtilsService.dateFormat(_homeworkDate);
		} else {
			_homework.homeworkDate = '';
		}
		const _submitDate = controls.submitDate.value;
		if (_submitDate) {
			_homework.submitDate = this.typesUtilsService.dateFormat(_submitDate);
		} else {
			_homework.submitDate = '';
		}
		const _evaluationDate = controls.evaluationDate.value;
		if (_evaluationDate) {
			_homework.evaluationDate = this.typesUtilsService.dateFormat(_evaluationDate);
		} else {
			_homework.evaluationDate = '';
		}




		
		return _homework;
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
		if (editedHomework.id > 0) {
			this.updateHomework(editedHomework);
		} else {
			this.createHomework(editedHomework);
		}


		
	}

	studentChange($event){
		if($event.target.checked === true){

			// date: string;
			// homeworkId: number;
			// id: number;
			// isActive: string;
			// status: string;
			// studentAdmissionNo: string;
			// studentFirstName: string;
			// studentId: number;
			// studentLastName: string;
			// studentSessionId: number;

			// Map this variable to selected student data pojo and common homework pojo push to list

			//this.homeworkevaluationList.push
	
		}else{
	
		}
	}
	/**
	 * Update homework
	 *
	 * @param _homework: HomeworkDtoModel
	 */
	updateHomework(_homework: HomeworkDtoModel) {
		const updateHomework: Update<HomeworkDtoModel> = {
			id: _homework.id,
			changes: _homework
		};
		this.store.dispatch(new HomeworkUpdated({
			partialHomework: updateHomework,
			homework: _homework
		}));

		

		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _homework, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _homework, isEdit: true }
	}

	/**
	 * Create homework
	 *
	 * @param _homework: HomeworkDtoModel
	 */
	createHomework(_homework: HomeworkDtoModel) {
		this.store.dispatch(new HomeworkOnServerCreated({ homework: _homework }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedHomeworkId),
			delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _homework, isEdit: false });
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

