
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
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
import { SessionModel,SessionsPageRequested, OneSessionDeleted, ManySessionsDeleted, SessionsStatusUpdated, SessionUpdated, SessionOnServerCreated, selectLastCreatedSessionId, SessionsDataSource } from '../../../../core/sysetm_settings';


@Component({
  selector: 'kt-session-setting',
  templateUrl: './session-setting.component.html',
  styleUrls: ['./session-setting.component.scss']
})
export class SessionSettingComponent implements OnInit {

  // Table fields
  dataSource: SessionsDataSource;
  //  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns = ['id', 'session', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('sort1', {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  filterStatus = '';
  filterType = '';
  // Selection
  selection = new SelectionModel<SessionModel>(true, []);
  studentClasssResult: SessionModel[] = [];
  // Subscriptions
  private subscriptions: Subscription[] = [];
  
  // Public properties
  session: SessionModel;
  sessionForm: FormGroup;
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
        tap(() => this.loadSessionList())
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
          this.loadSessionList();
        })
      )
      .subscribe();
      this.subscriptions.push(searchSubscription);
  
      // Init DataSource
      this.dataSource = new SessionsDataSource(this.store);
    
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
        this.loadSessionList();
      }); // Remove this line, just loading imitation
  
  this.addSession();
      
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
    loadSessionList() {
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
      this.store.dispatch(new SessionsPageRequested({ page: queryParams }));
      this.selection.clear();
    }
  
    /**
     * Returns object for filter
     */
    filterConfiguration(): any {
      const filter: any = {};
      const searchText: string = this.searchInput.nativeElement.value;
  
      filter.session = searchText;
      if (!searchText) {
        return filter;
      }
      filter.section = searchText;
      return filter;
    }
  
    /** ACTIONS */
    /**
     * Delete Session
     *
     * @param _item: SessionModel
     */
    deleteSession(_item: SessionModel) {
  
      const _title = 'Session';
      const _description = 'Are you sure to permanently delete selected Session?';
      const _waitDesciption = 'Session is deleting...';
      const _deleteMessage = ' Selected Session has been deleted';
  
  
  
      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
  
        this.store.dispatch(new OneSessionDeleted({ id: _item.id }));
        this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
        this.loadSessionList();
      });
      
  
    }
  
    /**
     * Show add Session dialog
     */
    addSession() {
      this.session=new SessionModel();
      this.session.clear(); //
      this.createForm();
  
    }
  
    /**
     * Show Edit Session dialog and save after success close result
     * @param Session: SessionModel
     */
    editSession(Session: SessionModel) {
      
      this.session=Session;
      this.createForm();
  
    
   
  
    }
  
  
  
  createForm() {
    debugger;
    this.sessionForm = this.fb.group({
      session: [this.session.session, Validators.required],
      // section: [this.Session.section, ],
      
    });
  }
 
  /**
   * Check control is invalid
   * @param controlName: string
   */
  isControlInvalid(controlName: string): boolean {
    const control = this.sessionForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }
  
  /** ACTIONS */
  
  /**
   * Returns prepared Session
   */
  prepareSession(): SessionModel {
    const controls = this.sessionForm.controls;
    const _session = new SessionModel();
    _session.id = this.session.id;
  
    if (_session.id > 0) {
      _session.isActive = this.session.isActive;
    } else {
      _session.isActive = 'yes';
    }
  
  
    _session.session = controls.session.value;
    // _session.section = controls.section.value;
 
    
    return _session;
  }
  
  /**
   * On Submit
   */
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.sessionForm.controls;
    /** check form */
    if (this.sessionForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
  
      this.hasFormErrors = true;
      return;
    }
  
    const editedStudentClass = this.prepareSession();
    console.log(editedStudentClass);
    if (editedStudentClass.id > 0) {
      this.updateSession(editedStudentClass);
    } else {
      this.createSession(editedStudentClass);
    }
    const	_saveMessage= editedStudentClass.id > 0 ? 'Session has been updated' : 'Session has been created';
      
    const _messageType = editedStudentClass.id > 0 ? MessageType.Update : MessageType.Create;
    
      this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
      
      this.sessionForm.reset();
  
      this.addSession();
      // this.Session.clear();
      // this.createForm();
      
     
  
  }
  onCancel(){
    this.sessionForm.reset();
    this.addSession();
    // this.Session.clear();
    // this.createForm();
 
      
  }
  /**
   * Update Session
   *
   * @param _session: SessionModel
   */
  updateSession(_session: SessionModel) {
    const updateSession: Update<SessionModel> = {
      id: _session.id,
      changes: _session
    };
    this.store.dispatch(new SessionUpdated({
      partialSession: updateSession,
      session: _session
    }));
    this.loadSessionList();
  
  
  }
  
  /**
   * Create Session
   *
   * @param _session: SessionModel
   */
  createSession(_session:SessionModel) {
    this.store.dispatch(new SessionOnServerCreated({ session: _session }));
    this.componentSubscriptions = this.store.pipe(
      select(selectLastCreatedSessionId),
      // delay(1000), // Remove this line
    ).subscribe(res => {
      if (!res) {
        return;
      }
  
      // this.dialogRef.close({ _session, isEdit: false });
    });
    this.loadSessionList();
  
  }
  
  /** Alect Close event */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  
  sectionChange($event){
    if($event.target.checked === true){
      //this.Session.section.push()
  
    }else{
  
    }
  }
  
  }
