
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AssignClassTeachersDataSource, AssignClassTeacherModel, StudentClassService, StudentClassModel, SectionService, AssignClassTeacherService, SectionDtoModel } from '../../../../core/academics';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { AssignClassTeachersPageRequested, OneAssignClassTeacherDeleted, ManyAssignClassTeachersDeleted, AssignClassTeachersStatusUpdated, AssignClassTeacherUpdated, AssignClassTeacherOnServerCreated, selectLastCreatedAssignClassTeacherId } from '../../../../core/academics';
import { StaffDtoModel } from '../../../../core/academics/_models/staffDto.model';
import { element } from 'protractor';
import { ClassDtoModel } from 'src/app/core/academics/_models/classDto.model';

@Component({
	selector: 'kt-assign-class-teacher',
	templateUrl: './assign-class-teacher.component.html',
	styleUrls: ['./assign-class-teacher.component.scss']
})
export class AssignClassTeacherComponent implements OnInit {

	// Table fields
	dataSource: AssignClassTeachersDataSource;
	//  dataSource = new MatTableDataSource(ELEMENT_DATA);
	displayedColumns = ['id', 'class', 'section', 'staff', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	// Selection
	selection = new SelectionModel<AssignClassTeacherModel>(true, []);
	assignClassTeachersResult: AssignClassTeacherModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	// Public properties
	assignClassTeacher: AssignClassTeacherModel;
	assignClassTeacherForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;


	classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	staffList: StaffDtoModel[] = [];
	staffCheckBoxList: StaffCheckBox[] = [];
	constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService,
		private assignClassTeacherService: AssignClassTeacherService) { }

	ngOnInit() {

		debugger;
		this.loadAllStaff();
		this.loadAllClasses();
		this.loadAllSections();


		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadAssignClassTeacherList())
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadAssignClassTeacherList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new AssignClassTeachersDataSource(this.store);

		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
			console.log(res);
			this.assignClassTeachersResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadAssignClassTeacherList();
		}); // Remove this line, just loading imitation


		this.addAssignClassTeacher();
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
	loadAllSections() {
		debugger
		this.sectionService.getAllSections().subscribe(res => {
			const data = res['data'];
			this.sectionList = data['content'];
			console.log(this.sectionList)
		}, err => {
		});
	}

	loadAllStaff() {
		debugger
		this.assignClassTeacherService.getAllStaffs().subscribe(res => {
			console.log("response collage List")
			console.log(res)
			const data = res['data'];
			this.staffList = data['content'];
			console.log(this.staffList)
			// this.setDataInChecboxList();
		
		}, err => {
		});
	}
