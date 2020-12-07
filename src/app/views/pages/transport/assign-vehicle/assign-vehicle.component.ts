
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AssignVehiclesDataSource, AssignVehicleModel,selectAssignVehiclesActionLoading, RouteModel, VehicleModel, RouteService, VehicleService } from '../../../../core/transport';
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
import { AssignVehiclesPageRequested, OneAssignVehicleDeleted, ManyAssignVehiclesDeleted, AssignVehiclesStatusUpdated, AssignVehicleUpdated, AssignVehicleOnServerCreated, selectLastCreatedAssignVehicleId } from '../../../../core/transport';
import { VehiclesModel } from 'src/app/core/transport/_models/vehicle.model';


@Component({
  selector: 'kt-assign-vehicle',
  templateUrl: './assign-vehicle.component.html',
  styleUrls: ['./assign-vehicle.component.scss']
})
export class AssignVehicleComponent implements OnInit {

  // Table fields
dataSource: AssignVehiclesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'route', 'vehicle', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<AssignVehicleModel>(true, []);
assignVehiclesResult: AssignVehicleModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
assignVehicle: AssignVehicleModel;
assignVehicleForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;



routeList: RouteModel[] = [];
vehicleList: VehicleModel[] = [];
vehicleCheckBoxList: VehicleCheckBox[] = [];


  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private routeService: RouteService,
		private vehicleService: VehicleService,
	) { }

  ngOnInit() {

	debugger;
	this.loadAllVehicle();
	this.loadAllRoutes();
	// this.loadAllSections();
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadAssignVehicleList())
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
				this.loadAssignVehicleList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new AssignVehiclesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	       console.log(res);
			this.assignVehiclesResult = res;
			console.log("res"+this.assignVehiclesResult);
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadAssignVehicleList();
		}); // Remove this line, just loading imitation

this.addAssignVehicle();
		
  }

	//get All Class List
	loadAllRoutes() {
		debugger
		this.routeService.getAllRoutes().subscribe(res => {
			const data = res['data'];
			this.routeList = data['content'];
			console.log(this.routeList)
		}, err => {
		});
	}


	loadAllVehicle() {
		debugger
		this.vehicleService.getAllVehicles().subscribe(res => {
			const data = res['data'];
			this.vehicleList = data['content'];
			console.log(this.vehicleList)
			this.setVehicleDataInChecboxList();
		
		}, err => {
		});
	}
  setVehicleDataInChecboxList(){
	this.vehicleList.forEach(element => {
		this.vehicleCheckBoxList.push({ 'data':	new VehiclesModel(element.id,element.vehicleNo,element.isSaved), 'isChecked': false })
	})
}




