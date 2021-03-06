
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AssignStudentExamsDataSource, AssignStudentExamService, AssignStudentExamOnServerCreated, AssignStudentExamEffects } from '../../../../core/examination';
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
import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';
import { CategoryService, CategoryDtoModel } from 'src/app/core/student-information';
import { selectLastCreatedAssignVehicleId } from 'src/app/core/transport';
import { ExamModel, ExamService } from 'src/app/core/examination';
import { AssignExamStudentModel } from 'src/app/core/examination/_models/assign-exam-student.model';




@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-exam-assign-student-dialog',
	templateUrl: './exam-assign-student.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAssignStudentDialogComponent implements OnInit {

	// Table fields
	dataSource: AssignStudentExamsDataSource;
	//  dataSource = new MatTableDataSource(ELEMENT_DATA);


	displayedColumns = ['select','admissionNo', 'name', 'class', 'fatherName', 'gender', 'category'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	// @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	// Selection
	selection = new SelectionModel<AssignExamStudentModel>(true, []);
	assignStudentExamsResult: AssignExamStudentModel[] = [];
	assignFeesStudentForFill: AssignExamStudentModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	// Public properties
	assignFeesStudent: AssignExamStudentModel;
	assignFeesStudentForm: FormGroup;
	searchForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	classId: number  = 0;
	sectionId: number = 0;

	pageNo = 1;
	itemsPerPage = 10;

	classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	categoryList:CategoryDtoModel[]=[];
	exam: ExamModel;
	assignExamStudentList: AssignExamStudentModel[] = [];
	selectedList: any[] = [];
	checkboxAll: boolean = false;
	checkboxSingle: boolean = false;
	assignExamStudentListLength: any;
	
	constructor(public dialogRef: MatDialogRef<ExamAssignStudentDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,

		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService,
		private categoryService:CategoryService,
		private assignStudentExamService:AssignStudentExamService,
		
		) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
debugger
		this.loadAllClasses();
		// this.loadAllSectionsByClassId(1);
		this.addAssignFeesStudent();
		this.loadAllStudentCategory();
		// Init DataSource
		// this.dataSource = new AssignStudentExamsDataSource(this.store);

		debugger
		this.exam = this.data.exam;

	
	}
	/**
	 * On destroy
	 */


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

 		this.classId =	controls.classId.value,
		 this.sectionId = controls.sectionId.value,
		

		// this.getAllAssignExamStudentList(
		// 	controls.classId.value,
		// 	controls.sectionId.value,
		// 	controls.category.value,
		// 	controls.gender.value,
		// 	controls.rte.value,
		// 	this.exam.feeGroupId
		// 	);

			// const queryParams = new QueryParamsModel(
			// 	this.filterConfiguration(),
			// 	this.sort.direction,
			// 	this.sort.active,
			// 	this.paginator.pageIndex,
			// 	this.paginator.pageSize
			// );
			this.pageNo
			let queryParams = {
				'pageNo': this.pageNo - 1,
				'itemsPerPage': 10,
			}
			
		
			this.assignStudentExamService.findAssignStudentExams(queryParams, controls.classId.value, controls.sectionId.value,
				 this.exam.id).subscribe(res => {
					const data = res['data'];
					this.assignExamStudentList = data.content;//  ['content'];
					this.assignExamStudentListLength = data.totalElements
					console.log(this.assignExamStudentList)
					
				}, err => {
				});
	

	}

	pageNoChange($event){
		debugger
		let pageNo = $event-1;
	
		this.pageNo = $event;
		this.pageNo
			let queryParams = {
				'pageNo': pageNo,
				'itemsPerPage': 10,
			}
			this.assignStudentExamService.findAssignStudentExams(queryParams, this.classId , this.sectionId,
				this.exam.id).subscribe(res => {
					const data = res['data'];
					this.assignExamStudentList = data.content;//  ['content'];
					this.assignExamStudentListLength = data.totalElements
					console.log(this.assignExamStudentList)
					
				}, err => {
				});
	
		 
	  }
	


// 	getAllAssignExamStudentList(classId,sectionId,category,gender,rte,feeGroupId){
	
		

// 		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
//  this.subscriptions.push(sortSubscription);

//  /* Data load will be triggered in two cases:
//  - when a pagination event occurs => this.paginator.page
//  - when a sort event occurs => this.sort.sortChange
//  **/
//  const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
//    tap(() => this.loadAssignExamStudentList(classId,sectionId,category,gender,rte,feeGroupId))
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
//  this.dataSource = new AssignStudentExamsDataSource(this.store);
//  const entitiesSubscription = this.dataSource.entitySubject.pipe(
//    skip(1),
//    distinctUntilChanged()
//  ).subscribe(res => {
//    this.assignStudentExamsResult = res;
//    console.log(this.assignStudentExamsResult);
//    if(this.assignStudentExamsResult.length==0)this.dataSource.hasItems=false;
//  });
//  this.subscriptions.push(entitiesSubscription);
//  // First load
//  of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
//     this.loadAssignExamStudentList(classId,sectionId,category,gender,rte,feeGroupId);
//  });

