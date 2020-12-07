import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';
import { AssignStudentFeemastersDataSource, AssignFeesStudentModel, AssignStudentFeemasterService } from 'src/app/core/fees-collection';
import { AppState } from 'src/app/core/reducers';
import { CategoryDtoModel, CategoryService } from 'src/app/core/student-information';
import { TypesUtilsService } from 'src/app/core/_base/crud';

@Component({
  selector: 'kt-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.scss']
})
export class StudentReportComponent implements OnInit {
// Table fields
dataSource: AssignStudentFeemastersDataSource;
displayedColumns = ['admissionNo', 'name', 'class', 'fatherName', 'gender', 'category'];
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild('sort1', { static: true }) sort: MatSort;
// Filter fields
// @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<AssignFeesStudentModel>(true, []);
assignStudentFeemastersResult: AssignFeesStudentModel[] = [];
assignFeesStudentForFill: AssignFeesStudentModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
assignFeesStudent: AssignFeesStudentModel;
assignFeesStudentForm: FormGroup;
searchForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;

classId: number  = 0;
sectionId: number = 0;
category: number;
gender: string;
rte: string;




  classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	categoryList:CategoryDtoModel[]=[];
  constructor(
    private router: Router,
    private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService,
		private categoryService:CategoryService,
    private assignStudentFeemasterService:AssignStudentFeemasterService,
    ) { }