/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load AssignVehicles List from service through data-source
	 */
	loadAssignVehicleList() {
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
		this.store.dispatch(new AssignVehiclesPageRequested({ page: queryParams }));
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
    filter.name = searchText;
    filter.classSection = searchText;
    filter.subject = searchText;
  
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete AssignVehicle
	 *
	 * @param _item: AssignVehicleModel
	 */
	deleteAssignVehicle(_item: AssignVehicleModel) {

		const _title = 'Assign Vehicle';
		const _description = 'Are you sure to permanently delete selected Assign Vehicle?';
		const _waitDesciption = 'Assign Vehicle is deleting...';
		const _deleteMessage = ' Selected Assign Vehicle has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			// this.store.dispatch(new OneAssignVehicleDeleted({ id: _item.id }));
			this.store.dispatch(new OneAssignVehicleDeleted({ payloadItem: _item }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadAssignVehicleList();
		});
		

	}

	/**
	 * Show add AssignVehicle dialog
	 */
	addAssignVehicle() {
		this.assignVehicle=new AssignVehicleModel();
		this.assignVehicle.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit AssignVehicle dialog and save after success close result
	 * @param assignVehicle: AssignVehicleModel
	 */
	editAssignVehicle(assignVehicle: AssignVehicleModel) {
		this.assignVehicle=assignVehicle;
		this.createForm();
	
//by default check subject checkbox
		this.vehicleCheckBoxList.forEach(element => {
			this.assignVehicle.vehicles.forEach(innerElement => {
				if (element.data.id == innerElement.id) {
					element.isChecked = true;
				}
			})


		})

	}



createForm() {
	debugger;
	this.assignVehicleForm = this.fb.group({
	routeId: [this.assignVehicle.routeId, Validators.required],
	isActive: [this.assignVehicle.isActive, ],
    // sections: [this.assignVehicle.sections, Validators.required],
		// subjects: [this.assignVehicle.subjects, Validators.required],
	});
}

onVehicleCheckBoxChanges(_isChecked: boolean, id: number) {
	// get current position of the changes element by ID
	const index = this.vehicleCheckBoxList.findIndex(_ => _.data.id === id);
	// if (!(index > -1)) return;

	// const isChecked = this.checkBoxes[index].isChecked;
	if (_isChecked) {
		this.vehicleCheckBoxList[index].isChecked = _isChecked;
		this.vehicleCheckBoxList[index].data.isSaved = 1
	}else{
		this.vehicleCheckBoxList[index].isChecked = _isChecked;
		this.vehicleCheckBoxList[index].data.isSaved = 0
	}
}

onRouteSelectChange(classId){
	var classObj=this.routeList.find(x => x.id === classId);
	// this.assignVehicleForm.controls.className.setValue(classObj.classses);

}
/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.assignVehicleForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared AssignVehicle
 */
prepareAssignVehicle(): AssignVehicleModel {
	const controls = this.assignVehicleForm.controls;
	const _assignVehicle = new AssignVehicleModel();
	_assignVehicle.id = this.assignVehicle.id;

	if(_assignVehicle.id>0){
		_assignVehicle.isActive = controls.isActive.value;
	}else{
		_assignVehicle.isActive = 'yes';
	}
  _assignVehicle.routeId = controls.routeId.value;
  
//   _assignVehicle.sections = controls.sections.value;
//   _assignVehicle.subjects = controls.subjects.value;


const vehicleData: VehicleModel[] = [];
		this.vehicleCheckBoxList.forEach(element => {
			if (element.isChecked) {
				vehicleData.push(element.data);
			}
		})
		_assignVehicle.vehicles =vehicleData;
	return _assignVehicle;
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.assignVehicleForm.controls;
	/** check form */
	if (this.assignVehicleForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedAssignVehicle = this.prepareAssignVehicle();
	console.log(editedAssignVehicle);
	if (editedAssignVehicle.id > 0) {
		this.updateAssignVehicle(editedAssignVehicle);
	} else {
		this.createAssignVehicle(editedAssignVehicle);
	}
	this.loadAssignVehicleList();
	const	_saveMessage= editedAssignVehicle.id > 0 ? 'Assign Vehicle  has been updated' : 'Assign Vehicle has been created';
		
	const _messageType = editedAssignVehicle.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
		this.assignVehicleForm.reset();

		this.addAssignVehicle();
		// this.assignVehicle.clear();
		// this.createForm();
		this.vehicleCheckBoxList = [];
		this.setVehicleDataInChecboxList();

}
onCancel(){
	this.assignVehicleForm.reset();
	this.addAssignVehicle();
	// this.assignVehicle.clear();
	// this.createForm();
	this.vehicleCheckBoxList = [];
		this.setVehicleDataInChecboxList();
}
/**
 * Update AssignVehicle
 *
 * @param _assignVehicle: AssignVehicleModel
 */
updateAssignVehicle(_assignVehicle: AssignVehicleModel) {
	
	const updateAssignVehicle: Update<AssignVehicleModel> = {
		id: _assignVehicle.id,
		changes: _assignVehicle
	};
	this.store.dispatch(new AssignVehicleUpdated({
		partialAssignVehicle: updateAssignVehicle,
		assignVehicle: _assignVehicle
	}));


}

/**
 * Create AssignVehicle
 *
 * @param _assignVehicle: AssignVehicleModel
 */
createAssignVehicle(_assignVehicle:AssignVehicleModel) {
	debugger

	this.store.dispatch(new AssignVehicleOnServerCreated({ assignVehicle: _assignVehicle }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedAssignVehicleId),
		// delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _assignVehicle, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
export class VehicleCheckBox {
  data:VehiclesModel;
  isChecked:boolean;
}

