
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentHousesDataSource, SchoolHousModel,selectStudentHousesActionLoading } from '../../../../core/student-information';
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
import { StudentHousesPageRequested, OneStudentHouseDeleted, ManyStudentHousesDeleted, StudentHousesStatusUpdated, StudentHouseUpdated, StudentHouseOnServerCreated, selectLastCreatedStudentHouseId } from '../../../../core/student-information';

@Component({
  selector: 'kt-student-house',
  templateUrl: './student-house.component.html',
  styleUrls: ['./student-house.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentHouseComponent implements OnInit {

  // Table fields
dataSource: StudentHousesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'studentHouse',  'description','actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<SchoolHousModel>(true, []);
studentHousesResult: SchoolHousModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
studentHouse: SchoolHousModel;
studentHouseForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;




  constructor(
    public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
    private typesUtilsService: TypesUtilsService
    ) { }

  ngOnInit() {

	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadStudentHouseList())
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
				this.loadStudentHouseList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new StudentHousesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.studentHousesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadStudentHouseList();
		}); // Remove this line, just loading imitation

this.addStudentHouse();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load StudentHouses List from service through data-source
	 */
	loadStudentHouseList() {
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
		this.store.dispatch(new StudentHousesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.studentHouse = searchText;
		if (!searchText) {
			return filter;
		}
    filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete StudentHouse
	 *
	 * @param _item: SchoolHousModel
	 */
	deleteStudentHouse(_item: SchoolHousModel) {

		const _title = 'Student House';
		const _description = 'Are you sure to permanently delete selected Student House?';
		const _waitDesciption = 'Student House is deleting...';
		const _deleteMessage = ' Selected Student House has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneStudentHouseDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadStudentHouseList();
		});
		

	}

	/**
	 * Show add StudentHouse dialog
	 */
	addStudentHouse() {
		this.studentHouse=new SchoolHousModel();
		this.studentHouse.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit StudentHouse dialog and save after success close result
	 * @param studentHouse: SchoolHousModel
	 */
	editStudentHouse(studentHouse: SchoolHousModel) {
		
		this.studentHouse=studentHouse;
		this.createForm();

	}



createForm() {
	debugger;
	this.studentHouseForm = this.fb.group({
    houseName: [this.studentHouse.houseName, Validators.required],
    description: [this.studentHouse.description, ''],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.studentHouseForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared studentHouse
 */
prepareStudentHouse(): SchoolHousModel {
	const controls = this.studentHouseForm.controls;
	const _studentHouse = new SchoolHousModel();
	_studentHouse.id = this.studentHouse.id;

if(_studentHouse.id>0){
	_studentHouse.isActive =this.studentHouse.isActive;
}else{
	_studentHouse.isActive ='yes';
}
  _studentHouse.houseName = controls.houseName.value;
  _studentHouse.description = controls.description.value;

	return _studentHouse;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.studentHouseForm.controls;
	/** check form */
	if (this.studentHouseForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedStudentHouse = this.prepareStudentHouse();
	if (editedStudentHouse.id > 0) {
		this.updateStudentHouse(editedStudentHouse);
	} else {
		this.createStudentHouse(editedStudentHouse);
	}

	const	_saveMessage= editedStudentHouse.id > 0 ? 'Student House  has been updated' : 'Student House has been created';
		
	const _messageType = editedStudentHouse.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadStudentHouseList();
		this.studentHouseForm.reset();
		// this.studentHouse.clear();
		// this.createForm();
		this.addStudentHouse();

}
onCancel(){
	this.studentHouseForm.reset();
	// this.studentHouse.clear();
	// this.createForm();
	this.addStudentHouse();
}
/**
 * Update StudentHouse
 *
 * @param _studentHouse: SchoolHousModel
 */
updateStudentHouse(_studentHouse: SchoolHousModel) {
	const updateStudentHouse: Update<SchoolHousModel> = {
		id: _studentHouse.id,
		changes: _studentHouse
	};
	this.store.dispatch(new StudentHouseUpdated({
		partialStudentHouse: updateStudentHouse,
		studentHouse: _studentHouse
	}));


}

/**
 * Create StudentHouse
 *
 * @param _studentHouse: SchoolHousModel
 */
createStudentHouse(_studentHouse:SchoolHousModel) {
	this.store.dispatch(new StudentHouseOnServerCreated({ studentHouse: _studentHouse }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedStudentHouseId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _studentHouse, isEdit: false });
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
