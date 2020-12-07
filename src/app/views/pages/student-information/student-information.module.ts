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
import { StudentDetailsListComponent } from './student-details/student-details-list/student-details-list.component';
import { StudentDetailsEditComponent } from './student-details/student-details-edit/student-details-edit.component';
import { StudentInformationComponent } from './student-information.component';
import { OnlineAdmissionListComponent } from './online-admission-list/online-admission-list.component';
import { StudentCategoriesComponent } from './student-categories/student-categories.component';
import { StudentHouseComponent } from './student-house/student-house.component';
import { DisableReasonComponent } from './disable-reason/disable-reason.component';
import { BulkDeleteComponent } from './bulk-delete/bulk-delete.component';
import { DisabledStudentComponent } from './disabled-student/disabled-student.component';

import { disableReasonsReducer, DisableReasonEffects, studentDetailsReducer, studentsReducer, StudentEffects, CategoryEffects, studentHousesReducer, StudentHouseEffects, categorysReducer, DisableReasonService, StudentService, StudentHouseService, CategoryService, onlineAdmissionsReducer, OnlineAdmissionEffects,disabledStudentsReducer,DisabledStudentEffects,bulkDeletesReducer ,BulkDeleteEffects,BulkDeleteService,DisabledStudentService} from '../../../core/student-information';
import { ModuleGuard } from 'src/app/core/auth';
import { InterceptService, TypesUtilsService, HttpUtilsService, LayoutUtilsService } from 'src/app/core/_base/crud';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { StudentProfileViewDialogComponent } from './student-details/student-profile-view/student-profile-view.dialog.component';
import { StudentFeesCollectDialogComponent } from './student-details/student-fees-collect/student-fees-collect.dialog.component';


const routes: Routes = [
    {
        path: '',
        component: StudentInformationComponent,
        children: [
            {
                path: '',
                redirectTo: 'roles',
                pathMatch: 'full'
            },
            {
                path: 'student-details',
                component: StudentDetailsListComponent
            },
            {
                path: 'student-details-edit/:id',
                component: StudentDetailsEditComponent
            },

            {
                path: 'online-admission',
                component: OnlineAdmissionListComponent
            },
            {
                path: 'student-categories',
                component: StudentCategoriesComponent
            },
            {
                path: 'student-house',
                component: StudentHouseComponent
            },
            {
                path: 'disable-reason',
                component: DisableReasonComponent
            },
            {
                path: 'bulk-delete',
                component: BulkDeleteComponent
			},
			{
                path: 'disabled-student',
                component: DisabledStudentComponent
            },
        ]
    }
]

@NgModule({
    declarations: [
           StudentDetailsListComponent,
    StudentInformationComponent,
    StudentDetailsEditComponent,
    OnlineAdmissionListComponent,
    StudentCategoriesComponent,
    StudentHouseComponent,
    DisableReasonComponent,
    BulkDeleteComponent,
    DisabledStudentComponent,
    StudentProfileViewDialogComponent,
    StudentFeesCollectDialogComponent
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
        StoreModule.forFeature('disableReasons', disableReasonsReducer),
        EffectsModule.forFeature([DisableReasonEffects]),
        StoreModule.forFeature('students', studentsReducer),
        EffectsModule.forFeature([StudentEffects]),
        StoreModule.forFeature('categorys', categorysReducer),
        EffectsModule.forFeature([CategoryEffects]),
        StoreModule.forFeature('studentHouses', studentHousesReducer),
        EffectsModule.forFeature([StudentHouseEffects]),
        StoreModule.forFeature('onlineAdmissions', onlineAdmissionsReducer),
		EffectsModule.forFeature([OnlineAdmissionEffects]),
		StoreModule.forFeature('disabledStudents', disabledStudentsReducer),
        EffectsModule.forFeature([DisabledStudentEffects]),
		StoreModule.forFeature('bulkDeletes', bulkDeletesReducer),
        EffectsModule.forFeature([BulkDeleteEffects]),


    ], providers: [
        NgbAlertConfig,
        MatIconRegistry,
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
       {provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}},
        DisableReasonService,
        StudentService,
        CategoryService,
		StudentHouseService,
		BulkDeleteService,
		DisabledStudentService,
   
        ModuleGuard,
        InterceptService,
        TypesUtilsService,
        HttpUtilsService,
        LayoutUtilsService,
    
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
    StudentService
      ],


    entryComponents: [
        StudentProfileViewDialogComponent,
        StudentFeesCollectDialogComponent
    ],
    exports: [RouterModule],
})
export class StudentInformationModule { }

