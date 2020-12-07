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

import { ExaminationComponent } from './examination.component';
import { ExamGroupComponent } from './exam-group/exam-group.component';
import { examGroupsReducer, ExamGroupEffects, ExamEffects, ExamService, examsReducer, AssignStudentExamEffects, AssignStudentExamService, assignStudentExamsReducer, ExamSubjectEffects, ExamSubjectService, examSubjectsReducer, ExamSubjectMarksEffects, ExamSubjectMarksService, examSubjectMarkssReducer } from 'src/app/core/examination';
import { ExamGroupService } from 'src/app/core/examination/_services/exam-group.service';
import { ExamEditDialogComponent } from './exams/exam-edit/exam-edit.dialog.component';
import { ExamComponent } from './exams/exam/exam.component';
import { ExamScheduleComponent } from './exam-schedule/exam-schedule.component';
import { ExamAssignStudentDialogComponent } from './exam-assign-student/exam-assign-student.dialog.component';
import { ExamSubjectDialogComponent } from './exam-subject-edit/exam-subject-edit.dialog.component';
import { ExamMarksDialogComponent } from './exam-marks/exam-marks.dialog.component';
import { ExamSubjectMarksComponent } from './exam-subject-marks/exam-subject-marks.component';
import { ExamResultComponent } from './exam-result/exam-result.component';



const routes: Routes = [
	{
		path: '',
		component: ExaminationComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'exam-group',
				component: ExamGroupComponent
      },
      {
				path: 'exam-schedule',
				component: ExamScheduleComponent
      },
      {
				path: 'exam/:id',
				component: ExamComponent
      },
      {
				path: 'examSubjectMarks/:examId/:examSubjectId',
				component: ExamSubjectMarksComponent
      },
      {
				path: 'exam-result',
				component: ExamResultComponent
      },
      
    ] 
  }
]


@NgModule({
  declarations: [
    ExaminationComponent,
    ExamGroupComponent,
    ExamComponent,
    ExamEditDialogComponent,
    ExamScheduleComponent,
    ExamAssignStudentDialogComponent,
    ExamSubjectDialogComponent,
    ExamMarksDialogComponent,
    ExamSubjectMarksComponent,
    ExamResultComponent
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
   // CKEditorModule
    
// state manage
StoreModule.forFeature('examGroups', examGroupsReducer),
EffectsModule.forFeature([ExamGroupEffects]),

StoreModule.forFeature('exams', examsReducer),
EffectsModule.forFeature([ExamEffects]),

StoreModule.forFeature('assignStudentExams', assignStudentExamsReducer),
EffectsModule.forFeature([AssignStudentExamEffects]),
   
StoreModule.forFeature('examSubjects', examSubjectsReducer),
EffectsModule.forFeature([ExamSubjectEffects]),


StoreModule.forFeature('examSubjectMarkss', examSubjectMarkssReducer),
EffectsModule.forFeature([ExamSubjectMarksEffects]),
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
ExamGroupService,
ExamService,
AssignStudentExamService,
ExamSubjectService,
ExamSubjectMarksService,
  ],
    entryComponents: [
      ExamEditDialogComponent,
      ExamAssignStudentDialogComponent,
      ExamSubjectDialogComponent,
      ExamMarksDialogComponent
    ],
  exports: [RouterModule],
})
export class ExaminationModule { }
