
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentAttendencesDataSource, StudentAttendenceDtoModel, selectStudentAttendencesActionLoading, AttendenceTypeService, AttendenceTypeModel, StudentAttendenceService } from '../../../../core/attendance';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { StudentAttendencesPageRequested, OneStudentAttendenceDeleted, ManyStudentAttendencesDeleted, StudentAttendencesStatusUpdated, StudentAttendenceUpdated, StudentAttendenceOnServerCreated, selectLastCreatedStudentAttendenceId } from '../../../../core/attendance';
import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';
import { StudentModel } from 'src/app/core/Models/student.model';
import { Constants } from '../../../../core/api_url';
@Component({
	selector: 'kt-student-attendance',
	templateUrl: './student-attendance.component.html',
	styleUrls: ['./student-attendance.component.scss']
})
export class StudentAttendanceComponent implements OnInit {

	// Table fields
	// dataSource: StudentAttendencesDataSource;
	//  dataSource = new MatTableDataSource(ELEMENT_DATA);

	dataSource : StudentAttendenceDtoModel[]= [];

	displayedColumns = ['id', 'admissionNo', 'date', 'rollNo', 'name', 'attendance', 'note'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	// Selection
	selection = new SelectionModel<StudentAttendenceDtoModel>(true, []);
	// studentAttendencesResult: StudentAttendenceDtoModel[] = [];
	// studentAttendenceForFill: StudentAttendenceDtoModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	// Public properties
	studentAttendence: StudentAttendenceDtoModel;
	studentAttendenceForm: FormGroup;
	searchForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	classId: number;
	sectionId: number;
	attendanceDate: string;


	classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	attendanceTypeList:AttendenceTypeModel[]=[];

	markAsHoliday:boolean=false;
	studentList: StudentModel[] = [];
	constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService,
		private attendanceTypeService:AttendenceTypeService,
		private attendanceService:StudentAttendenceService) { }