setDataInChecboxList(){
	this.staffList.forEach(element => {
		this.staffCheckBoxList.push({ 'data': element, 'isChecked': false })
	})
}


	/**
		 * On Destroy
		 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load AssignClassTeachers List from service through data-source
	 */
	loadAssignClassTeacherList() {
		debugger;
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(new AssignClassTeachersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.name = searchText;
		filter.classSection = searchText;
		filter.subject = searchText;

		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete AssignClassTeacher
	 *
	 * @param _item: AssignClassTeacherModel
	 */
	deleteAssignClassTeacher(_item: AssignClassTeacherModel) {

		const _title = 'Assign Class Teacher';
		const _description = 'Are you sure to permanently delete selected Assign Class Teacher?';
		const _waitDesciption = 'Assign Class Teacher is deleting...';
		const _deleteMessage = ' Selected Assign Class Teacher has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneAssignClassTeacherDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadAssignClassTeacherList();
		});


	}

	/**
	 * Show add AssignClassTeacher dialog
	 */
	addAssignClassTeacher() {
		this.assignClassTeacher = new AssignClassTeacherModel();
		this.assignClassTeacher.clear(); //
		this.createForm();


	}

	/**
	 * Show Edit AssignClassTeacher dialog and save after success close result
	 * @param assignClassTeacher: AssignClassTeacherModel
	 */
	editAssignClassTeacher(assignClassTeacher: AssignClassTeacherModel) {

		this.assignClassTeacher = assignClassTeacher;
		this.createForm();
		// this.setDataInChecboxList();

		// this.staffCheckBoxList.forEach(element => {
		// 	this.assignClassTeacher.staffs.forEach(innerElement => {
		// 		if (element.data.id == innerElement.id) {
		// 			element.isChecked = true;
		// 		}
		// 	})


		// })


	}



	createForm() {
		debugger;


		this.assignClassTeacherForm = this.fb.group({
			classId: [this.assignClassTeacher.classId, Validators.required],
			// classes: [this.assignClassTeacher.classes, ''],
			sectionId: [this.assignClassTeacher.sectionId, Validators.required],
			// section: [this.assignClassTeacher.section, ''],
			staffId: [this.assignClassTeacher.staffId, Validators.required],
			// staffName: [this.assignClassTeacher.staffName, ''],
		});
		// this.createStaffRow();




	}

	onCheckBoxChanges(_isChecked: boolean, id: number) {
		// get current position of the changes element by ID
		const index = this.staffCheckBoxList.findIndex(_ => _.data.id === id);
		// if (!(index > -1)) return;

		// const isChecked = this.checkBoxes[index].isChecked;
		if (_isChecked) {
			this.staffCheckBoxList[index].isChecked = _isChecked;
		}else{
			this.staffCheckBoxList[index].isChecked = _isChecked;
		}
	}



	


	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.assignClassTeacherForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared AssignClassTeacher
	 */
	prepareAssignClassTeacher(): AssignClassTeacherModel {
		const controls = this.assignClassTeacherForm.controls;
		const _assignClassTeacher = new AssignClassTeacherModel();
		_assignClassTeacher.id = this.assignClassTeacher.id;


		_assignClassTeacher.classId = controls.classId.value;
		_assignClassTeacher.sectionId = controls.sectionId.value;
		_assignClassTeacher.staffId = controls.staffId.value;
		 

	  const classes=this.classList.find(_ => _.id === controls.classId.value);
		_assignClassTeacher.classes=classes.classses;
	var section	=this.sectionList.find(_ => _.id === controls.sectionId.value);

		_assignClassTeacher.section =section.section;

	var staff	=this.staffList.find(_ => _.id === controls.staffId.value);
		_assignClassTeacher.staffName= staff.name+" "+staff.surname;
	



		// const staffData: StaffDtoModel[] = [];
		// this.staffCheckBoxList.forEach(element => {
		// 	if (element.isChecked) {
		// 		staffData.push(element.data);
		// 	}
		// })
		// _assignClassTeacher.staffs = staffData;
		return _assignClassTeacher;

	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.assignClassTeacherForm.controls;
		/** check form */
		if (this.assignClassTeacherForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedAssignClassTeacher = this.prepareAssignClassTeacher();
		console.log(editedAssignClassTeacher)
		if (editedAssignClassTeacher.id > 0) {
			this.updateAssignClassTeacher(editedAssignClassTeacher);
		} else {
			this.createAssignClassTeacher(editedAssignClassTeacher);
		}
		this.loadAssignClassTeacherList();
		const _saveMessage = editedAssignClassTeacher.id > 0 ? 'Assign Class Teacher has been updated' : 'Assign Class Teacher has been created';

		const _messageType = editedAssignClassTeacher.id > 0 ? MessageType.Update : MessageType.Create;

		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

		this.assignClassTeacherForm.reset();

		this.addAssignClassTeacher();
		this.staffCheckBoxList = [];
		this.setDataInChecboxList();
		// this.assignClassTeacher.clear();
		// this.createForm();

	}
	onCancel() {
		this.assignClassTeacherForm.reset();
		this.addAssignClassTeacher();
		// this.assignClassTeacher.clear();
		// this.createForm();
		this.staffCheckBoxList = [];
		this.setDataInChecboxList();
	}
	/**
	 * Update AssignClassTeacher
	 *
	 * @param _assignClassTeacher: AssignClassTeacherModel
	 */
	updateAssignClassTeacher(_assignClassTeacher: AssignClassTeacherModel) {
		const updateAssignClassTeacher: Update<AssignClassTeacherModel> = {
			id: _assignClassTeacher.id,
			changes: _assignClassTeacher
		};
		this.store.dispatch(new AssignClassTeacherUpdated({
			partialAssignClassTeacher: updateAssignClassTeacher,
			assignClassTeacher: _assignClassTeacher
		}));


	}

	/**
	 * Create AssignClassTeacher
	 *
	 * @param _assignClassTeacher: AssignClassTeacherModel
	 */
	createAssignClassTeacher(_assignClassTeacher: AssignClassTeacherModel) {
		this.store.dispatch(new AssignClassTeacherOnServerCreated({ assignClassTeacher: _assignClassTeacher }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedAssignClassTeacherId),
			// delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			// this.dialogRef.close({ _assignClassTeacher, isEdit: false });
		});
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}


}
// export class NgbdTimepickerSteps {
//     time: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
//     hourStep = 1;
//     minuteStep = 15;
//     secondStep = 30;
// }

export class StaffCheckBox {
	data: StaffDtoModel;
	isChecked: boolean;
}