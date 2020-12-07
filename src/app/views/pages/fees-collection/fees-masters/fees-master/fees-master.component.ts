
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FeesMastersDataSource, FeesMasterModel,selectFeesMastersActionLoading, AssignFeesStudentModel, FeesGroupService, FeesTypeService, FeesGroupModel, FeesTypeModel } from 'src/app/core/fees-collection';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FeesMastersPageRequested, OneFeesMasterDeleted, ManyFeesMastersDeleted, FeesMastersStatusUpdated, FeesMasterUpdated, FeesMasterOnServerCreated, selectLastCreatedFeesMasterId } from '../../../../../core/fees-collection';
import { FeesMasterAssignStudentDialogComponent } from '../fees-master-assign-student/fees-master-assign-student.dialog.component';


@Component({
  selector: 'kt-fees-master',
  templateUrl: './fees-master.component.html',
  styleUrls: ['./fees-master.component.scss']
})
export class FeesMasterComponent implements OnInit {

  // Table fields
dataSource: FeesMastersDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'feesGroup', 'feescode', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<FeesMasterModel>(true, []);
feesMastersResult: FeesMasterModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
feesMaster: FeesMasterModel;
feesMasterForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
  percentageFieldDisable: boolean = false;
  fixAmountFieldDisable: boolean = false;
  