	ngOnInit() {

		this.loadAllClasses();
		this.loadAllSectionsByClassId(1);
		this.loadAllAttendanceType();
		this.addStudentAttendence();
		// Init DataSource
		// this.dataSource = new StudentAttendencesDataSource(this.store);

	}

//get All Class List

loadAllAttendanceType(){
	debugger
	this.attendanceTypeService.getAllAttendanceType().subscribe(res => {
		const data = res['data'];
		this.attendanceTypeList = data['content'];
		console.log(this.attendanceTypeList)
	}, err => {
	});
}
loadAllClasses() {
	debugger
	this.studentClassService.getAllStudentClasss().subscribe(res => {
		const data = res['data'];
		this.classList = data['content'];
		console.log(this.classList)
	}, err => {
	});
}
onClassSelectChange(classId){
	this.loadAllSectionsByClassId(classId);
}
loadAllSectionsByClassId(id:number) {
	debugger
	this.studentClassService.getAllSectionByClasssId(id).subscribe(res => {
		this.sectionList =  res['data'];
		console.log(this.sectionList)
	}, err => {
	});
}
	onSearch() {
		debugger;
		this.hasFormErrors = false;
		const controls = this.searchForm.controls;
		/** check form */
		if (this.searchForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
	const	date = this.typesUtilsService.dateFormat(controls.attendanceDate.value);
		this.getAllStudentAttendanceList(controls.classId.value, controls.sectionId.value, date);


	}


	getAllStudentAttendanceList(classId,sectionId,date){

		// const queryParams = new QueryParamsModel(
		// 	this.filterConfiguration(),
		// 	this.sort.direction,
		// 	this.sort.active,
		// 	this.paginator.pageIndex,
		// 	this.paginator.pageSize
		// );


	this.attendanceService.getAllStudentAddendaence(classId,sectionId,date).subscribe(res=>{
		console.log(res);
		// studentAttendencesResult
		const data   =res['data'];
		this.dataSource=data['content'];
	})

}


	// getAllStudentAttendanceList(classId, sectionId, date) {

	// 	// const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
	// 	// this.subscriptions.push(sortSubscription);

	// 	// const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
	// 	// 	tap(() => this.loadStudentAttendenceList(classId, sectionId, date))
	// 	// )
	// 	// 	.subscribe();
	// 	// this.subscriptions.push(paginatorSubscriptions);

	// 	// // Filtration, bind to searchInput
	// 	// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
	// 	// 	// tslint:disable-next-line:max-line-length
	// 	// 	debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
	// 	// 	distinctUntilChanged(), // This operator will eliminate duplicate values
	// 	// 	tap(() => {
	// 	// 		this.paginator.pageIndex = 0;
	// 	// 		this.loadStudentAttendenceList();
	// 	// 	})
	// 	// )
	// 	// .subscribe();
	// 	// this.subscriptions.push(searchSubscription);

	// 	// Init DataSource
	// 	// this.dataSource = new StudentAttendencesDataSource(this.store);

	// 	// const entitiesSubscription = this.dataSource.entitySubject.pipe(
	// 	// 	skip(1),
	// 	// 	distinctUntilChanged()
	// 	// ).subscribe(res => {
	// 	// 	// debugger
	// 	// 	console.log(res);
	// 	// 	this.studentAttendencesResult = res;
	// 	// 	console.log(this.studentAttendencesResult);
	// 	// 	if(this.studentAttendencesResult){
	// 	// 		this.studentAttendenceForFill=this.studentAttendencesResult;
	// 	// 	}
		
	// 	// });
	// 	// this.subscriptions.push(entitiesSubscription);
	// 	// // First load
	// 	// of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
	// 	// 	this.loadStudentAttendenceList(classId, sectionId, date);
	// 	// }); // Remove this line, just loading imitation



	// }


	/**
		 * On Destroy
		 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load StudentAttendences List from service through data-source
	 */
	loadStudentAttendenceList(classId, sectionId, date) {
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
		this.store.dispatch(new StudentAttendencesPageRequested({ page: queryParams, classId: classId, sectionId: sectionId, date: date }));
		this.selection.clear();
	}

//save Attendance button 
	onSaveAttendance(){
// console.log(this.studentAttendenceForFill);
console.log(this.dataSource);
this.markAsHoliday=false;

// const editedStudentAttendence = this.prepareStudentAttendence();
		// if (editedStudentAttendence.id > 0) {
		// 	this.updateStudentAttendence(editedStudentAttendence);
		// } else {

			this.createStudentAttendence(this.dataSource);
		// }

		const _saveMessage = 'Attendance has been created';

		const _messageType = MessageType.Create;

		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

		this.studentAttendenceForm.reset();

		this.addStudentAttendence();





	}
	onMarkAsHoliday(){
	this.markAsHoliday=true;

	var attendanceTypeObj = this.attendanceTypeList.find(x => x.type.toLowerCase() === Constants.HOLIDAY.toLowerCase());
    this.dataSource.forEach((ele,index)=>{	
	this.dataSource[index].attendenceTypeId=attendanceTypeObj.id;
	this.dataSource[index].attendenceType=attendanceTypeObj.type;

	})
	

}
	onChangeAttendanceType(index,attendanceType){
	
		var attendanceTypeObj = this.attendanceTypeList.find(x => x.type === attendanceType);
		console.log(attendanceTypeObj)
		this.dataSource[index].attendenceTypeId=attendanceTypeObj.id;
		console.log(this.dataSource[index].attendenceTypeId=attendanceTypeObj.id)
		
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;
		const searchText: string = '';
		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.studentAttendence = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete StudentAttendence
	 *
	 * @param _item: StudentAttendenceDtoModel
	 */
	deleteStudentAttendence(_item: StudentAttendenceDtoModel) {

		const _title = 'Attendance';
		const _description = 'Are you sure to permanently delete selected Attendance?';
		const _waitDesciption = 'Attendance is deleting...';
		const _deleteMessage = ' Selected Attendance has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneStudentAttendenceDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

		});


	}

