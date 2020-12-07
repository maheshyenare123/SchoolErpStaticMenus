import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HostelsDataSource, HostelModel,selectHostelsActionLoading, HostelService } from 'src/app/core/hostel';
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
import { HostelsPageRequested, OneHostelDeleted, ManyHostelsDeleted, HostelsStatusUpdated, HostelUpdated, HostelOnServerCreated, selectLastCreatedHostelId } from '../../../../core/hostel';


@Component({
  selector: 'kt-hostels',
  templateUrl: './hostels.component.html',
  styleUrls: ['./hostels.component.scss']
})
export class HostelsComponent implements OnInit {

 // Table fields
 dataSource: HostelsDataSource;
 //  dataSource = new MatTableDataSource(ELEMENT_DATA);
 displayedColumns = ['id', 'hostelName', 'type', 'address', 'intake', 'actions'];
 @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 @ViewChild('sort1', {static: true}) sort: MatSort;
 // Filter fields
 @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
 filterStatus = '';
 filterType = '';
 // Selection
 selection = new SelectionModel<HostelModel>(true, []);
 hostelsResult: HostelModel[] = [];
 // Subscriptions
 private subscriptions: Subscription[] = [];
 
 // Public properties
 hostel: HostelModel;
 hostelForm: FormGroup;
 hasFormErrors = false;
 viewLoading = false;
 // Private properties
 private componentSubscriptions: Subscription;
 files: File[] = [];

 searchType:any
 
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
       tap(() => this.loadHostelList())
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
         this.loadHostelList();
       })
     )
     .subscribe();
     this.subscriptions.push(searchSubscription);
 
     // Init DataSource
     this.dataSource = new HostelsDataSource(this.store);
   
     const entitiesSubscription = this.dataSource.entitySubject.pipe(
       skip(1),
       distinctUntilChanged()
     ).subscribe(res => {
       debugger
   console.log(res);
       this.hostelsResult = res;
       console.log()
     });
     this.subscriptions.push(entitiesSubscription);
     // First load
     of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
       this.loadHostelList();
     }); // Remove this line, just loading imitation
 
 this.addHostel();

   }
 /**
    * On Destroy
    */
   ngOnDestroy() {
     this.subscriptions.forEach(el => el.unsubscribe());
   }

   /**
    * Load Hostels List from service through data-source
    */
   loadHostelList() {
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
     this.store.dispatch(new HostelsPageRequested({ page: queryParams,searchTerm:this.searchType }));
     this.selection.clear();
   }
 
   /**
    * Returns object for filter
    */
   filterConfiguration(): any {
     const filter: any = {};
     const searchText: string = this.searchInput.nativeElement.value;
 
     filter.Hostel = searchText;
     if (!searchText) {
       return filter;
     }
     filter.description = searchText;
     return filter;
   }
 
   /** ACTIONS */
   /**
    * Delete Hostel
    *
    * @param _item: HostelModel
    */
   deleteHostel(_item: HostelModel) {
 
     const _title = 'Hostel';
     const _description = 'Are you sure to permanently delete selected Hostel?';
     const _waitDesciption = 'Hostel is deleting...';
     const _deleteMessage = ' Selected Hostel has been deleted';
 
 
 
     const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
     dialogRef.afterClosed().subscribe(res => {
       if (!res) {
         return;
       }
 
       this.store.dispatch(new OneHostelDeleted({ id: _item.id }));
       this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
       this.loadHostelList();
     });
     
 
   }
 
   /**
    * Show add Hostel dialog
    */
   addHostel() {
     this.hostel=new HostelModel();
     this.hostel.clear(); //
     this.createForm();
 
   }
 
   /**
    * Show Edit Hostel dialog and save after success close result
    * @param hostel: HostelModel
    */
   editHostel(hostel: HostelModel) {
     
     this.hostel=hostel;
     this.createForm();
 
   }
 
 
 
 createForm() {
   debugger;
   this.hostelForm = this.fb.group({
  
    // address: string;
    // description: string;
    // hostelName: string;
    // id: number;
    // intake: number;
    // isActive: string;
    // type: string;

    address: [this.hostel.address, Validators.required],
    description: [this.hostel.description, ],
    hostelName: [this.hostel.hostelName,  Validators.required],
    type: [this.hostel.type, Validators.required],
    intake: [this.hostel.intake, Validators.required],
    isActive: [this.hostel.isActive, ],
     
   });
 }
 
 
 /**
  * Check control is invalid
  * @param controlName: string
  */
 isControlInvalid(controlName: string): boolean {
   const control = this.hostelForm.controls[controlName];
   const result = control.invalid && control.touched;
   return result;
 }
 
 /** ACTIONS */
 
 /**
  * Returns prepared hostel
  */
 prepareHostel(): HostelModel {
   const controls = this.hostelForm.controls;
   const _hostel = new HostelModel();
   _hostel.id = this.hostel.id;
   // address: string;
    // description: string;
    // hostelName: string;
    // id: number;
    // intake: number;
    // isActive: string;
    // type: string;
 
  _hostel.address = controls.address.value;
  _hostel.description = controls.description.value;
  _hostel.hostelName = controls.hostelName.value;
  _hostel.intake = controls.intake.value;
  if(_hostel.id){
     _hostel.isActive = controls.isActive.value; 
  }else{
      _hostel.isActive='yes';
  }
 
  _hostel.type = controls.type.value;
 
   return _hostel;
 }
 
 /**
  * On Submit
  */
 onSubmit() {
   this.hasFormErrors = false;
   const controls = this.hostelForm.controls;
   /** check form */
   if (this.hostelForm.invalid) {
     Object.keys(controls).forEach(controlName =>
       controls[controlName].markAsTouched()
     );
 
     this.hasFormErrors = true;
     return;
   }
 
   const editedHostel = this.prepareHostel();
   if (editedHostel.id > 0) {
     this.updateHostel(editedHostel);
   } else {
     this.createHostel(editedHostel);
   }
 
   const	_saveMessage= editedHostel.id > 0 ? 'Hostel  has been updated' : 'Hostel has been created';
     
   const _messageType = editedHostel.id > 0 ? MessageType.Update : MessageType.Create;
   
     this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
     this.loadHostelList();
     this.hostelForm.reset();
     this.addHostel();
     // this.hostel.clear();
     // this.createForm();
 
 }
 onCancel(){
   this.hostelForm.reset();
   this.addHostel();
   // this.hostel.clear();
   // this.createForm();
 }
 /**
  * Update Hostel
  *
  * @param _hostel: HostelModel
  */
 updateHostel(_hostel: HostelModel) {
   const updateHostel: Update<HostelModel> = {
     id: _hostel.id,
     changes: _hostel
   };
   this.store.dispatch(new HostelUpdated({
     partialHostel: updateHostel,
     hostel: _hostel
   }));
 
 
 }
 
 /**
  * Create Hostel
  *
  * @param _hostel: HostelModel
  */
 createHostel(_hostel:HostelModel) {
   this.store.dispatch(new HostelOnServerCreated({ hostel: _hostel }));
   this.componentSubscriptions = this.store.pipe(
     select(selectLastCreatedHostelId),
     delay(1000), // Remove this line
   ).subscribe(res => {
     if (!res) {
       return;
     }
 
     // this.dialogRef.close({ _hostel, isEdit: false });
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
 
 
 
 