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

import { LibraryComponent } from './library.component';
import { BookEditDialogComponent } from './Book-edit/Book-edit.dialog.component';
import { BookListComponent } from './book-list/book-list.component';
import { LibraryStudentMemberComponent } from './library-student-member/library-student-member.component';
import { LibraryStaffMemberComponent } from './library-staff-member/library-staff-member.component';
import { LibraryStudentMemberEditDialogComponent } from './library-student-member-edit/library-student-member-edit.dialog.component';
import { LibraryStaffMemberEditDialogComponent } from './library-staff-member-edit/library-staff-member-edit.dialog.component';

import { BookService, LibraryStudentMemberService, LibraryStaffMemberService, booksReducer, BookEffects, LibraryStaffMemberEffects, LibraryStudentMemberEffects, libraryStudentMembersReducer, libraryStaffMembersReducer, LibraryMemberListService, BookIssueReturnService, libraryMemberListsReducer, LibraryMemberListEffects, bookIssueReturnsReducer, BookIssueReturnEffects } from 'src/app/core/library';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LibraryMemberListComponent } from './book-issue-return/library-member-list/library-member-list.component';
import { BookIssueReturnDialogComponent } from './book-issue-return/book-issue-return/book-issue-return.dialog.component';
const routes: Routes = [
  {
    path: '',
    component: LibraryComponent,
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
      },
      {
        path: 'book-list',
        component: BookListComponent
      },
      {
        path: 'library-student-member',
        component: LibraryStudentMemberComponent
      },
      {
        path: 'library-staff-member',
        component: LibraryStaffMemberComponent
      },
      {
        path: 'library-member-list',
        component: LibraryMemberListComponent
      },
    ]
  }
]

@NgModule({
  declarations: [
    LibraryComponent,
    BookEditDialogComponent,
    BookListComponent,
    LibraryStudentMemberEditDialogComponent,
    LibraryStudentMemberComponent,
    LibraryStaffMemberEditDialogComponent,
    LibraryStaffMemberComponent,
    LibraryMemberListComponent,
    BookIssueReturnDialogComponent
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
    // PerfectScrollbarModule,
    MaterialModule,
    TranslateModule.forChild(),
    NgxPermissionsModule.forChild(),
    // CKEditorModule


    //state manage
    StoreModule.forFeature('books', booksReducer),
    EffectsModule.forFeature([BookEffects]),
    StoreModule.forFeature('libraryStaffMembers', libraryStaffMembersReducer),
    EffectsModule.forFeature([LibraryStaffMemberEffects]),
    StoreModule.forFeature('libraryStudentMembers', libraryStudentMembersReducer),
    EffectsModule.forFeature([LibraryStudentMemberEffects]),
    StoreModule.forFeature('libraryMemberLists', libraryMemberListsReducer),
    EffectsModule.forFeature([LibraryMemberListEffects]),
    StoreModule.forFeature('bookIssueReturns', bookIssueReturnsReducer),
    EffectsModule.forFeature([BookIssueReturnEffects]),
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
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
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

    BookService,
    LibraryStaffMemberService,
    LibraryStudentMemberService,
    LibraryMemberListService,
    BookIssueReturnService,

  ],

  entryComponents: [
    BookEditDialogComponent,
    LibraryStudentMemberEditDialogComponent,
    LibraryStaffMemberEditDialogComponent,
    BookIssueReturnDialogComponent
  ],
  exports: [RouterModule],

})

export class LibraryModule { }