	/**
	 * Show add StudentAttendence dialog
	 */
	addStudentAttendence() {
		this.studentAttendence = new StudentAttendenceDtoModel();
		this.studentAttendence.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit StudentAttendence dialog and save after success close result
	 * @param studentAttendence: StudentAttendenceDtoModel
	 */
	editStudentAttendence(studentAttendence: StudentAttendenceDtoModel) {

		this.studentAttendence = studentAttendence;
		this.createForm();

	}



	createForm() {
		debugger;
		this.searchForm = this.fb.group({
			classId: [this.classId, Validators.required],
			sectionId: [this.sectionId, Validators.required],
			attendanceDate: [this.typesUtilsService.getDateFromString(this.attendanceDate), Validators.compose([Validators.nullValidator])],

		})

		this.studentAttendenceForm = this.fb.group({

			admissionNo: [this.studentAttendence.admissionNo, Validators.required],
			attendence: [this.studentAttendence.attendence, Validators.required],
			attendenceType: [this.studentAttendence.attendenceType, Validators.required],
			attendenceTypeId: [this.studentAttendence.attendenceTypeId, Validators.required],
			biometricAttendence: [this.studentAttendence.biometricAttendence, Validators.required],
			biometricDeviceData: [this.studentAttendence.biometricDeviceData, Validators.required],
			date: [this.studentAttendence.date, Validators.required],
			firstname: [this.studentAttendence.firstname, Validators.required],
			gender: [this.studentAttendence.gender, Validators.required],
			lastname: [this.studentAttendence.lastname, Validators.required],
			note: [this.studentAttendence.note, Validators.required],
			rollNo: [this.studentAttendence.rollNo, Validators.required],
			studentSessionId: [this.studentAttendence.studentSessionId, Validators.required],

		});
	}


	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.studentAttendenceForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared StudentAttendence
	 */
	prepareStudentAttendence(): StudentAttendenceDtoModel {
		const controls = this.studentAttendenceForm.controls;
		const _studentAttendence = new StudentAttendenceDtoModel();
		_studentAttendence.id = this.studentAttendence.id;

		_studentAttendence.admissionNo = controls.admissionNo.value;
		_studentAttendence.attendence = controls.attendence.value;
		_studentAttendence.attendenceType = controls.attendenceType.value;

		_studentAttendence.attendenceTypeId = controls.attendenceTypeId.value;
		_studentAttendence.biometricAttendence = controls.biometricAttendence.value;
		_studentAttendence.biometricDeviceData = controls.biometricDeviceData.value;
		_studentAttendence.date = controls.date.value;
		_studentAttendence.firstname = controls.firstname.value;
		_studentAttendence.gender = controls.gender.value;
		_studentAttendence.lastname = controls.lastname.value;
		_studentAttendence.note = controls.note.value;
		_studentAttendence.rollNo = controls.rollNo.value;
		_studentAttendence.studentSessionId = controls.studentSessionId.value;


		return _studentAttendence;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		// this.hasFormErrors = false;
		// const controls = this.studentAttendenceForm.controls;
		// /** check form */
		// if (this.studentAttendenceForm.invalid) {
		// 	Object.keys(controls).forEach(controlName =>
		// 		controls[controlName].markAsTouched()
		// 	);

		// 	this.hasFormErrors = true;
		// 	return;
		// }

		// const editedStudentAttendence = this.prepareStudentAttendence();
		// if (editedStudentAttendence.id > 0) {
		// 	this.updateStudentAttendence(editedStudentAttendence);
		// } else {
		// 	this.createStudentAttendence(editedStudentAttendence);
		// }

		// const _saveMessage = editedStudentAttendence.id > 0 ? 'Attendance  has been updated' : 'Attendance has been created';

		// const _messageType = editedStudentAttendence.id > 0 ? MessageType.Update : MessageType.Create;

		// this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

		// this.studentAttendenceForm.reset();

		// this.addStudentAttendence();
		// this.studentAttendence.clear();
		// this.createForm();

	}
	onCancel() {
		this.studentAttendenceForm.reset();
		this.addStudentAttendence();
		// this.studentAttendence.clear();
		// this.createForm();
	}




	/**
	 * Update StudentAttendence
	 *
	 * @param _studentAttendence: StudentAttendenceDtoModel
	 */
	updateStudentAttendence(_studentAttendence: StudentAttendenceDtoModel) {
		const updateStudentAttendence: Update<StudentAttendenceDtoModel> = {
			id: _studentAttendence.id,
			changes: _studentAttendence
		};
		this.store.dispatch(new StudentAttendenceUpdated({
			partialStudentAttendence: updateStudentAttendence,
			studentAttendence: _studentAttendence
		}));


	}

	/**
	 * Create StudentAttendence
	 *
	 * @param _studentAttendence: StudentAttendenceDtoModel
	 */
	createStudentAttendence(_studentAttendence: StudentAttendenceDtoModel[]) {
		// this.store.dispatch(new StudentAttendenceOnServerCreated({ studentAttendence: _studentAttendence }));
		// this.componentSubscriptions = this.store.pipe(
		// 	select(selectLastCreatedStudentAttendenceId),
		// 	// delay(1000), // Remove this line
		// ).subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}

		// 	// this.dialogRef.close({ _studentAttendence, isEdit: false });
		// });

		const controls = this.searchForm.controls;
		const	date = this.typesUtilsService.dateFormat(controls.attendanceDate.value);
		_studentAttendence.forEach(ele=>{
			ele.date=date;
			ele.attendence=true;
		})


		this.attendanceService.createStudentAttendences(_studentAttendence).subscribe(res=>{

		},err=>{

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