  feesGroupList:FeesGroupModel[] = [];
  feesTypeList:FeesTypeModel[]=[];


  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private feesGroupService:FeesGroupService,
		private feesTypeService:FeesTypeService
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
			tap(() => this.loadFeesMasterList())
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
				this.loadFeesMasterList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new FeesMastersDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.feesMastersResult = res;
			console.log(this.feesMastersResult)
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadFeesMasterList();
		}); // Remove this line, just loading imitation

		this.addFeesMaster();
		
	  	this.loadAllFeesGroup();
		this.loadAllFeesType();
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load FeesMasters List from service through data-source
	 */
	loadFeesMasterList() {
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
		this.store.dispatch(new FeesMastersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.FeesMaster = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}



		//get All Source List
loadAllFeesGroup() {
	debugger
	this.feesGroupService.getAllFeesGroups().subscribe(res => {
		const data=res['data'];
		this.feesGroupList=data['content'];
		console.log(this.feesGroupList)
	}, err => {
	});
}
	//get All Class List
	loadAllFeesType() {
		debugger
		this.feesTypeService.getAllFeesTypes().subscribe(res => {
			const data=res['data'];
			this.feesTypeList=data['content'];
			console.log(this.feesTypeList)
		}, err => {
		});
	}

	/** ACTIONS */
	/**
	 * Delete FeesMaster
	 *
	 * @param _item: FeesMasterModel
	 */
	deleteFeesMaster(_item: FeesMasterModel) {

		const _title = 'FeesMaster';
		const _description = 'Are you sure to permanently delete selected FeesMaster?';
		const _waitDesciption = 'FeesMaster is deleting...';
		const _deleteMessage = ' Selected FeesMaster has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneFeesMasterDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadFeesMasterList();
		});
		

	}

	/**
	 * Show add FeesMaster dialog
	 */
	addFeesMaster() {
		this.feesMaster=new FeesMasterModel();
		this.feesMaster.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit FeesMaster dialog and save after success close result
	 * @param FeesMaster: FeesMasterModel
	 */
	editFeesMaster(feesMaster: FeesMasterModel) {
		
		this.feesMaster=feesMaster;
		this.createForm();

	}



createForm() {
  debugger;
  

	this.feesMasterForm = this.fb.group({
    amount: [this.feesMaster.amount, Validators.required],
    dueDate: [this.typesUtilsService.getDateFromString(this.feesMaster.dueDate), Validators.compose([Validators.nullValidator])],
	feeGroupId: [this.feesMaster.feeGroupId, Validators.required],
	feeGroupName: [this.feesMaster.feeGroupName, Validators.required],
	feetypeId: [this.feesMaster.feetypeId,  Validators.required],
	feetypeName: [this.feesMaster.feetypeName, Validators.required],
    fineAmount: [this.feesMaster.fineAmount,  ],
    finePercentage: [this.feesMaster.finePercentage, ],
    fineType: [this.feesMaster.fineType, ],
    isActive: [this.feesMaster.isActive, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.feesMasterForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared feesMaster
 */
prepareFeesMaster(): FeesMasterModel {
	const controls = this.feesMasterForm.controls;
  const _feesMaster = new FeesMasterModel();

  _feesMaster.id = this.feesMaster.id;

  _feesMaster.amount = controls.amount.value;
  const _dueDate = controls.dueDate.value;
  if (_dueDate) {
    _feesMaster.dueDate = this.typesUtilsService.dateFormat(_dueDate);
  } else {
    _feesMaster.dueDate = '';
  }
  _feesMaster.feeGroupId = controls.feeGroupId.value;
  _feesMaster.feeGroupName = controls.feeGroupName.value;
  _feesMaster.feetypeId = controls.feetypeId.value;
  _feesMaster.feetypeName = controls.feetypeName.value;
  _feesMaster.fineAmount = controls.fineAmount.value;
  _feesMaster.finePercentage = controls.finePercentage.value;
  _feesMaster.fineType = controls.fineType.value;
	_feesMaster.isActive='yes';
	return _feesMaster;
}

getNameByGroupId(id){
	debugger
	// var classObj=this.classList.find(x => x.id === classId);
	// this.searchForm.controls.classes.setValue(classObj.classses);


	this.feesGroupList.forEach((element,i) => {
		if(element.id === id){
			this.feesMasterForm.get("feeGroupName").setValue(element.name) 
		}	
	});	
}

getNameByTypeId(id){
	this.feesTypeList.forEach((element,i) => {
		if(element.id === id){
			this.feesMasterForm.get("feetypeName").setValue(element.type) 
		}	
	});
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.feesMasterForm.controls;
	/** check form */
	if (this.feesMasterForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedFeesMaster = this.prepareFeesMaster();
	if (editedFeesMaster.id > 0) {
		this.updateFeesMaster(editedFeesMaster);
	} else {
		this.createFeesMaster(editedFeesMaster);
	}

	const	_saveMessage= editedFeesMaster.id > 0 ? 'FeesMaster  has been updated' : 'FeesMaster has been created';
		
	const _messageType = editedFeesMaster.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadFeesMasterList();
		this.feesMasterForm.reset();
		this.addFeesMaster();
		// this.feesMaster.clear();
		// this.createForm();

}


onFineTypeChange($event){
  debugger
  if($event.value === 'None'){
    this.percentageFieldDisable = true;
	this.fixAmountFieldDisable = true;
	this.feesMasterForm.get("finePercentage").setValue(0) 
	this.feesMasterForm.get("fineAmount").setValue(0) 
  }

  if($event.value === 'Percentage'){
    this.percentageFieldDisable = false;
    this.fixAmountFieldDisable = true;
  }

  if($event.value === 'Fix Amount'){
    this.percentageFieldDisable = true;
	this.fixAmountFieldDisable = false;
	this.feesMasterForm.get("finePercentage").setValue(0) 
	this.feesMasterForm.get("fineAmount").setValue(0) 
  }
}

assignMasterFeesToStudent(assignFeesStudent: AssignFeesStudentModel) {
	let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
//const _saveMessage = homework.id > 0 ? 'Edit  Homework' : 'Create  Homework';

	//const _messageType = homework.id > 0 ? MessageType.Update : MessageType.Create;
	const dialogRef = this.dialog.open(FeesMasterAssignStudentDialogComponent, { data: { assignFeesStudent } });
	dialogRef.afterClosed().subscribe(res => {
		if (!res) {
			return;
		}

	//	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
	 });
}
onCancel(){
	this.feesMasterForm.reset();
	this.addFeesMaster();
	// this.feesMaster.clear();
	// this.createForm();
}
/**
 * Update FeesMaster
 *
 * @param _feesMaster: FeesMasterModel
 */
updateFeesMaster(_feesMaster: FeesMasterModel) {
	const updateFeesMaster: Update<FeesMasterModel> = {
		id: _feesMaster.id,
		changes: _feesMaster
	};
	this.store.dispatch(new FeesMasterUpdated({
		partialFeesMaster: updateFeesMaster,
		feesMaster: _feesMaster
	}));


}

/**
 * Create FeesMaster
 *
 * @param _feesMaster: FeesMasterModel
 */
createFeesMaster(_feesMaster:FeesMasterModel) {
	this.store.dispatch(new FeesMasterOnServerCreated({ feesMaster: _feesMaster }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedFeesMasterId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _feesMaster, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}
_keyPress(event: any) {
	const pattern = /[0-9]/;
	let inputChar = String.fromCharCode(event.charCode);
	if (!pattern.test(inputChar)) {
		event.preventDefault();

	}
}

calculateFineAmountFromFinePercentage($event){

	let percentage = parseInt($event.target.value);
	let amount = this.feesMasterForm.get('amount').value;
	let fineAmount = amount * (percentage/100);
	if($event.target.value == null || $event.target.value == ''){
		this.feesMasterForm.get('fineAmount').setValue(0);
	}else{
		this.feesMasterForm.get('fineAmount').setValue(fineAmount);
	}
	
}


}
