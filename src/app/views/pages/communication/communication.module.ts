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
import { MaterialModule } from '../material/material.module';

import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { ModuleGuard } from 'src/app/core/auth';
import { InterceptService, TypesUtilsService, HttpUtilsService, LayoutUtilsService } from 'src/app/core/_base/crud';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {NgxPaginationModule} from 'ngx-pagination';
import { CommunicationComponent } from './communication.component';
import { EmailSmsLogComponent } from './email-sms-log/email-sms-log.component';
import { NoticeBoardComponent } from './notice-board/notice-board/notice-board.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { NoticeBoardEditDialogComponent } from './notice-board/notice-board-edit/notice-board-edit.dialog.component';
import { noticeBoardsReducer, NoticeBoardEffects, NoticeBoardService } from 'src/app/core/communication';

const routes: Routes = [
	{
		path: '',
		component: CommunicationComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'notice-board',
				component: NoticeBoardComponent
      },
      {
				path: 'send-email',
				component: SendEmailComponent
      },
      {
				path: 'send-sms',
				component: SendSmsComponent
      },
      {
				path: 'email-sms-log',
				component: EmailSmsLogComponent
      },
    ] 
  }
]


@NgModule({
  declarations: [
    CommunicationComponent, 
    NoticeBoardComponent, 
    NoticeBoardEditDialogComponent,
    SendEmailComponent, 
    SendSmsComponent, 
    EmailSmsLogComponent,
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
    NgxPaginationModule,
    CKEditorModule,
    
// state manage

    StoreModule.forFeature('noticeBoards', noticeBoardsReducer),
    EffectsModule.forFeature([NoticeBoardEffects]),

  

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
NoticeBoardService,

  ],
    entryComponents: [
      NoticeBoardEditDialogComponent
    ],
  exports: [RouterModule],
})
export class CommunicationModule { }


