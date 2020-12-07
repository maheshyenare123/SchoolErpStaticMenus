// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassTimetableModel, selectClassTimetablesActionLoading, ClassTimetableUpdated, ClassTimetableOnServerCreated, selectLastCreatedClassTimetableId, ClassTimetableService, StudentClassService, SectionService, AssignClassTeacherService, StudentClassModel, SectionDtoModel, SubjectGroupService, SubjectDtoModel, SubjectGroupDtoModel, SubjectService, TimetableDayModel } from '../../../../../core/academics';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { StaffDtoModel } from 'src/app/core/academics/_models/staffDto.model';
import { selectAdmissionEnquirysActionLoading } from 'src/app/core/front-office';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-class-timetable-edit-dialog',
	templateUrl: './class-timetable-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ClassTimetableEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	classTimetable: ClassTimetableModel;
	searchForm: FormGroup;
	classTimetableForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	staffList: StaffDtoModel[] = [];
	subjectList: SubjectDtoModel[] = [];
	subjectGroupList: SubjectGroupDtoModel[] = [];
	day: string = "Monday";


	tabsForTabs = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	///
	classTimetablesData: ClassTimetableModel;
	showTimetableData: boolean = false;
	constructor(public dialogRef: MatDialogRef<ClassTimetableEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private classTimetableService: ClassTimetableService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService,
		private assignClassTeacherService: AssignClassTeacherService,
		private subjectService: SubjectService,
		private subjectGroupService: SubjectGroupService,

	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {

		//All Get Call
		debugger;
		this.loadAllStaff();
		this.loadAllClasses();
		this.loadAllSubject();
		this.loadAllSubjectGroup();

		this.store.pipe(select(selectClassTimetablesActionLoading)).subscribe(res => this.viewLoading = res);

		this.classTimetable = this.data.classTimetable;
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

	onClassSelectChange(classId) {
		this.loadAllSectionsByClassId(classId);
		var classObj = this.classList.find(x => x.id === classId);
		this.searchForm.controls.classes.setValue(classObj.classses);

	}
	onSectionSelectChange(subjectId) {
		var sectionObj = this.sectionList.find(x => x.id === subjectId);
		this.searchForm.controls.section.setValue(sectionObj.section);

	}
	onSubjectSelectChange(subjectId, indexi, indexj) {
		var subjectObj = this.subjectList.find(x => x.id === subjectId);
		let daysArray = this.classTimetableForm.get('days') as FormArray;
		let itemArray = daysArray.controls[indexi].get('items') as FormArray;
		itemArray.controls[indexj].get('subjectName').setValue(subjectObj.name);

	}
	onStaffSelectChange(staffId, indexi, indexj) {
		var staffObj = this.staffList.find(x => x.id === staffId);
		let daysArray = this.classTimetableForm.get('days') as FormArray;
		let itemArray = daysArray.controls[indexi].get('items') as FormArray;
		itemArray.controls[indexj].get('staffName').setValue(staffObj.name);

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
		this.searchForm = this.fb.group({
			classId: [this.classTimetable.classesId, Validators.required],
			classes: [this.classTimetable.classes,],
			sectionId: [this.classTimetable.sectionId, Validators.required],
			section: [this.classTimetable.section,],
			subjectGroupId: [this.classTimetable.subjectGroupId, Validators.required],


		})
		this.classTimetableForm = this.fb.group({
			// day: [this.classTimetable.day, Validators.required],
			// days:this.fb.array([this.createDaysRow()]),
			days: this.fb.array(this.tabsForTabs.map(tab => this.createDaysRow(tab))),

		});


	}

	createDaysRow(tab) {
		return this.fb.group({
			dayName: [tab,],
			items: this.fb.array([
				this.createItemRow(tab)
			]),
		});
	}
	createItemRow(dayName) {
		return this.fb.group({
			id: ['',],
			day: [dayName,],
			subjectId: ['',],
			subjectName: ['',],
			staffId: ['',],
			staffName: ['',],
			timeFrom: ['',],
			timeTo: ['',],
			roomNo: ['',],
			classesId: ['',],
			classes: ['',],
			sectionId: ['',],
			section: ['',],
			isActive: ['yes',]

		});
	}




	addItemRow(index, tab) {
		let daysArray = this.classTimetableForm.get('days') as FormArray;
		let itemArray = daysArray.controls[index].get('items') as FormArray;
		itemArray.push(this.createItemRow(tab));
	}

	removeItemRow(indexi, indexj, id) {

		//delete api

		if (id === "") {

			let daysArray = this.classTimetableForm.get('days') as FormArray;
			let itemArray = daysArray.controls[indexi].get('items') as FormArray;
			itemArray.removeAt(indexj);
		} else {
			var flag = this.deleteTimetableRow(id);
			if (flag) {
				let daysArray = this.classTimetableForm.get('days') as FormArray;
				let itemArray = daysArray.controls[indexi].get('items') as FormArray;
				itemArray.removeAt(indexj);
			}
		}

	}

	tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
		console.log('tabChangeEvent => ', tabChangeEvent);
		this.day = tabChangeEvent.tab.textLabel
		console.log('index => ', tabChangeEvent.index);
	}
	deleteTimetableRow(id): Observable<Boolean> {
		var flag;
		this.classTimetableService.deleteClassTimetable(id).subscribe(res => {
			flag = 1;
		}, er => {
			flag = 0;
		})
		return flag;
	}
	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.classTimetable.id > 0) {
			return `Edit Class Timetable '${this.classTimetable.id}'`;
		}

		return 'New Class Timetable';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.classTimetableForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared classTimetable
	 */
	prepareclassTimetable(): ClassTimetableModel {
		const controls = this.classTimetableForm.controls;
		const controls1 = this.searchForm.controls;
		const _classTimetable = new ClassTimetableModel();
		_classTimetable.id = this.classTimetable.id;

		_classTimetable.classesId = controls1.classId.value;
		// _classTimetable.classes = controls1.classes.value;
		_classTimetable.sectionId = controls1.sectionId.value;
		// _classTimetable.section = controls1.section.value;
		_classTimetable.subjectGroupId = controls1.subjectGroupId.value;
		// _classTimetable.day =  this.day// controls.day.value;

		const days = controls.days.value;
		console.log(days);

		// var timeTableArr = [];
		const _dayTimetable = new TimetableDayModel();
		for (var i = 0; i < days.length; i++) {
			// var day=days[i].dayName;
			// if(days[i].items[0].subjectId>0){
			// 	// timeTableArr.push({[day]:days[i].items});
			// }else{
			// 	// timeTableArr.push({[day]:[]});
			// }

			if (days[i].dayName == "Monday") {
				if (days[i].items[0].subjectId > 0) {

					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});

					_dayTimetable.monday = days[i].items;

				} else {
					_dayTimetable.monday = [];
				}

			} else if (days[i].dayName == "Tuesday") {
				if (days[i].items[0].subjectId > 0) {
					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});
					_dayTimetable.tuesday = days[i].items;
				} else {
					_dayTimetable.tuesday = [];
				}


			} else if (days[i].dayName == "Wednesday") {
				if (days[i].items[0].subjectId > 0) {
					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});
					_dayTimetable.wednesday = days[i].items;
				} else {
					_dayTimetable.wednesday = [];
				}

			}
			else if (days[i].dayName == "Thursday") {
				if (days[i].items[0].subjectId > 0) {
					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});
					_dayTimetable.thursday = days[i].items;
				} else {
					_dayTimetable.thursday = [];
				}

			}
			else if (days[i].dayName == "Friday") {
				if (days[i].items[0].subjectId > 0) {
					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});
					_dayTimetable.friday = days[i].items;
				} else {
					_dayTimetable.friday = [];
				}

			}
			else if (days[i].dayName == "Saturday") {
				if (days[i].items[0].subjectId > 0) {
					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});
					_dayTimetable.saturday = days[i].items;
				} else {
					_dayTimetable.saturday = [];
				}

			}
			else {
				if (days[i].items[0].subjectId > 0) {
					days[i].items.forEach(ele => {
						ele.classesId = controls1.classId.value;
						ele.classes = controls1.classes.value;
						ele.sectionId = controls1.sectionId.value;
						ele.section = controls1.section.value;
					});
					_dayTimetable.sunday = days[i].items;
				} else {
					_dayTimetable.sunday = [];
				}
			}

		}
		_classTimetable.timetable = _dayTimetable;
		// console.log(timeTableArr)
		// _classTimetable.timeTable =timeTableArr.toString;

		return _classTimetable;
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

		this.getAllClassTimetableListByservice(controls.classId.value, controls.sectionId.value);



	}
	getAllClassTimetableListByservice(classId, sectionId) {

		this.classTimetableService.getAllClassTimetables(classId, sectionId).subscribe(res => {
			this.classTimetablesData = res['data'];
			// this.timeTableData= this.classTimetablesResult.
			console.log(this.classTimetablesData);
			this.showTimetableData = true;
			this.setTimetableDataOnSearch(this.classTimetablesData);
		}, eror => {


		})

	}



	setTimetableDataOnSearch(data) {
		let daysArray = this.classTimetableForm.get('days') as FormArray;
		// let itemArray = daysArray.controls[index].get('items') as FormArray;
		const days = daysArray.value;


		days.forEach((element, indexj) => {

			if (element.dayName === "Monday") {

				if (data.timetable.monday.length > 0) {

					let itemArray = daysArray.controls[indexj].get('items') as FormArray;
					data.timetable.monday.forEach((element, indexi) => {

						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}
			} else if (element.dayName === "Tuesday") {


				if (data.timetable.tuesday.length > 0) {

					let itemArray = daysArray.controls[indexj].get('items') as FormArray;
					data.timetable.tuesday.forEach((element, indexi) => {


						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}
			} else if (element.dayName === "Wednesday") {



				if (data.timetable.wednesday.length > 0) {
					let itemArray = daysArray.controls[indexj].get('items') as FormArray;
					data.timetable.wednesday.forEach((element, indexi) => {

						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}

			} else if (element.dayName === "Thursday") {
				if (data.timetable.thursday.length > 0) {
					let itemArray = daysArray.controls[indexj].get('items') as FormArray;

					data.timetable.thursday.forEach((element, indexi) => {


						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}

			} else if (element.dayName === "Friday") {

				if (data.timetable.friday.length > 0) {
					let itemArray = daysArray.controls[indexj].get('items') as FormArray;

					data.timetable.friday.forEach((element, indexi) => {


						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}
			} else if (element.dayName === "Saturday") {

				if (data.timetable.saturday.length > 0) {

					let itemArray = daysArray.controls[indexj].get('items') as FormArray;

					data.timetable.saturday.forEach((element, indexi) => {

						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}
			} else if (element.dayName === "Sunday") {
				if (data.timetable.sunday.length > 0) {

					let itemArray = daysArray.controls[indexj].get('items') as FormArray;

					data.timetable.sunday.forEach((element, indexi) => {

						if (indexi != 0) {
							itemArray.push(this.createItemRow(element.dayName));
						}

						itemArray.controls[indexi].get('id').setValue(element.id);
						itemArray.controls[indexi].get('day').setValue(element.day);
						itemArray.controls[indexi].get('subjectId').setValue(element.subjectId);
						itemArray.controls[indexi].get('subjectName').setValue(element.subjectName);
						itemArray.controls[indexi].get('staffId').setValue(element.staffId);
						itemArray.controls[indexi].get('staffName').setValue(element.staffName);
						itemArray.controls[indexi].get('timeFrom').setValue(element.timeFrom);
						itemArray.controls[indexi].get('timeTo').setValue(element.timeTo);
						itemArray.controls[indexi].get('roomNo').setValue(element.roomNo);
						itemArray.controls[indexi].get('classesId').setValue(element.classesId);
						itemArray.controls[indexi].get('classes').setValue(element.classes);
						itemArray.controls[indexi].get('sectionId').setValue(element.sectionId);
						itemArray.controls[indexi].get('section').setValue(element.section);
						itemArray.controls[indexi].get('isActive').setValue(element.isActive);


					});
				}

			}


		})



	}





	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.classTimetableForm.controls;
		/** check form */
		if (this.classTimetableForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedclassTimetable = this.prepareclassTimetable();
		if (editedclassTimetable.id > 0) {
			this.updateClassTimetable(editedclassTimetable);
		} else {
			this.createClassTimetable(editedclassTimetable);
		}



	}

	// this.updateClassTimetable(editedclassTimetable);



	/**
	 * Update classTimetable
	 *
	 * @param _classTimetable: ClassTimetableModel
	 */
	updateClassTimetable(_classTimetable: ClassTimetableModel) {
		const updateClassTimetable: Update<ClassTimetableModel> = {
			id: _classTimetable.id,
			changes: _classTimetable
		};
		this.store.dispatch(new ClassTimetableUpdated({
			partialClassTimetable: updateClassTimetable,
			classTimetable: _classTimetable
		}));



		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _classTimetable, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _classTimetable, isEdit: true }
	}

	/**
	 * Create classTimetable
	 *
	 * @param _classTimetable: ClassTimetableModel
	 */
	createClassTimetable(_classTimetable: ClassTimetableModel) {
		// this.store.dispatch(new ClassTimetableOnServerCreated({ classTimetable: _classTimetable }));
		// this.componentSubscriptions = this.store.pipe(
		// 	select(selectLastCreatedClassTimetableId),
		// 	delay(1000), // Remove this line
		// ).subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}

		// 	this.dialogRef.close({ _classTimetable, isEdit: false });
		// });
		this.classTimetableService.createClassTimetable(_classTimetable).subscribe(res => {
			this.dialogRef.close({ _classTimetable, isEdit: false });
		}, err => {


		})

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

