
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StaffAttendancesDataSource, StaffAttendanceModel, selectStaffAttendancesActionLoading, RoleService } from '../../../../core/human-resource';
import { AttendenceTypeService, AttendenceTypeModel } from '../../../../core/attendance';
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
import { StaffAttendancesPageRequested, OneStaffAttendanceDeleted, ManyStaffAttendancesDeleted, StaffAttendancesStatusUpdated, StaffAttendanceUpdated, StaffAttendanceOnServerCreated, selectLastCreatedStaffAttendanceId } from '../../../../core/human-resource';
import { RolesDtoModel } from 'src/app/core/Models/rolesDto.model';
// import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';


@Component({
  selector: 'kt-staff-attendance',
  templateUrl: './staff-attendance.component.html',
  styleUrls: ['./staff-attendance.component.scss']
})
export class StaffAttendanceComponent implements OnInit {

  // Table fields
	dataSource: StaffAttendancesDataSource;
	//  dataSource = new MatTableDataSource(ELEMENT_DATA);


	displayedColumns = ['id', 'staffId', 'name', 'role', 'attendance', 'note'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	// Selection
	selection = new SelectionModel<StaffAttendanceModel>(true, []);
	staffAttendancesResult: StaffAttendanceModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	// Public properties
	staffAttendance: StaffAttendanceModel;
	staffAttendanceForm: FormGroup;
	searchForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	searchText : number;
  roleId : number;


	// classList: StudentClassModel[] = [];
	// sectionList: SectionDtoModel[] = [];
	attendanceTypeList:AttendenceTypeModel[]=[];
	rolesList: RolesDtoModel[] = [];
	constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		// private studentClassService: StudentClassService,
		// private sectionService: SectionService,
		private attendanceTypeService:AttendenceTypeService,
		private roleService:RoleService,) { }

	ngOnInit() {

		this.loadAllRoles();
		// this.loadAllClasses();
		// this.loadAllSectionsByClassId(1);
		this.loadAllAttendanceType();
		this.addStaffAttendance();
		// Init DataSource
		this.dataSource = new StaffAttendancesDataSource(this.store);

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
// loadAllClasses() {
// 	debugger
// 	this.studentClassService.getAllStudentClasss().subscribe(res => {
// 		const data = res['data'];
// 		this.classList = data['content'];
// 		console.log(this.classList)
// 	}, err => {
// 	});
// }
// onClassSelectChange(classObj:StudentClassModel){
// 	// this.loadAllSectionsByClassId(classObj.id);
// }
// loadAllSectionsByClassId(id:number) {
// 	debugger
// 	this.sectionService.getAllSections().subscribe(res => {
// 		const data = res['data'];
// 		this.sectionList = data['content'];
// 		console.log(this.sectionList)
// 	}, err => {
// 	});
// }


loadAllRoles() {
	debugger
	this.roleService.getAllRoles().subscribe(res => {
	  const data = res['data'];
	  this.rolesList = data['content'];
	  console.log(this.rolesList)
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
	const	date = this.typesUtilsService.dateFormat(new Date());
		this.getAllStudentAttendanceList(controls.roleId.value, date);


	}

	getAllStudentAttendanceList(roleId,date) {

		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadStaffAttendanceList(this.roleId, this.searchText))
		)
			.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// // Filtration, bind to searchInput
		// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
		// 	// tslint:disable-next-line:max-line-length
		// 	debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
		// 	distinctUntilChanged(), // This operator will eliminate duplicate values
		// 	tap(() => {
		// 		this.paginator.pageIndex = 0;
		// 		this.loadStaffAttendanceList();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new StaffAttendancesDataSource(this.store);

		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			// debugger
			console.log(res);
			this.staffAttendancesResult = res;
			console.log(this.staffAttendancesResult);
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadStaffAttendanceList(this.roleId, this.searchText);
		}); // Remove this line, just loading imitation



	}


	/**
		 * On Destroy
		 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load StaffAttendances List from service through data-source
	 */
	loadStaffAttendanceList(roleId, searchText) {
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
	//	this.store.dispatch(new StaffAttendancesPageRequested({ page: queryParams, roleId: roleId, searchText: searchText }));
		this.selection.clear();
	}