// }


	// getAllAssignExamStudentList(classId, sectionId, date) {

	// 	const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
	// 	this.subscriptions.push(sortSubscription);

	// 	const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
	// 		tap(() => this.loadAssignExamStudentList(classId, sectionId, date))
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
	// 	// 		this.loadAssignExamStudentList();
	// 	// 	})
	// 	// )
	// 	// .subscribe();
	// 	// this.subscriptions.push(searchSubscription);

	// 	// Init DataSource
	// 	this.dataSource = new AssignStudentExamsDataSource(this.store);

	// 	const entitiesSubscription = this.dataSource.entitySubject.pipe(
	// 		skip(1),
	// 		distinctUntilChanged()
	// 	).subscribe(res => {
	// 		// debugger
	// 		console.log(res);
	// 		this.AssignStudentExamsResult = res;
	// 		console.log(this.AssignStudentExamsResult);
	// 		if(this.AssignStudentExamsResult){
	// 			this.AssignFeesStudentForFill=this.AssignStudentExamsResult;
	// 		}
		
	// 	});
	// 	this.subscriptions.push(entitiesSubscription);
	// 	// First load
	// 	of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
	// 		this.loadAssignExamStudentList(classId, sectionId, date);
	// 	}); // Remove this line, just loading imitation



	// }


	/**
		 * On Destroy
		 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load AssignStudentExams List from service through data-source
	 */
	// loadAssignExamStudentList(classId, sectionId, category, gender, rte,feeGroupId) {
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
	// 	 this.store.dispatch(new AssignStudentExamsPageRequested({ page: queryParams, classId: classId, sectionId: sectionId, category: category, gender: gender, rte:rte,feeGroupId:feeGroupId }));
	// 	this.selection.clear();
	// }

//save
	onSave(){

		// create list for selected item
		
console.log(this.assignFeesStudentForFill);



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
		filter.assignFeesStudent = searchText;
		return filter;
	}


	/**
	 * Show add AssignFeesStudent dialog
	 */
	addAssignFeesStudent() {
		this.assignFeesStudent = new AssignExamStudentModel();
		this.assignFeesStudent.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit AssignFeesStudent dialog and save after success close result
	 * @param AssignFeesStudent: AssignExamStudentModel
	 */
	editAssignFeesStudent(assignFeesStudent: AssignExamStudentModel) {

		this.assignFeesStudent = assignFeesStudent;
		this.createForm();

	}





	createForm() {
		debugger;
		this.searchForm = this.fb.group({
			classId: [this.classId, ],
			sectionId: [this.sectionId, ],
		})

	}


	/**
	 * On Submit
	 */
	onSubmit() {
		debugger
		
	let entity = {
		"examId": this.exam.id,
		"students": this.selectedList
	}	

	this.store.dispatch(new AssignStudentExamOnServerCreated({ assignStudentExam: entity }));

	this.dialogRef.close({ entity, isEdit: false });

	}
	onCancel() {
		this.searchForm.reset();
	}



/**
 * Check all rows are selected
 */
isAllSelected() {
	const numSelected = this.selection.selected.length;
	const numRows = this.assignStudentExamsResult.length;
	console.log("selection: "+this.selection)
	console.log("selectionobj: "+this.selection.selected)
	return numSelected === numRows;
	
  }
  
  /**
   * Selects all rows if they are not all selected; otherwise clear selection
   */
  masterToggle() {
	  debugger
	if (this.isAllSelected()) {
	  this.selection.clear();
	} else {
	  this.assignStudentExamsResult.forEach(row => this.selection.select(row));
	}
	console.log("selection: "+this.selection)
  }


	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	onSelection(data, $event){
		debugger
		if( $event.target.checked){
			//data.isSaved = 1;
		   this.selectedList.push(data)
		   if(this.selectedList.length === this.assignExamStudentList.length){
			this.checkboxAll = true
		   }else{
			this.checkboxAll = false
		   }
		
		}else{

			// this.assignExamStudentList.map(item =>{
			// 	if(item.studentId === data.studentId){
			// 		item.isSaved = 0;
			// 		this.selectedList.push(item)
			// 	}
			// })
		  const index = this.selectedList.findIndex(item =>item.studentId === data.studentId);
		  this.selectedList.splice(index, 1);

		  if(this.selectedList.length === this.assignExamStudentList.length){
			this.checkboxAll = true
		   }else{
			this.checkboxAll = false
		   }
		 
		}
	  }
	  
	  onSelectionAll($event){
		  debugger
		if( $event.target.checked){
			let tempList= this.assignExamStudentList
			tempList.map(item =>{
				//item.isSaved = 1;
			})
			
			this.selectedList = tempList
			this.checkboxSingle = true
			this.checkboxAll = true
		}else{
			 this.selectedList = []
			this.checkboxSingle = false
			this.checkboxAll = false
		}
	  }

}


