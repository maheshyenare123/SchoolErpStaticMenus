
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExamSubjectsDataSource, ExamSubjectModel, selectExamSubjectActionLoading, ExamModel, ExamGroupModel, ExamGroupService, ExamService, } from 'src/app/core/examination';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ExamSubjectsPageRequested, OneExamSubjectDeleted, ManyExamSubjectsDeleted, ExamSubjectsStatusUpdated, ExamSubjectUpdated, ExamSubjectOnServerCreated, selectLastCreatedExamSubjectId } from '../../../../core/examination';
import { ExamGroupDtoModel } from 'src/app/core/Models/examGroupDto.model';


@Component({
  selector: 'kt-exam-schedule',
  templateUrl: './exam-schedule.component.html',
  styleUrls: ['./exam-schedule.component.scss']
})
export class ExamScheduleComponent implements OnInit {
// Table fields
dataSource: ExamSubjectsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['subject', 'dateFrom', 'startTime', 'duration', 'roomNo', 'maxMarks', 'minMarks'];
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild('sort1', { static: true }) sort: MatSort;
// Filter fields
@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ExamSubjectModel>(true, []);
examSubjectResult: ExamSubjectModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
examSubject: ExamSubjectModel;
examSubjectForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
libraryMember: ExamSubjectModel;
showReturnDate: boolean = false;
	exam: ExamModel;
	examGroupDetail: ExamGroupModel;

  searchForm: FormGroup;

  examGroupId: number;
	examId: number;
	searchText: string;

  examGroupList: ExamGroupDtoModel[] = [];
	examList: ExamModel[] = [];


constructor(public dialog: MatDialog,
	public snackBar: MatSnackBar,
	private layoutUtilsService: LayoutUtilsService,
	private translate: TranslateService,
	private store: Store<AppState>,
	private fb: FormBuilder,
	private typesUtilsService: TypesUtilsService,
  private router: Router,
  private examGroupService: ExamGroupService,
  private examService:ExamService,) { }

ngOnInit() {
  this.dataSource = new ExamSubjectsDataSource(this.store);
	debugger;

  this.loadAllExamGroup();
  this.createForm();
}


//get All Class List


loadAllExamGroup() {
	debugger
	this.examGroupService.getAllExamGroups().subscribe(res => {
		const data = res['data'];
		this.examGroupList = data['content'];
		console.log(this.examGroupList)
	}, err => {
	});
}
onExamGroupSelectChange(examGroupId){
  this.loadAllExamsByExamGroupId(examGroupId);
 
}
loadAllExamsByExamGroupId(id:number) {
	debugger
	this.examService.getExamById(id).subscribe(res => {
    const data = res['data'];
		this.examList = data['content'];
		console.log(this.examList)
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
		this.getAllScheduleExam(controls.examId.value);


	}

  createForm() {
    debugger;
    this.searchForm = this.fb.group({
      examGroupId: [this.examGroupId, Validators.required],
      examId: [this.examId, Validators.required],
      // searchText: [this.searchText, ],21
  
    })
  
    
  }


getAllScheduleExam(examId){
  const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
	this.subscriptions.push(sortSubscription);

	/* Data load will be triggered in two cases:
	- when a pagination event occurs => this.paginator.page
	- when a sort event occurs => this.sort.sortChange
	**/
	const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
		tap(() => this.loadExamSubjectList(examId))
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
			this.loadExamSubjectList(examId);
		})
	)
		.subscribe();
	this.subscriptions.push(searchSubscription);

	// Init DataSource
	this.dataSource = new ExamSubjectsDataSource(this.store);

	const entitiesSubscription = this.dataSource.entitySubject.pipe(
		skip(1),
		distinctUntilChanged()
	).subscribe(res => {
		debugger
		console.log(res);
		this.examSubjectResult = res;
	});
	this.subscriptions.push(entitiesSubscription);
	// First load
	of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
		this.loadExamSubjectList(examId);
	}); // Remove this line, just loading imitation
}



/**
	 * On Destroy
	 */
ngOnDestroy() {
	this.subscriptions.forEach(el => el.unsubscribe());
}

/**
 * Load ExamSubject List from service through data-source
 */
loadExamSubjectList(id) {
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
	this.store.dispatch(new ExamSubjectsPageRequested({ page: queryParams, examId: id }));
	this.selection.clear();
}

/**
 * Returns object for filter
 */
filterConfiguration(): any {
	const filter: any = {};
	const searchText: string = this.searchInput.nativeElement.value;

	filter.visitorsPurpose = searchText;
	if (!searchText) {
		return filter;
	}
	filter.description = searchText;
	return filter;
}

 

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
