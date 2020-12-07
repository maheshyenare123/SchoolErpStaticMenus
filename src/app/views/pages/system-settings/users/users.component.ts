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

//import { StudentEditDialogComponent } from '../admission-enquiry-edit/admission-enquiry-edit.dialog.component';
import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';
import { StaffsDataSource, StaffModel, StaffsPageRequested } from 'src/app/core/human-resource';
import { StudentsuserPageRequested } from 'src/app/core/student-information/_actions/student.actions';
import { ParentsuserPageRequested, StaffsuserPageRequested } from 'src/app/core/human-resource/_actions/staff.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'kt-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // Student
  dataSource: StudentsDataSource;
  displayedColumns = [ 'name','username', 'email', 'actions'];
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


 // Staff
 dataSource1: StaffsDataSource; 
 displayedColumns1 = [ 'name','username', 'email', 'actions'];
 @ViewChild(MatPaginator, {static: true}) paginator1: MatPaginator;
 @ViewChild('sort2', {static: true}) sort2: MatSort;
 // Filter fields
 @ViewChild('searchInput', {static: true}) searchInput1: ElementRef;
 filterStatus1 = '';
 filterType = '';
 // Selection
 selection1 = new SelectionModel<StaffModel>(true, []);
 staffsResult: StaffModel[] = [];


 // Parent
 dataSource2: StaffsDataSource; 
 displayedColumns2 = [ 'name','username', 'email', 'actions'];
 @ViewChild(MatPaginator, {static: true}) paginator2: MatPaginator;
 @ViewChild('sort3', {static: true}) sort3: MatSort;
 // Filter fields
 @ViewChild('searchInput', {static: true}) searchInput2: ElementRef;
 filterStatus2 = '';
 filterType2 = '';
 // Selection
 selection2 = new SelectionModel<StaffModel>(true, []);