//save Attendance button 
	onSaveAttendance(){
console.log(this.staffAttendancesResult);
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
		filter.staffAttendance = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete StaffAttendance
	 *
	 * @param _item: StaffAttendanceModel
	 */
	deleteStaffAttendance(_item: StaffAttendanceModel) {

		const _title = 'Purpose';
		const _description = 'Are you sure to permanently delete selected purpose?';
		const _waitDesciption = 'Purpose is deleting...';
		const _deleteMessage = ' Selected purpose has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneStaffAttendanceDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);

		});


	}

	/**
	 * Show add StaffAttendance dialog
	 */
	addStaffAttendance() {
		this.staffAttendance = new StaffAttendanceModel();
		this.staffAttendance.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit StaffAttendance dialog and save after success close result
	 * @param staffAttendance: StaffAttendanceModel
	 */
	editStaffAttendance(staffAttendance: StaffAttendanceModel) {

		this.staffAttendance = staffAttendance;
		this.createForm();

	}



	createForm() {
		debugger;
		this.searchForm = this.fb.group({
			roleId: [this.roleId, ],
      		searchText: [this.searchText, ],
   
		})

		this.staffAttendanceForm = this.fb.group({

			attendence: [this.staffAttendance.attendence, Validators.required],
			attendenceType: [this.staffAttendance.attendenceType, Validators.required],
			attendenceTypeId: [this.staffAttendance.attendenceTypeId, Validators.required],
			biometricAttendence: [this.staffAttendance.biometricAttendence, Validators.required],
			biometricDeviceData: [this.staffAttendance.biometricDeviceData, Validators.required],
			date: [this.staffAttendance.date, Validators.required],
			employeeId: [this.staffAttendance.employeeId, Validators.required],
			name: [this.staffAttendance.name, Validators.required],
			role: [this.staffAttendance.role, Validators.required],
			note: [this.staffAttendance.note, Validators.required],
			roleId: [this.staffAttendance.roleId, Validators.required],
			staffId: [this.staffAttendance.staffId, Validators.required],

		});
	}


	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.staffAttendanceForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared staffAttendance
	 */
	prepareStaffAttendance(): StaffAttendanceModel {
		const controls = this.staffAttendanceForm.controls;
		const _staffAttendance = new StaffAttendanceModel();
		_staffAttendance.id = this.staffAttendance.id;

		_staffAttendance.attendence = controls.attendence.value;
		_staffAttendance.attendenceType = controls.attendenceType.value;
		_staffAttendance.attendenceTypeId = controls.attendenceTypeId.value;
		_staffAttendance.biometricAttendence = controls.biometricAttendence.value;
		_staffAttendance.biometricDeviceData = controls.biometricDeviceData.value;
    _staffAttendance.date = controls.date.value;
    _staffAttendance.employeeId = controls.employeeId.value;
		_staffAttendance.name = controls.name.value;
    _staffAttendance.note = controls.note.value;
    _staffAttendance.role = controls.role.value;
		_staffAttendance.roleId = controls.roleId.value;
		_staffAttendance.staffId = controls.staffId.value;

		return _staffAttendance;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.staffAttendanceForm.controls;
		/** check form */
		if (this.staffAttendanceForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedStaffAttendance = this.prepareStaffAttendance();
		if (editedStaffAttendance.id > 0) {
			this.updateStaffAttendance(editedStaffAttendance);
		} else {
			this.createStaffAttendance(editedStaffAttendance);
		}

		const _saveMessage = editedStaffAttendance.id > 0 ? 'Purpose  has been updated' : 'Purpose has been created';

		const _messageType = editedStaffAttendance.id > 0 ? MessageType.Update : MessageType.Create;

		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

		this.staffAttendanceForm.reset();

		this.addStaffAttendance();
		// this.staffAttendance.clear();
		// this.createForm();

	}
	onCancel() {
		this.staffAttendanceForm.reset();
		this.addStaffAttendance();
		// this.staffAttendance.clear();
		// this.createForm();
	}



	/**
 * Mark As Holiday
 */
	markAsHoliday() {

		//search api

	}

	/**
 * On Save
 */
	onSave() {



	}
	/**
	 * Update StaffAttendance
	 *
	 * @param _staffAttendance: StaffAttendanceModel
	 */
	updateStaffAttendance(_staffAttendance: StaffAttendanceModel) {
		const updateStaffAttendance: Update<StaffAttendanceModel> = {
			id: _staffAttendance.id,
			changes: _staffAttendance
		};
		this.store.dispatch(new StaffAttendanceUpdated({
			partialStaffAttendance: updateStaffAttendance,
			staffAttendance: _staffAttendance
		}));


	}

	/**
	 * Create StaffAttendance
	 *
	 * @param _staffAttendance: StaffAttendanceModel
	 */
	createStaffAttendance(_staffAttendance: StaffAttendanceModel) {
		this.store.dispatch(new StaffAttendanceOnServerCreated({ staffAttendance: _staffAttendance }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedStaffAttendanceId),
			// delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			// this.dialogRef.close({ _staffAttendance, isEdit: false });
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

