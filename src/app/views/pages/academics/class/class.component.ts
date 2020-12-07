
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentClasssDataSource, StudentClassModel,selectStudentClasssActionLoading, SectionModel, SectionService, SectionDtoModel } from '../../../../core/academics';
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
import { StudentClasssPageRequested, OneStudentClassDeleted, ManyStudentClasssDeleted, StudentClasssStatusUpdated, StudentClassUpdated, StudentClassOnServerCreated, selectLastCreatedStudentClassId } from '../../../../core/academics';


@Component({
  selector: 'kt-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {

  // Table fields
dataSource: StudentClasssDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'class', 'section', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<StudentClassModel>(true, []);
studentClasssResult: StudentClassModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
studentClass: StudentClassModel;
studentClassForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;


sectionList: SectionDtoModel[] = [];

	sectionCheckBoxList: SectionCheckBox[] = [];

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private sectionService: SectionService,) { }

  ngOnInit() {
	this.loadAllSections();
	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadStudentClassList())
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
				this.loadStudentClassList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new StudentClasssDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.studentClasssResult = res;
			
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadStudentClassList();
		}); // Remove this line, just loading imitation

this.addStudentClass();
		
  }

  loadAllSections() {
	debugger
	this.sectionService.getAllSections().subscribe(res => {
		const data = res['data'];
		this.sectionList = data['content'];
		console.log(this.sectionList)
		this.setDataInChecboxList();
	}, err => {
	});
}
  setDataInChecboxList(){
	this.sectionList.forEach(element => {
		this.sectionCheckBoxList.push({ 'data': element, 'isChecked': false })
	})
}
   /**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load StudentClasss List from service through data-source
	 */
	loadStudentClassList() {
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
		this.store.dispatch(new StudentClasssPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.section = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete StudentClass
	 *
	 * @param _item: StudentClassModel
	 */
	deleteStudentClass(_item: StudentClassModel) {

		const _title = 'Class';
		const _description = 'Are you sure to permanently delete selected Class?';
		const _waitDesciption = 'Class is deleting...';
		const _deleteMessage = ' Selected Class has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneStudentClassDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadStudentClassList();
		});
		

	}

	/**
	 * Show add StudentClass dialog
	 */
	addStudentClass() {
		this.studentClass=new StudentClassModel();
		this.studentClass.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit StudentClass dialog and save after success close result
	 * @param studentClass: StudentClassModel
	 */
	editStudentClass(studentClass: StudentClassModel) {
		
		this.studentClass=studentClass;
		this.createForm();

		// this.setDataInChecboxList();

		this.sectionCheckBoxList.forEach(element => {
			this.studentClass.section.forEach(innerElement => {
				if (element.data.id == innerElement.id) {
					element.isChecked = true;
				}
			})


		})

	}



createForm() {
	debugger;
	this.studentClassForm = this.fb.group({
		classses: [this.studentClass.classses, Validators.required],
		// section: [this.studentClass.section, ],
		
	});
}
onCheckBoxChanges(e: boolean, id: number) {
	// get current position of the changes element by ID
	const index = this.sectionCheckBoxList.findIndex(_ => _.data.id === id);
	// if (!(index > -1)) return;

	// const isChecked = this.checkBoxes[index].isChecked;
	if (e) {
		this.sectionCheckBoxList[index].isChecked = e;
	}else{
		this.sectionCheckBoxList[index].isChecked = e;
	}
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.studentClassForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared StudentClass
 */
prepareStudentClass(): StudentClassModel {
	const controls = this.studentClassForm.controls;
	const _studentClass = new StudentClassModel();
	_studentClass.id = this.studentClass.id;

	if (_studentClass.id > 0) {
		_studentClass.isActive = this.studentClass.isActive;
	} else {
		_studentClass.isActive = 'yes';
	}


	_studentClass.classses = controls.classses.value;
	// _studentClass.section = controls.section.value;
	const _sectionData: SectionDtoModel[] = [];
		this.sectionCheckBoxList.forEach(element => {
			if (element.isChecked) {
				_sectionData.push(element.data);
			}
		})
		_studentClass.section = _sectionData;
	
	return _studentClass;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.studentClassForm.controls;
	/** check form */
	if (this.studentClassForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedStudentClass = this.prepareStudentClass();
	console.log(editedStudentClass);
	if (editedStudentClass.id > 0) {
		this.updateStudentClass(editedStudentClass);
	} else {
		this.createStudentClass(editedStudentClass);
	}
	const	_saveMessage= editedStudentClass.id > 0 ? 'Class  has been updated' : 'Class has been created';
		
	const _messageType = editedStudentClass.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
		this.studentClassForm.reset();

		this.addStudentClass();
		// this.studentClass.clear();
		// this.createForm();
		this.sectionCheckBoxList = [];
		this.setDataInChecboxList();

}
onCancel(){
	this.studentClassForm.reset();
	this.addStudentClass();
	// this.studentClass.clear();
	// this.createForm();
	this.sectionCheckBoxList = [];
		this.setDataInChecboxList();
}
/**
 * Update StudentClass
 *
 * @param _studentClass: StudentClassModel
 */
updateStudentClass(_studentClass: StudentClassModel) {
	const updateStudentClass: Update<StudentClassModel> = {
		id: _studentClass.id,
		changes: _studentClass
	};
	this.store.dispatch(new StudentClassUpdated({
		partialStudentClass: updateStudentClass,
		studentClass: _studentClass
	}));
	this.loadStudentClassList();


}

/**
 * Create StudentClass
 *
 * @param _studentClass: StudentClassModel
 */
createStudentClass(_studentClass:StudentClassModel) {
	this.store.dispatch(new StudentClassOnServerCreated({ studentClass: _studentClass }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedStudentClassId),
		// delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _studentClass, isEdit: false });
	});
	this.loadStudentClassList();

}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

sectionChange($event){
	if($event.target.checked === true){
		//this.studentClass.section.push()

	}else{

	}
}

}
export class SectionCheckBox {
	data: SectionDtoModel;
	isChecked: boolean;
}