  ngOnInit(): void {

    this.loadAllClasses();
		this.loadAllSectionsByClassId(1);
    this.loadAllStudentCategory();
    // Init DataSource
    this.dataSource = new AssignStudentFeemastersDataSource(this.store);
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
onClassSelectChange(classObj:StudentClassModel){
	// this.loadAllSectionsByClassId(classObj.id);
}
loadAllSectionsByClassId(id:number) {
	debugger
	this.sectionService.getAllSections().subscribe(res => {
		const data = res['data'];
		this.sectionList = data['content'];
		console.log(this.sectionList)
	}, err => {
	});
}

	//get All Source List
	loadAllStudentCategory() {
		debugger
		this.categoryService.getAllCategorys().subscribe(res => {
			const data=res['data'];
			this.categoryList=data['content'];
			console.log(this.categoryList)
		}, err => {
		});
	}

	// onSearch() {
	// 	debugger;
	// 	this.hasFormErrors = false;
	// 	const controls = this.searchForm.controls;
	// 	/** check form */
	// 	if (this.searchForm.invalid) {
	// 		Object.keys(controls).forEach(controlName =>
	// 			controls[controlName].markAsTouched()
	// 		);

	// 		this.hasFormErrors = true;
	// 		return;
	// 	}

 	// 	this.classId =	controls.classId.value,
	// 	 this.sectionId = controls.sectionId.value,
	// 	 this.category = controls.category.value,
	// 	 this.gender = controls.gender.value,
	// 	 this.rte =	controls.rte.value,

	// 	this.getAllAssignFeesStudentList(
	// 		controls.classId.value,
	// 		controls.sectionId.value,
	// 		controls.category.value,
	// 		controls.gender.value,
	// 		controls.rte.value,
	// 		this.feesMaster.feeGroupId
	// 		);

	// 		const queryParams = new QueryParamsModel(
	// 			this.filterConfiguration(),
	// 			this.sort.direction,
	// 			this.sort.active,
	// 			this.paginator.pageIndex,
	// 			this.paginator.pageSize
	// 		);
	// 		this.pageNo
	// 		let queryParams = {
	// 			'pageNo': this.pageNo - 1,
	// 			'itemsPerPage': 10,
	// 		}
			
		
	// 		this.assignStudentFeemasterService.findAssignStudentFeemasters(queryParams, controls.classId.value, controls.sectionId.value,
	// 			 controls.category.value, controls.gender.value,
	// 			controls.rte.value,this.feesMaster.feeGroupId).subscribe(res => {
	// 				const data = res['data'];
	// 				this.assignFeesStudentList = data.studentDetails.content;//  ['content'];
	// 				this.assignFeesStudentListLength = data.studentDetails.totalElements
	// 				console.log(this.assignFeesStudentList)
					
	// 			}, err => {
	// 			});
	

	// }


// 	getAllAssignFeesStudentList(classId,sectionId,category,gender,rte,feeGroupId){
	
		

// 		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
//  this.subscriptions.push(sortSubscription);

//  /* Data load will be triggered in two cases:
//  - when a pagination event occurs => this.paginator.page
//  - when a sort event occurs => this.sort.sortChange
//  **/
//  const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
//    tap(() => this.loadAssignFeesStudentList(classId,sectionId,category,gender,rte,feeGroupId))
//  )
//  .subscribe();
//  this.subscriptions.push(paginatorSubscriptions);

// //  // Filtration, bind to searchInput
// //  const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
// //    // tslint:disable-next-line:max-line-length
// //    debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
// //    distinctUntilChanged(), // This operator will eliminate duplicate values
// //    tap(() => {
// //      this.paginator.pageIndex = 0;
// //      this.loadClassTimetablesList(classId,sectionId);
// //    })
// //  )
// //  .subscribe();
// //  this.subscriptions.push(searchSubscription);

//  // Init DataSource
//  this.dataSource = new AssignStudentFeemastersDataSource(this.store);
//  const entitiesSubscription = this.dataSource.entitySubject.pipe(
//    skip(1),
//    distinctUntilChanged()
//  ).subscribe(res => {
//    this.assignStudentFeemastersResult = res;
//    console.log(this.assignStudentFeemastersResult);
//    if(this.assignStudentFeemastersResult.length==0)this.dataSource.hasItems=false;
//  });
//  this.subscriptions.push(entitiesSubscription);
//  // First load
//  of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
//     this.loadAssignFeesStudentList(classId,sectionId,category,gender,rte,feeGroupId);
//  });

// }


	// getAllAssignFeesStudentList(classId, sectionId, date) {

	// 	const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
	// 	this.subscriptions.push(sortSubscription);

	// 	const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
	// 		tap(() => this.loadAssignFeesStudentList(classId, sectionId, date))
	// 	)
	// 		.subscribe();
	// 	this.subscriptions.push(paginatorSubscriptions);

	// 	// // Filtration, bind to searchInput
	// 	// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
	// 	// 	// tslint:disable-next-line:max-line-length
	// 	// 	debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
	// 	// 	distinctUntilChanged(), // This operator will eliminate duplicate values
	// 	// 	tap(() => {
	// 	// 		this.paginator.pageIndex = 0;
	// 	// 		this.loadAssignFeesStudentList();
	// 	// 	})
	// 	// )
	// 	// .subscribe();
	// 	// this.subscriptions.push(searchSubscription);

	// 	// Init DataSource
	// 	this.dataSource = new AssignStudentFeemastersDataSource(this.store);

	// 	const entitiesSubscription = this.dataSource.entitySubject.pipe(
	// 		skip(1),
	// 		distinctUntilChanged()
	// 	).subscribe(res => {
	// 		// debugger
	// 		console.log(res);
	// 		this.AssignStudentFeemastersResult = res;
	// 		console.log(this.AssignStudentFeemastersResult);
	// 		if(this.AssignStudentFeemastersResult){
	// 			this.AssignFeesStudentForFill=this.AssignStudentFeemastersResult;
	// 		}
		
	// 	});
	// 	this.subscriptions.push(entitiesSubscription);
	// 	// First load
	// 	of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
	// 		this.loadAssignFeesStudentList(classId, sectionId, date);
	// 	}); // Remove this line, just loading imitation



	// }


/**
	 * Load AssignStudentFeemasters List from service through data-source
	 */
	// loadAssignFeesStudentList(classId, sectionId, category, gender, rte,feeGroupId) {
	// 	debugger;
	// 	this.selection.clear();
	// 	const queryParams = new QueryParamsModel(
	// 		this.filterConfiguration(),
	// 		this.sort.direction,
	// 		this.sort.active,
	// 		this.paginator.pageIndex,
	// 		this.paginator.pageSize
	// 	);




	// 	// Call request from server
	// 	 this.store.dispatch(new AssignStudentFeemastersPageRequested({ page: queryParams, classId: classId, sectionId: sectionId, category: category, gender: gender, rte:rte,feeGroupId:feeGroupId }));
	// 	this.selection.clear();
	// }

	createForm() {
		debugger;
		this.searchForm = this.fb.group({
			classId: [this.classId, ],
			sectionId: [this.sectionId, ],
			category: [this.category, ],
			gender: [this.gender, ],
			rte: [this.rte, ],

		})

	}

}
