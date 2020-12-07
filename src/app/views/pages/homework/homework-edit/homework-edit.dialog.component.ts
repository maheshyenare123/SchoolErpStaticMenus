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
import { HomeworkDtoModel, selectHomeworksActionLoading, HomeworkUpdated, HomeworkOnServerCreated, selectLastCreatedHomeworkId, HomeworkService } from '../../../../core/homework';
import { SectionService, SubjectService, StudentClassService, StudentClassModel, SectionDtoModel, SubjectDtoModel, SubjectGroupDtoModel, SubjectGroupService } from 'src/app/core/academics';
// Services and Models


@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-homework-edit-dialog',
	templateUrl: './homework-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class HomeworkEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	homework: HomeworkDtoModel;
	homeworkForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;
	files: File[] = [];
	ckeConfig: any;



	classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	subjectList: SubjectDtoModel[] = [];
	subjectGroupList: SubjectGroupDtoModel[] = [];
	constructor(public dialogRef: MatDialogRef<HomeworkEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private subjectService: SubjectService,
		private subjectGroupService: SubjectGroupService,
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {

		// All Get Call
		this.loadAllSubject();
		this.loadAllClasses();
		this.loadAllSubjectGroup();

		this.store.pipe(select(selectHomeworksActionLoading)).subscribe(res => this.viewLoading = res);

		this.homework = this.data.homework;
		this.createForm();
	}


	//get All Class List
	loadAllClasses() {
		debugger
		this.studentClassService.getAllStudentClasss().subscribe(res => {
			const data = res['data'];
			this.classList = data['content'];
			console.log(this.classList)
		}, err => {
		});
	}
	loadAllSectionsByClassId(id: number) {
		debugger
		this.studentClassService.getAllSectionByClasssId(id).subscribe(res => {

			this.sectionList = res['data'];
			console.log(this.sectionList)

		}, err => {
		});
	}

	loadAllSubject() {
		debugger
		this.subjectService.getAllSubjects().subscribe(res => {
			const data = res['data'];
			this.subjectList = data['content'];
			console.log(this.subjectList)


		}, err => {
		});
	}
	loadAllSubjectGroup() {
		debugger
		this.subjectGroupService.getAllSubjectGroups().subscribe(res => {
			const data = res['data'];
			this.subjectGroupList = data['content'];
			console.log(this.subjectList)
		}, err => {
		});
	}

	onClassSelectChange(classId) {
		this.loadAllSectionsByClassId(classId);
		var classObj = this.classList.find(x => x.id === classId);
		this.homeworkForm.controls.classes.setValue(classObj.classses);

	}
	onSectionSelectChange(subjectId) {

		var sectionObj = this.sectionList.find(x => x.id === subjectId);
		this.homeworkForm.controls.section.setValue(sectionObj.section);

	}
	onSubjectSelectChange(subjectId) {

		var subjectObj = this.subjectList.find(x => x.id === subjectId);
		this.homeworkForm.controls.subjectName.setValue(subjectObj.name);

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
			description: [this.homework.description, Validators.required],
			assigned: ['', Validators.required],
			staffId: [this.homework.staffId, ''],
			staffName: [this.homework.staffName, ''],


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

		if (_homework.id > 0) {
			_homework.isActive = this.homework.isActive;
		} else {
			_homework.isActive = 'yes';
		}

		_homework.classes = controls.classes.value;
		_homework.classesId = controls.classesId.value;
		_homework.section = controls.section.value;
		_homework.sectionId = controls.sectionId.value;
		_homework.subjectGroupSubjectId = controls.subjectGroupSubjectId.value;
		_homework.subjectId = controls.subjectId.value;
		_homework.subjectName = controls.subjectName.value;
		_homework.description = controls.description.value;

		_homework.staffId = 1;
		// _homework.evaluatedBy = 1;
		_homework.document=" ";
		_homework.staffName=controls.staffName.value;
		
		// 		"evaluatedBy": 0,
		//   "evaluationDate":
		// {"id":0,"isActive":"yes","classes":"First","classesId":8,"section":"A","sectionId":1,"subjectGroupSubjectId":4,"subjectId":1,"subjectName":"marathi","description":"not","staffId":1,"homeworkDate":"2020-11-5","submitDate":"2020-11-5"}
		// _homework.staffName =

		const _homeworkDate = controls.homeworkDate.value;
		if (_homeworkDate) {
			_homework.homeworkDate = this.typesUtilsService.dateFormat(_homeworkDate);
		} else {
			_homework.homeworkDate = '';
		}
		const _submitDate = controls.submitDate.value;
		if (_submitDate) {
			_homework.submitDate = this.typesUtilsService.dateFormat(_submitDate);
			// _homework.evaluationDate=this.typesUtilsService.dateFormat(_submitDate);
		} else {
			_homework.submitDate = '';
		}
		return _homework;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
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

