import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray} from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HomeworksDataSource, HomeworkDtoModel, HomeworksPageRequested, OneHomeworkDeleted, ManyHomeworksDeleted } from 'src/app/core/homework';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { StudentClassService, SubjectService, SubjectGroupService, SectionDtoModel, StudentClassModel, SubjectDtoModel, SubjectGroupDtoModel } from 'src/app/core/academics';


@Component({
  selector: 'kt-homework-evaluation-report',
  templateUrl: './homework-evaluation-report.component.html',
  styleUrls: ['./homework-evaluation-report.component.scss']
})
export class HomeworkEvaluationReportComponent implements OnInit {
// Table fields
dataSource: HomeworksDataSource;
displayedColumns = ['class', 'section', 'subjectGroup', 'subject', 'homeworkDate', 'submitDate', 'evaluationDate', 'createdBy'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterCondition = '';
lastQuery: QueryParamsModel;
// Selection
selection = new SelectionModel<HomeworkDtoModel>(true, []);
homeworksResult: HomeworkDtoModel[] = [];
private subscriptions: Subscription[] = [];
searchForm: FormGroup;
hasFormErrors = false;
homework: HomeworkDtoModel;
temp: HomeworkDtoModel;

viewLoading=false;

classList: StudentClassModel[] = [];
sectionList: SectionDtoModel[] = [];
subjectList: SubjectDtoModel[] = [];
subjectGroupList: SubjectGroupDtoModel[] = [];

constructor(public dialog: MatDialog,
             private activatedRoute: ActivatedRoute,
             private router: Router,
             private subheaderService: SubheaderService,
             private layoutUtilsService: LayoutUtilsService,
             private store: Store<AppState>,
             private fb: FormBuilder,
             private studentClassService: StudentClassService,
		private subjectService: SubjectService,
    private subjectGroupService: SubjectGroupService,
    ) { }


/**
 * On init
 */
ngOnInit() {


this.addHomework(); 
// All Get Call
this.loadAllSubject();
this.loadAllClasses();
this.loadAllSubjectGroup();

// Init DataSource
this.dataSource = new HomeworksDataSource(this.store);

}

  studentReport() {
		this.router.navigate(["/report/student-report"])
  }
  
  guardianReport() {
			this.router.navigate(["/report/guardian-report"])
  }

  studentHistory() {
		this.router.navigate(["/report/student-history"])
  }

  studentLoginCredential() {
		this.router.navigate(["/report/student-login-credential"])
  }

  classSubjectReport() {
		this.router.navigate(["/report/class-subject-report"])
  }

  admissionReport() {
		this.router.navigate(["/report/admission-report"])
  }

  siblingReport() {
		this.router.navigate(["/report/sibling-report"])
  }

  studentProfile() {
		this.router.navigate(["/report/student-profile"])
  }

  homeworkEvaluationReport() {
		this.router.navigate(["/report/homework-evaluation-report"])
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
	loadAllSectionsByClassId(id:number) {
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

	onClassSelectChange(classId){
		this.loadAllSectionsByClassId(classId);
		// var classObj=this.classList.find(x => x.id === classId);
		// this.homeworkForm.controls.classes.setValue(classObj.classses);
	
	}



onSearch(){
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
// If the user changes the sort order, reset back to the first page.
const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
this.subscriptions.push(sortSubscription);

/* Data load will be triggered in two cases:
- when a pagination event occurs => this.paginator.page
- when a sort event occurs => this.sort.sortChange
**/
const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
  tap(() => this.loadHomeworksList())
)
.subscribe();
this.subscriptions.push(paginatorSubscriptions);

// Filtration, bind to searchInput
//  const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
//    // tslint:disable-next-line:max-line-length
//    debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
//    distinctUntilChanged(), // This operator will eliminate duplicate values
//    tap(() => {
//      this.paginator.pageIndex = 0;
//      this.loadHomeworksList();
//    })
//  )
//  .subscribe();
//  this.subscriptions.push(searchSubscription);

// Init DataSource
this.dataSource = new HomeworksDataSource(this.store);
this.dataSource .loading$;
const entitiesSubscription = this.dataSource.entitySubject.pipe(
  skip(1),
  distinctUntilChanged()
).subscribe(res => {
  this.homeworksResult = res;
  console.log(this.homeworksResult);
});
this.subscriptions.push(entitiesSubscription);
// First load
of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
  this.loadHomeworksList();
}); // Remove this line, just loading imitation



}

/**
 * On Destroy
 */
ngOnDestroy() {
  this.subscriptions.forEach(el => el.unsubscribe());
}

/**
 * Load Products List
 */
loadHomeworksList() {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new HomeworksPageRequested({ page: queryParams }));
 
  this.selection.clear();
}

/**
 * Returns object for filter
 */
filterConfiguration(): any {
  const filter: any = {};
  // const searchText: string = this.searchInput.nativeElement.value;
  const searchText: string ='';
  if (this.filterStatus && this.filterStatus.length > 0) {
    filter.status = +this.filterStatus;
  }

  if (this.filterCondition && this.filterCondition.length > 0) {
    filter.condition = +this.filterCondition;
  }

  filter.model = searchText;

  filter.manufacture = searchText;
  filter.color = searchText;
  filter.VINCode = searchText;
  return filter;
}

/**
 * Restore state
 *
 * @param queryParams: QueryParamsModel
 * @param id: number
 */
restoreState(queryParams: QueryParamsModel, id: number) {

  if (!queryParams.filter) {
    return;
  }

  if ('condition' in queryParams.filter) {
    this.filterCondition = queryParams.filter.condition.toString();
  }

  if ('status' in queryParams.filter) {
    this.filterStatus = queryParams.filter.status.toString();
  }

  if (queryParams.filter.model) {
    this.searchInput.nativeElement.value = queryParams.filter.model;
  }
}

	addHomework() {
		this.homework=new HomeworkDtoModel();
		this.homework.clear(); //
		this.createForm();

	}
createForm() {
  this.searchForm = this.fb.group({
    classesId: [this.homework.classesId, Validators.required],
    sectionId: [this.homework.sectionId, Validators.required],
    subjectGroupSubjectId: [this.homework.subjectGroupSubjectId, Validators.required],
    subjectId: [this.homework.subjectId, Validators.required],

  })

}

	

}
