import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RoomTypesDataSource, RoomTypeModel,selectRoomTypesActionLoading, } from 'src/app/core/hostel';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoomTypesPageRequested, OneRoomTypeDeleted, ManyRoomTypesDeleted, RoomTypesStatusUpdated, RoomTypeUpdated, RoomTypeOnServerCreated, selectLastCreatedRoomTypeId } from '../../../../core/hostel';



@Component({
  selector: 'kt-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent implements OnInit {

  // Table fields
dataSource: RoomTypesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'roomType', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<RoomTypeModel>(true, []);
roomTypesResult: RoomTypeModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
roomType: RoomTypeModel;
roomTypeForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;




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
			tap(() => this.loadRoomTypeList())
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
				this.loadRoomTypeList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new RoomTypesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.roomTypesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadRoomTypeList();
		}); // Remove this line, just loading imitation

		this.addRoomType();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	
	/**
	 * Load RoomTypes List from service through data-source
	 */
	loadRoomTypeList() {
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
		this.store.dispatch(new RoomTypesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.RoomType = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete RoomType
	 *
	 * @param _item: RoomTypeModel
	 */
	deleteRoomType(_item: RoomTypeModel) {

		const _title = 'RoomType';
		const _description = 'Are you sure to permanently delete selected RoomType?';
		const _waitDesciption = 'RoomType is deleting...';
		const _deleteMessage = ' Selected RoomType has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneRoomTypeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadRoomTypeList();
		});
		

	}

	/**
	 * Show add RoomType dialog
	 */
	addRoomType() {
		this.roomType=new RoomTypeModel();
		this.roomType.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit RoomType dialog and save after success close result
	 * @param roomType: RoomTypeModel
	 */
	editRoomType(roomType: RoomTypeModel) {
		
		this.roomType=roomType;
		this.createForm();

	}



createForm() {
	debugger;
	this.roomTypeForm = this.fb.group({
   
    roomType: [this.roomType.roomType, Validators.required],
    description: [this.roomType.description, ],
    isActive: [this.roomType.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.roomTypeForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared roomType
 */
prepareRoomType(): RoomTypeModel {
	const controls = this.roomTypeForm.controls;
	const _roomType = new RoomTypeModel();
	_roomType.id = this.roomType.id;
  _roomType.roomType = controls.roomType.value;
	_roomType.description = controls.description.value;
	_roomType.isActive='yes';
	return _roomType;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.roomTypeForm.controls;
	/** check form */
	if (this.roomTypeForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedRoomType = this.prepareRoomType();
	if (editedRoomType.id > 0) {
		this.updateRoomType(editedRoomType);
	} else {
		this.createRoomType(editedRoomType);
	}

	const	_saveMessage= editedRoomType.id > 0 ? 'RoomType  has been updated' : 'RoomType has been created';
		
	const _messageType = editedRoomType.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadRoomTypeList();
		this.roomTypeForm.reset();
		this.addRoomType();
		// this.roomType.clear();
		// this.createForm();

}
onCancel(){
	this.roomTypeForm.reset();
	this.addRoomType();
	// this.roomType.clear();
	// this.createForm();
}
/**
 * Update RoomType
 *
 * @param _roomType: RoomTypeModel
 */
updateRoomType(_roomType: RoomTypeModel) {
	const updateRoomType: Update<RoomTypeModel> = {
		id: _roomType.id,
		changes: _roomType
	};
	this.store.dispatch(new RoomTypeUpdated({
		partialRoomType: updateRoomType,
		roomType: _roomType
	}));


}

/**
 * Create RoomType
 *
 * @param _roomType: RoomTypeModel
 */
createRoomType(_roomType:RoomTypeModel) {
	this.store.dispatch(new RoomTypeOnServerCreated({ roomType: _roomType }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedRoomTypeId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _roomType, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}