parentsResult: StaffModel[] = [];


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
   
    this.dataSource = new StudentsDataSource(this.store);
    this.dataSource1 = new StaffsDataSource(this.store);
    this.dataSource2 = new StaffsDataSource(this.store);
    this.createForm();
    this.getAllStudentList('ROLE_STUDENT');
  }

   /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
		console.log('tabChangeEvent => ', tabChangeEvent);
		console.log(tabChangeEvent.tab.textLabel);
    console.log('index => ', tabChangeEvent.index);
    
    if(tabChangeEvent.tab.textLabel == 'Student'){
      this.getAllStudentList('ROLE_STUDENT');
    }
    if(tabChangeEvent.tab.textLabel == 'Parent'){
      this.getAllStaff('ROLE_PARENT')
    }
    if(tabChangeEvent.tab.textLabel == 'Staff'){
      this.getAllStaff('ROLE_STAFF')
    }
	}
  
  getAllStudentList(role){
  
  
      // If the user changes the sort order, reset back to the first page.
      const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
      this.subscriptions.push(sortSubscription);
     
      /* Data load will be triggered in two cases:
      - when a pagination event occurs => this.paginator.page
      - when a sort event occurs => this.sort.sortChange
      **/
      const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
        tap(() => this.loadStudentsList(role))
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
        this.loadStudentsList(role);
      }); // Remove this line, just loading imitation
     
  }
  
  /**
   * Load Products List
   */
  loadStudentsList(role) {
    this.selection.clear();
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    // Call request from server
   this.store.dispatch(new StudentsuserPageRequested({ page: queryParams ,role:role}));
   
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
  


  getAllStaff(role){
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);
  
    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadStaffList(role))
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
        this.loadStaffList(role);
      })
    )
    .subscribe();
    this.subscriptions.push(searchSubscription);
  
    // Init DataSource
    this.dataSource1 = new StaffsDataSource(this.store);
  
    const entitiesSubscription = this.dataSource1.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      debugger
  console.log(res);
      this.staffsResult = res;
    });
    this.subscriptions.push(entitiesSubscription);
    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadStaffList(role);
    }); // Remove this line, just loading imitation
  
  }
  
	/**
	 * Load Staffs List from service through data-source
	 */
	loadStaffList(role) {
		debugger;
		this.selection1.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration1(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(new StaffsuserPageRequested({ page: queryParams,role:role }));
		this.selection1.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration1(): any {
		const filter: any = {};
		const searchText: string = this.searchInput1.nativeElement.value;

		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.staff = searchText;
		return filter;
	}


  getAllParent(role){
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);
  
    /* Data load will be triggered in two cases:
    - when a pagination event occurs => this.paginator.page
    - when a sort event occurs => this.sort.sortChange
    **/
    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadParentList(role))
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
        this.loadParentList(role);
      })
    )
    .subscribe();
    this.subscriptions.push(searchSubscription);
  
    // Init DataSource
    this.dataSource2 = new StaffsDataSource(this.store);
  
    const entitiesSubscription = this.dataSource2.entitySubject.pipe(
      skip(1),
      distinctUntilChanged()
    ).subscribe(res => {
      debugger
  console.log(res);
      this.parentsResult = res;
    });
    this.subscriptions.push(entitiesSubscription);
    // First load
    of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
      this.loadParentList(role);
    }); // Remove this line, just loading imitation
  
  }
  
	/**
	 * Load Parents List from service through data-source
	 */
	loadParentList(role) {
		debugger;
		this.selection2.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration2(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(new ParentsuserPageRequested({ page: queryParams,role:role }));
		this.selection2.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration2(): any {
		const filter: any = {};
		const searchText: string = this.searchInput1.nativeElement.value;

		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.parent = searchText;
		return filter;
	}

  









  createForm() {
    debugger;
    this.searchForm = this.fb.group({
      classId: [this.classId, Validators.required],
      sectionId: [this.sectionId, Validators.required],
      // searchText: [this.searchText, ],21
  
    })
  
    
  }
  
  
 
  
  /** ACTIONS */
  /**
   * Delete product
   *
   * @param _item: StudentDtoModel
   */
  deleteStudent(_item: StudentDtoModel) {
    const _title = 'Product Delete';
    const _description = 'Are you sure to permanently delete this product?';
    const _waitDesciption = 'Product is deleting...';
    const _deleteMessage = `Product has been deleted`;
  
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
  //delete api call
      this.store.dispatch(new OneStudentDeleted({ id: _item.id }));
      this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    });
  }
  

  /**
   * Redirect to edit page
   *
   * @param id: any
   */
  /**
     * Show add student dialog
     */
    addStudent() {
      const newStudent = new StudentDtoModel();
      newStudent.clear(); // Set all defaults fields
      this.editStudent(newStudent);
    }
  
    /**
     * Show Edit student dialog and save after success close result
     * @param student: StudentDtoModel
     */
    editStudent(student: StudentDtoModel) {
      let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
      const _saveMessage = student.id > 0 ? 'Edit product' : 'Create product';
      
      const _messageType = student.id > 0 ? MessageType.Update : MessageType.Create;
      // const dialogRef = this.dialog.open(StudentEditDialogComponent, { data: { student } });
      // dialogRef.afterClosed().subscribe(res => {
      // 	if (!res) {
      // 		return;
      // 	}
  
      // 	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
      // 	this.loadStudentsList();
      // });
      
      this.router.navigate(["/student-information/student-details-edit/"+student.id])
  
    }
  
  
  /**
   * Check all rows are selected
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.studentsResult.length;
    return numSelected === numRows;
  }
  
  /**
   * Selects all rows if they are not all selected; otherwise clear selection
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.studentsResult.forEach(row => this.selection.select(row));
    }
  }
  
  /* UI */
  /**
   * Returns status string
   *
   * @param status: number
   */
  getItemStatusString(status: number = 0): string {
    switch (status) {
      case 0:
        return 'Selling';
      case 1:
        return 'Sold';
    }
    return '';
  }
  
  /**
   * Returns CSS Class by status
   *
   * @param status: number
   */
  getItemCssClassByStatus(status: number = 0): string {
    switch (status) {
      case 0:
        return 'success';
      case 1:
        return 'metal';
    }
    return '';
  }
  
  /**
   * Rerurns condition string
   *
   * @param condition: number
   */
  getItemConditionString(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'New';
      case 1:
        return 'Used';
    }
    return '';
  }
  
  /**
   * Returns CSS Class by condition
   *
   * @param condition: number
   */
  getItemCssClassByCondition(condition: number = 0): string {
    switch (condition) {
      case 0:
        return 'danger';
      case 1:
        return 'primary';
    }
    return '';
  }
}