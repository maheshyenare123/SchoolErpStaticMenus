import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HostelRoomsDataSource, HostelRoomModel,selectHostelRoomsActionLoading, HostelRoomService, RoomTypeService, HostelService, HostelModel, RoomTypeModel, } from 'src/app/core/hostel';
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
import { HostelRoomsPageRequested, OneHostelRoomDeleted, ManyHostelRoomsDeleted, HostelRoomsStatusUpdated, HostelRoomUpdated, HostelRoomOnServerCreated, selectLastCreatedHostelRoomId } from '../../../../core/hostel';


@Component({
  selector: 'kt-hostel-room',
  templateUrl: './hostel-room.component.html',
  styleUrls: ['./hostel-room.component.scss']
})
export class HostelRoomComponent implements OnInit {

   // Table fields
dataSource: HostelRoomsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);

displayedColumns = ['id', 'roomNo', 'hostelId', 'roomTypeId', 'noOfBed', 'costPerBed', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<HostelRoomModel>(true, []);
hostelroomsResult: HostelRoomModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
hostelRoom: HostelRoomModel;
hostelRoomForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
hostelList: HostelModel[] = [];
roomTypeList: RoomTypeModel[] = [];
searchType:any

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
    private hostelRoomService:HostelRoomService,
    private hostelService:HostelService,
    private roomTypeService:RoomTypeService,
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
			tap(() => this.loadHostelRoomList())
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
				this.loadHostelRoomList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new HostelRoomsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.hostelroomsResult = res;
			console.log()
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadHostelRoomList();
		}); // Remove this line, just loading imitation

this.addHostelRoom();
this.loadAllHostel();
this.loadAllRoomType();

  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	loadAllHostel() {
		debugger
		this.hostelService.getAllHostels().subscribe(res => {
			const data = res['data'];
			this.hostelList = data['content'];
			console.log(this.hostelList)
		}, err => {
		});
  }
  loadAllRoomType() {
		debugger
		this.roomTypeService.getAllRoomTypes().subscribe(res => {
			const data = res['data'];
			this.roomTypeList = data['content'];
			console.log(this.roomTypeList)
		}, err => {
		});
	}
	/**
	 * Load HostelRooms List from service through data-source
	 */
	loadHostelRoomList() {
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
		this.store.dispatch(new HostelRoomsPageRequested({ page: queryParams}));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.HostelRoom = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete HostelRoom
	 *
	 * @param _item: HostelRoomModel
	 */
	deleteHostelRoom(_item: HostelRoomModel) {

		const _title = 'HostelRoom';
		const _description = 'Are you sure to permanently delete selected HostelRoom?';
		const _waitDesciption = 'HostelRoom is deleting...';
		const _deleteMessage = ' Selected HostelRoom has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneHostelRoomDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadHostelRoomList();
		});
		

	}

	/**
	 * Show add HostelRoom dialog
	 */
	addHostelRoom() {
		this.hostelRoom=new HostelRoomModel();
		this.hostelRoom.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit HostelRoom dialog and save after success close result
	 * @param hostelroom: HostelRoomModel
	 */
	editHostelRoom(hostelroom: HostelRoomModel) {
		
		this.hostelRoom=hostelroom;
		this.createForm();

	}



createForm() {
	debugger;
	this.hostelRoomForm = this.fb.group({
    costPerBed: [this.hostelRoom.costPerBed, Validators.required],
    description: [this.hostelRoom.description, ],
    hostelId: [this.hostelRoom.hostelId, Validators.required],
    noOfBed: [this.hostelRoom.noOfBed, Validators.required],
    roomNo: [this.hostelRoom.roomNo, Validators.required],
    roomTypeId: [this.hostelRoom.roomTypeId, Validators.required],
    title: [this.hostelRoom.title, ],
    isActive: [this.hostelRoom.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.hostelRoomForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared hostelroom
 */
prepareHostelRoom(): HostelRoomModel {
	const controls = this.hostelRoomForm.controls;
	const _hostelRoom = new HostelRoomModel();
  _hostelRoom.id = this.hostelRoom.id;

  _hostelRoom.costPerBed = controls.costPerBed.value;
  _hostelRoom.description = controls.description.value;
  _hostelRoom.hostelId = controls.hostelId.value;
  _hostelRoom.noOfBed = controls.noOfBed.value;
   if(_hostelRoom.id){
     _hostelRoom.isActive = controls.isActive.value; 
  }else{
      _hostelRoom.isActive='yes';
  }
	_hostelRoom.roomNo = controls.roomNo.value;
  _hostelRoom.roomTypeId = controls.roomTypeId.value;
  _hostelRoom.title = controls.title.value;

	return _hostelRoom;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.hostelRoomForm.controls;
	/** check form */
	if (this.hostelRoomForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedHostelRoom = this.prepareHostelRoom();
	if (editedHostelRoom.id > 0) {
		this.updateHostelRoom(editedHostelRoom);
	} else {
		this.createHostelRoom(editedHostelRoom);
	}

	const	_saveMessage= editedHostelRoom.id > 0 ? 'HostelRoom  has been updated' : 'HostelRoom has been created';
		
	const _messageType = editedHostelRoom.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadHostelRoomList();
		this.hostelRoomForm.reset();
		this.addHostelRoom();
		// this.hostelroom.clear();
		// this.createForm();

}
onCancel(){
	this.hostelRoomForm.reset();
	this.addHostelRoom();
	// this.hostelRoom.clear();
	// this.createForm();
}
/**
 * Update HostelRoom
 *
 * @param _hostelRoom: HostelRoomModel
 */
updateHostelRoom(_hostelRoom: HostelRoomModel) {
	const updateHostelRoom: Update<HostelRoomModel> = {
		id: _hostelRoom.id,
		changes: _hostelRoom
	};
	this.store.dispatch(new HostelRoomUpdated({
		partialHostelRoom: updateHostelRoom,
		hostelRoom: _hostelRoom
	}));


}

/**
 * Create HostelRoom
 *
 * @param _hostelRoom: HostelRoomModel
 */
createHostelRoom(_hostelRoom:HostelRoomModel) {
	this.store.dispatch(new HostelRoomOnServerCreated({ hostelRoom: _hostelRoom }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedHostelRoomId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _hostelroom, isEdit: false });
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