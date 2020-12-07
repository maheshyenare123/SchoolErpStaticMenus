import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { CodePreviewModule } from '../../partials/content/general/code-preview/code-preview.module';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatIconRegistry } from '@angular/material/icon';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';


//components
import {FrontOfficeComponent} from './front-office.component';
import { AdmissionEnquiryListComponent } from "./admission-enquiry/admission-enquiry-list/admission-enquiry-list.component";
import { VisitorBookListComponent } from './visitor-book/visitor-book-list/visitor-book-list.component';
import { PhoneCallLogListComponent } from './phone-call-log/phone-call-log-list/phone-call-log-list.component';
import { PostalDispatchListComponent } from './postal-dispatch/postal-dispatch-list/postal-dispatch-list.component';
import {PostalRecevieListComponent} from './postal-receive/postal-recevie-list/postal-recevie-list.component';
import { ComplainListComponent } from './complain/complain-list/complain-list.component';
import {PurposeComponent} from './setup-front-office/purpose/purpose.component';
import {ComplainTypeComponent} from './setup-front-office/complain-type/complain-type.component';
import {SourceComponent} from './setup-front-office/source/source.component';
import {ReferenceComponent} from './setup-front-office/reference/reference.component';
import { AdmissionEnquiryEditDialogComponent } from './admission-enquiry/admission-enquiry-edit/admission-enquiry-edit.dialog.component';
import { MaterialModule } from '../material/material.module';
import { PhoneCallLogEditDialogComponent } from './phone-call-log/phone-call-log-edit/phone-call-log-edit.dialog.component';
import { PostalDispatchEditDialogComponent } from './postal-dispatch/postal-dispatch-edit/postal-dispatch-edit.dialog.component';
import { PostalReceiveEditDialogComponent } from './postal-receive/postal-receive-edit/postal-receive-edit.dialog.component';
import { ComplainEditDialogComponent } from './complain/complain-edit/complain-edit.dialog.component';
import { VisitorBookEditDialogComponent } from './visitor-book/visitor-book-edit/visitor-book-edit.dialog.component';
import { StoreModule } from '@ngrx/store';
import { admissionEnquirysReducer, AdmissionEnquiryEffects, VisitorPurposeEffects, visitorPurposesReducer, SourceEffects, sourcesReducer, ReferenceEffects, referencesReducer, ComplaintTypeEffects, complaintTypesReducer, VisitorBookEffects, visitorBooksReducer, PostalReceiveEffects, postalReceivesReducer, PostalDispatchEffects, postalDispatchsReducer, PhoneCallLogEffects, phoneCallLogsReducer, ComplaintEffects, complaintsReducer, AdmissionEnquiryService, ComplaintTypeService, ComplaintService, PostalDispatchService, PostalReceiveService, VisitorBookService, ReferenceService, SourceService, VisitorPurposeService, PhoneCallLogService } from '../../../core/front-office';
import { EffectsModule } from '@ngrx/effects';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { ModuleGuard } from '../../../core/auth';
import { InterceptService, TypesUtilsService, HttpUtilsService, LayoutUtilsService } from '../../../core/_base/crud';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';


const routes: Routes = [
	{
		path: '',
		component: FrontOfficeComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
			},
			{
				path: 'admissionenqury',
				component: AdmissionEnquiryListComponent
      },
      

      {
				path: 'visitorbook',
				component: VisitorBookListComponent
      },

      {
				path: 'phonecalllog',
				component: PhoneCallLogListComponent
      },
      {
				path: 'postaldispatch',
				component: PostalDispatchListComponent
      },
      {
				path: 'postalreceive',
				component: PostalRecevieListComponent
      },
      {
				path: 'complain',
				component: ComplainListComponent
      },
  {
    path: 'setup-front-office/purpose',
    component: PurposeComponent
  },
  {
    path: 'setup-front-office/complaintype',
    component: ComplainTypeComponent
  },
  {
    path: 'setup-front-office/source',
    component: SourceComponent
  },
  {
    path: 'setup-front-office/reference',
    component: ReferenceComponent
  },
    ]
  }
]

@NgModule({
  declarations: [
    FrontOfficeComponent,
    AdmissionEnquiryListComponent,
    AdmissionEnquiryEditDialogComponent,
VisitorBookListComponent,
VisitorBookEditDialogComponent,
    PhoneCallLogListComponent,
    PhoneCallLogEditDialogComponent,
    PostalDispatchListComponent,
    PostalDispatchEditDialogComponent,
    PostalRecevieListComponent,
    PostalReceiveEditDialogComponent,
    ComplainListComponent,
    ComplainEditDialogComponent,
    PurposeComponent,
    ComplainTypeComponent,
    SourceComponent,
    ReferenceComponent,
    VisitorBookListComponent,



  ],
  imports: [
    CommonModule,
		PartialsModule,
		NgbModule,
		CoreModule,
		CodePreviewModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
    PerfectScrollbarModule,
    MaterialModule,
    TranslateModule.forChild(),
    NgxPermissionsModule.forChild(),


    
//state manage
    StoreModule.forFeature('admissionEnquirys', admissionEnquirysReducer),
    EffectsModule.forFeature([AdmissionEnquiryEffects]),
    StoreModule.forFeature('complaints', complaintsReducer),
    EffectsModule.forFeature([ComplaintEffects]),
    StoreModule.forFeature('phoneCallLogs', phoneCallLogsReducer),
    EffectsModule.forFeature([PhoneCallLogEffects]),
    StoreModule.forFeature('postalDispatchs', postalDispatchsReducer),
    EffectsModule.forFeature([PostalDispatchEffects]),
    StoreModule.forFeature('postalReceives', postalReceivesReducer),
    EffectsModule.forFeature([PostalReceiveEffects]),
    StoreModule.forFeature('visitorBooks', visitorBooksReducer),
    EffectsModule.forFeature([VisitorBookEffects]),
    StoreModule.forFeature('complaintTypes', complaintTypesReducer),
    EffectsModule.forFeature([ComplaintTypeEffects]),
    StoreModule.forFeature('references', referencesReducer),
    EffectsModule.forFeature([ReferenceEffects]),
    StoreModule.forFeature('sources', sourcesReducer),
    EffectsModule.forFeature([SourceEffects]),
    StoreModule.forFeature('visitorPurposes', visitorPurposesReducer),
		EffectsModule.forFeature([VisitorPurposeEffects]),
  ],
  providers: [
    NgbAlertConfig,
    MatIconRegistry,
    ModuleGuard,
    InterceptService,
    TypesUtilsService,
    HttpUtilsService,
    LayoutUtilsService,
		{ provide: MatBottomSheetRef, useValue: {} },
		{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },

    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },



//custom service
AdmissionEnquiryService,
ComplaintService,
ComplaintTypeService,
PhoneCallLogService,
PostalDispatchService,
PostalReceiveService,
ReferenceService,
SourceService,
VisitorBookService,
VisitorPurposeService,


  ],
   
    entryComponents: [
    // NgbdModalContentComponent
    AdmissionEnquiryEditDialogComponent,
    VisitorBookEditDialogComponent,
    PhoneCallLogEditDialogComponent,
    PostalDispatchEditDialogComponent,
    PostalReceiveEditDialogComponent,
    ComplainEditDialogComponent
	],
  exports: [RouterModule],
})
export class FrontOfficeModule { }
