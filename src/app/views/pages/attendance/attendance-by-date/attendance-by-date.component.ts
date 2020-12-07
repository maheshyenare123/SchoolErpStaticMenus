
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentAttendencesDataSource, StudentAttendenceDtoModel,selectStudentAttendencesActionLoading } from '../../../../core/attendance';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from '../../../../core/_base/crud';
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
import { SectionService, StudentClassService, StudentClassModel, SectionDtoModel } from 'src/app/core/academics';

@Component({
  selector: 'kt-attendance-by-date',
  templateUrl: './attendance-by-date.component.html',
  styleUrls: ['./attendance-by-date.component.scss']
})
export class AttendanceByDateComponent implements OnInit {

   // Table fields
dataSource: StudentAttendencesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);

   
displayedColumns = ['id', 'admissionNo','date','rollNo','name','attendance','note'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<StudentAttendenceDtoModel>(true, []);
studentAttendencesResult: StudentAttendenceDtoModel[] = [];
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

classId : number;
sectionId : number;
attendanceDate: string;


classList: StudentClassModel[] = [];
sectionList: SectionDtoModel[] = [];
  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService) { }

  ngOnInit() {

	debugger;
	
	this.loadAllClasses();
		this.loadAllSectionsByClassId(1);
		this.dataSource = new StudentAttendencesDataSource(this.store);

    this.createForm();
		
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

/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load StudentAttendences List from service through data-source
	 */
	loadStudentAttendenceList(classId,sectionId,date) {
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
		this.store.dispatch(new StudentAttendencesPageRequested({ page: queryParams,classId,sectionId,date }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;
		const searchText='';
		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.studentAttendence = searchText;
		return filter;
	}

	


createForm() {
  debugger;
  this.searchForm = this.fb.group({
    classId: [this.classId, Validators.required],
    sectionId: [this.sectionId, Validators.required],
    attendanceDate: [this.typesUtilsService.getDateFromString(this.attendanceDate), Validators.compose([Validators.nullValidator])],

  })

	
}


	/**
	 * On Search
	 */
	onSearch() {
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

		//search api
		const	date = this.typesUtilsService.dateFormat(controls.attendanceDate.value);
		this.getAllStudentAttendanceList(controls.classId.value, controls.sectionId.value, date);


		
	}

	getAllStudentAttendanceList(classId,sectionId,date){



		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadStudentAttendenceList(classId,sectionId,date))
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
		// 	// tslint:disable-next-line:max-line-length
		// 	debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
		// 	distinctUntilChanged(), // This operator will eliminate duplicate values
		// 	tap(() => {
		// 		this.paginator.pageIndex = 0;
		// 		this.loadStudentAttendenceList(classId,sectionId,date);
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new StudentAttendencesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.studentAttendencesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadStudentAttendenceList(classId,sectionId,date);
		}); // Remove this line, just loading imitation

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

