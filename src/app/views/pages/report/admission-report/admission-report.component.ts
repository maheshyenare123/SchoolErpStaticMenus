import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentsDataSource, StudentDtoModel, StudentsPageRequested, OneStudentDeleted, ManyStudentsDeleted,StudentService } from 'src/app/core/student-information';
import { QueryParamsModel, LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';

@Component({
  selector: 'kt-admission-report',
  templateUrl: './admission-report.component.html',
  styleUrls: ['./admission-report.component.scss']
})
export class AdmissionReportComponent implements OnInit {
// Table fields
dataSource: StudentsDataSource;
displayedColumns = ['admissionNo', 'name', 'classSection', 'fatherName', 'dob', 'admissionDate', 'gender','category','contact'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterCondition = '';
lastQuery: QueryParamsModel;
// Selection
selection = new SelectionModel<StudentDtoModel>(true, []);
studentsResult: StudentDtoModel[] = [];
private subscriptions: Subscription[] = [];

  searchForm: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  classId: number;
  sectionId: number;
  searchText: string;

  classList: StudentClassModel[] = [];
  sectionList: SectionDtoModel[] = [];

constructor(
  public dialog: MatDialog,
             private activatedRoute: ActivatedRoute,
             private router: Router,
             private subheaderService: SubheaderService,
             private layoutUtilsService: LayoutUtilsService,
             private store: Store<AppState>,
             private fb: FormBuilder,
             private studentService: StudentService,
             private studentClassService: StudentClassService,
             private sectionService: SectionService,
            
             ) { }

/**
* On init
*/
ngOnInit() {

this.loadAllClasses();
// this.loadAllSectionsByClassId(1);
this.dataSource = new StudentsDataSource(this.store);
this.createForm();
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
onClassSelectChange(classId){
  this.loadAllSectionsByClassId(classId);
 
}
loadAllSectionsByClassId(id:number) {
  debugger
  this.studentClassService.getAllSectionByClasssId(id).subscribe(res => {

    this.sectionList = res['data'];
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
    this.getAllStudentList(controls.classId.value, controls.sectionId.value);


  }


  getAllStudentList(classId,sectionId){


    // If the user changes the sort order, reset back to the first page.
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);
   
    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadStudentsList(classId,sectionId))
    )
    .subscribe();
    this.subscriptions.push(paginatorSubscriptions);
   
    // // Filtration, bind to searchInput
    // const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
    //   // tslint:disable-next-line:max-line-length
    //   debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
    //   distinctUntilChanged(), // This operator will eliminate duplicate values
    //   tap(() => {
    //     this.paginator.pageIndex = 0;
    //     this.loadStudentsList(classId,sectionId);
    //   })
    // )
    // .subscribe();
    // this.subscriptions.push(searchSubscription);
   
    // Init DataSource
    this.dataSource = new StudentsDataSource(this.store);
    const entitiesSubscription = this.dataSource.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      this.studentsResult = res;
      console.log(this.studentsResult);
    });
    this.subscriptions.push(entitiesSubscription);
    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadStudentsList(classId,sectionId);
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
loadStudentsList(classId,sectionId) {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new StudentsPageRequested({ page: queryParams ,classId,sectionId}));
 
  this.selection.clear();
}



createForm() {
  debugger;
  this.searchForm = this.fb.group({
    classId: [this.classId, Validators.required],
    sectionId: [this.sectionId, Validators.required],
    // searchText: [this.searchText, ],21

  })

  
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

}
