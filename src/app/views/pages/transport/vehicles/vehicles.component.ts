import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VehiclesDataSource, VehicleModel,selectVehiclesActionLoading, VehicleService, } from 'src/app/core/transport';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService  } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { VehiclesPageRequested, OneVehicleDeleted, ManyVehiclesDeleted, VehiclesStatusUpdated, VehicleUpdated, VehicleOnServerCreated, selectLastCreatedVehicleId } from '../../../../core/transport';


@Component({
  selector: 'kt-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  // Table fields
dataSource: VehiclesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);

displayedColumns = ['id', 'vehicleNo', 'vehicleModel', 'manufactureYear', 'driverName', 'driverLicence', 'driverContact', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<VehicleModel>(true, []);
vehiclesResult: VehicleModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
vehicle: VehicleModel;
vehicleForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
searchType:any
	id: number;
	vehicleNo: string;
	isSaved: number;

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
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
			tap(() => this.loadVehicleList())
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
				this.loadVehicleList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new VehiclesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.vehiclesResult = res;
			console.log()
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadVehicleList();
		}); // Remove this line, just loading imitation

this.addVehicle();

  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Vehicles List from service through data-source
	 */
	loadVehicleList() {
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
		this.store.dispatch(new VehiclesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.Vehicle = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Vehicle
	 *
	 * @param _item: VehicleModel
	 */
	deleteVehicle(_item: VehicleModel) {

		const _title = 'Vehicle';
		const _description = 'Are you sure to permanently delete selected Vehicle?';
		const _waitDesciption = 'Vehicle is deleting...';
		const _deleteMessage = ' Selected Vehicle has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneVehicleDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadVehicleList();
		});
		

	}

	/**
	 * Show add Vehicle dialog
	 */
	addVehicle() {
		this.vehicle=new VehicleModel(this.id,this.vehicleNo,this.isSaved);
		this.vehicle.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Vehicle dialog and save after success close result
	 * @param vehicle: VehicleModel
	 */
	editVehicle(vehicle: VehicleModel) {
		
		this.vehicle=vehicle;
		this.createForm();

	}



createForm() {
	debugger;
	this.vehicleForm = this.fb.group({
  
    driverContact: [this.vehicle.driverContact, [Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.maxLength(10)]],
    driverName: [this.vehicle.driverName, Validators.required],
    driverLicence: [this.vehicle.driverLicence, ],
    manufactureYear: [this.vehicle.manufactureYear,],
    vehicleNo: [this.vehicle.vehicleNo, ],
    vehicleModel: [this.vehicle.vehicleModel,],
    note: [this.vehicle.note, ],
    isActive: [this.vehicle.isActive, ],
	isSaved: [this.vehicle.isSaved, ],	
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.vehicleForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared vehicle
 */
prepareVehicle(): VehicleModel {
	const controls = this.vehicleForm.controls;
	const _vehicle = new VehicleModel(this.id,this.vehicleNo,this.isSaved);
  _vehicle.id = this.vehicle.id;

  _vehicle.driverContact = controls.driverContact.value;
  _vehicle.driverLicence = controls.driverLicence.value;
  _vehicle.driverName = controls.driverName.value;
  _vehicle.manufactureYear = controls.manufactureYear.value;
  _vehicle.vehicleNo = controls.vehicleNo.value;
  if(_vehicle.id>0){
	_vehicle.isActive = controls.isActive.value;
}else{
	_vehicle.isActive = 'yes';
}
 
  _vehicle.isSaved = 0;
	_vehicle.vehicleModel = controls.vehicleModel.value;
  _vehicle.note = controls.note.value;

	return _vehicle;
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.vehicleForm.controls;
	/** check form */
	if (this.vehicleForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedVehicle = this.prepareVehicle();
	if (editedVehicle.id > 0) {
		this.updateVehicle(editedVehicle);
	} else {
		this.createVehicle(editedVehicle);
	}

	const	_saveMessage= editedVehicle.id > 0 ? 'Vehicle  has been updated' : 'Vehicle has been created';
		
	const _messageType = editedVehicle.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadVehicleList();
		this.vehicleForm.reset();
		this.addVehicle();
		// this.vehicle.clear();
		// this.createForm();

}
onCancel(){
	this.vehicleForm.reset();
	this.addVehicle();
	// this.vehicle.clear();
	// this.createForm();
}
/**
 * Update Vehicle
 *
 * @param _vehicle: VehicleModel
 */
updateVehicle(_vehicle: VehicleModel) {
	const updateVehicle: Update<VehicleModel> = {
		id: _vehicle.id,
		changes: _vehicle
	};
	this.store.dispatch(new VehicleUpdated({
		partialVehicle: updateVehicle,
		vehicle: _vehicle
	}));


}

/**
 * Create Vehicle
 *
 * @param _vehicle: VehicleModel
 */
createVehicle(_vehicle:VehicleModel) {
	this.store.dispatch(new VehicleOnServerCreated({ vehicle: _vehicle }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedVehicleId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _vehicle, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}
onSelect(event) {
	console.log(event);
	this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
	console.log(event);
	this.files.splice(this.files.indexOf(event), 1);
  }
  _keyPress(event: any) {
	const pattern = /[0-9]/;
	let inputChar = String.fromCharCode(event.charCode);
	if (!pattern.test(inputChar)) {
		event.preventDefault();

	}
}
}




