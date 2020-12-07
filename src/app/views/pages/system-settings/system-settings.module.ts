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
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MaterialModule } from '../material/material.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

//component
import { SystemSettingsComponent } from './system-settings.component';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';
import { ModuleGuard } from 'src/app/core/auth';
import { HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService } from 'src/app/core/_base/crud';//DynamicSetActionsService
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { UsersComponent } from './users/users.component';
import { EmailSettingComponent } from './email-setting/email-setting.component';
import { SmsSettingComponent } from './sms-setting/sms-setting.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { SessionSettingComponent } from './session-setting/session-setting.component';
import { BackupRestoreComponent } from './backup-restore/backup-restore.component';
import { SessionService } from 'src/app/core/sysetm_settings/_services/session.service';
import { sessionsReducer } from 'src/app/core/sysetm_settings/_reducers/session.reducers';
import { SessionEffects } from 'src/app/core/sysetm_settings/_effects/session.effects';
import { staffsReducer, StaffService } from 'src/app/core/human-resource';
import { StaffEffects } from 'src/app/core/human-resource/_effects/staff.effects';
import { studentsReducer, StudentEffects, StudentService } from 'src/app/core/student-information';


const routes: Routes = [
  {
    path: '',
    component: SystemSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
      },
      {
        path: 'roles',
        component: RolesPermissionsComponent
      },
      {
        path: 'sessions',
        component: SessionSettingComponent
      },
      {
        path: 'email_setting',
        component: EmailSettingComponent
      },
      {
        path: 'sms_setting',
        component: SmsSettingComponent
      },
      {
        path: 'backup_restore',
        component: BackupRestoreComponent
      },
      {
        path: 'notification_setting',
        component: NotificationSettingComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },

    ]
  }
]



@NgModule({
  declarations: [
    SystemSettingsComponent,
    RolesPermissionsComponent,
    UsersComponent,
    EmailSettingComponent,
    SmsSettingComponent,
    NotificationSettingComponent,
    SessionSettingComponent,
    BackupRestoreComponent

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
    StoreModule.forFeature('sessions', sessionsReducer),
    EffectsModule.forFeature([SessionEffects]),

    StoreModule.forFeature('students', studentsReducer),
    EffectsModule.forFeature([StudentEffects]),

    StoreModule.forFeature('staffs', staffsReducer),
    EffectsModule.forFeature([StaffEffects]),
  ],
  providers: [
    NgbAlertConfig,
    MatIconRegistry,
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },

    ModuleGuard,
    InterceptService,
    TypesUtilsService,
    HttpUtilsService,
    LayoutUtilsService,
    // DynamicSetActionsService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '1050px'
      }
    },

    //custom service
    SessionService,
    StudentService,
    StaffService,
  ],


  entryComponents: [

  ],
  exports: [RouterModule],

})
export class SystemSettingsModule { }
