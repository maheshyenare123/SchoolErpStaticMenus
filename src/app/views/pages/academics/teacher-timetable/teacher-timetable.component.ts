
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClassTimetablesDataSource, ClassTimetableModel,selectClassTimetablesActionLoading, StaffTimetableService, TimetableDayModel } from '../../../../core/academics';
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
import { ClassTimetablesPageRequested, OneClassTimetableDeleted, ManyClassTimetablesDeleted, ClassTimetablesStatusUpdated, ClassTimetableUpdated, ClassTimetableOnServerCreated, selectLastCreatedClassTimetableId } from '../../../../core/academics';
import { StaffService } from 'src/app/core/human-resource';
import { StaffDtoModel } from 'src/app/core/academics/_models/staffDto.model';


@Component({
  selector: 'kt-teacher-timetable',
  templateUrl: './teacher-timetable.component.html',
  styleUrls: ['./teacher-timetable.component.scss']

})
export class TeacherTimetableComponent implements OnInit {

  // Table fields
dataSource: ClassTimetablesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['mon', 'tue', 'wed', 'thus', 'fri', 'sat', 'sun'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ClassTimetableModel>(true, []);
classTimetablesResult: ClassTimetableModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
classTimetable: ClassTimetableModel;
classTimetableForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
loading:boolean=false;
staffList: StaffDtoModel[] = [];
private componentSubscriptions: Subscription;

classTimetablesData:TimetableDayModel;


  constructor(
    public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
	private typesUtilsService: TypesUtilsService,
	private staffService:StaffService,
	private staffTimetableService:StaffTimetableService
    ) { }

  ngOnInit() {

	debugger;
	this.loadAllTeachers();
	this.createForm	();
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
  }
  
  //get All Complain Type List
loadAllTeachers() {
	debugger
	this.staffService.getAllStaffs().subscribe(res => {
		const data=res['data'];
		this.staffList=data['content'];
	}, err => {
	});
}
onSearch(){
	debugger;
	
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
  this.loading=true;
		  this.getAllClassTimetableListByservice(controls.staffId.value);
  
  
  
  }
getAllClassTimetableListByservice(staffId){

	this.staffTimetableService.getAllStaffTimetables(staffId).subscribe(res=>{
	  this.classTimetablesData=res['data'];
	  // this.timeTableData= this.classTimetablesResult.
	  console.log(  this.classTimetablesData);
	  this.loading=false;
	},eror=>{
	
	
	})
	
	}
	/**
	 * Load ClassTimetables List from service through data-source
	 */
	loadClassTimetableList() {
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
		// this.store.dispatch(new ClassTimetablesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

    filter.ClassTimetable = searchText;
    
		if (!searchText) {
			return filter;
		}

		return filter;
	}


createForm() {
	debugger;
	this.classTimetableForm = this.fb.group({
		staffId: ['', Validators.required],
		
	});
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
		this.loadClassTimetableList();
		this.classTimetableForm.reset();
		

}

onCancel(){
	this.classTimetableForm.reset();
	// this.classTimetable.clear();
	// this.createForm();

}


}