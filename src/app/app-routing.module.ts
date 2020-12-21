// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
  {path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)},
  {path: 'error', loadChildren: () => import('./views/pages/error/error.module').then(m => m.ErrorModule)},
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'mail',
        loadChildren: () => import('./views/pages/apps/mail/mail.module').then(m => m.MailModule),
      },
      {
        path: 'ecommerce',
        loadChildren: () => import('./views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
      },
      // {
      //   path: 'ngbootstrap',
      //   loadChildren: () => import('./views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule),
      // },
      // {
      //   path: 'material',
      //   loadChildren: () => import('./views/pages/material/material.module').then(m => m.MaterialModule),
      // },
       {
          path: 'front-office',
          loadChildren: () => import('./views/pages/front-office/front-office.module').then(m => m.FrontOfficeModule),
        },

        {
          path: 'student-information',
          loadChildren: () => import('./views/pages/student-information/student-information.module').then(m => m.StudentInformationModule),
        },
        {
          path: 'academics',
          loadChildren: () => import('./views/pages/academics/academics.module').then(m => m.AcademicsModule),
        },
        {
          path: 'attendance',
          loadChildren: () => import('./views/pages/attendance/attendance.module').then(m => m.AttendanceModule),
        },
        {
          path: 'homework',
          loadChildren: () => import('./views/pages/homework/homework.module').then(m => m.HomeworkModule),
        },
        {
          path: 'library',
          loadChildren: () => import('./views/pages/library/library.module').then(m => m.LibraryModule),
        },
        {
          path: 'human-resource',
          loadChildren: () => import('./views/pages/human-resource/human-resource.module').then(m => m.HumanResourceModule),
        },
        {
          path: 'fees-collection',
          loadChildren: () => import('./views/pages/fees-collection/fees-collection.module').then(m => m.FeesCollectionModule),
        },
        {
          path: 'income',
          loadChildren: () => import('./views/pages/income/income.module').then(m => m.IncomeModule),
        },
        {
          path: 'expense',
          loadChildren: () => import('./views/pages/expense/expense.module').then(m => m.ExpenseModule),
        },

        {
          path: 'transport',
          loadChildren: () => import('./views/pages/transport/transport.module').then(m => m.TransportModule),
        },

        {
          path: 'hostel',
          loadChildren: () => import('./views/pages/hostel/hostel.module').then(m => m.HostelModule),
        },

        {
          path: 'inventory',
          loadChildren: () => import('./views/pages/inventory/inventory.module').then(m => m.InventoryModule),
        },
        {
          path: 'examination',
          loadChildren: () => import('./views/pages/examination/examination.module').then(m => m.ExaminationModule),
        },
        {
          path: 'certificate',
          loadChildren: () => import('./views/pages/certificate/certificate.module').then(m => m.CertificateModule),
        },
        {
          path: 'communication',
          loadChildren: () => import('./views/pages/communication/communication.module').then(m => m.CommunicationModule),
        },
        {
          path: 'report',
          loadChildren: () => import('./views/pages/report/report.module').then(m => m.ReportModule),
        },
        {
          path: 'system-setting',
          loadChildren: () => import('./views/pages/system-settings/system-settings.module').then(m => m.SystemSettingsModule),
        },
      {
        path: 'user-management',
        loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule),
      },
      {
        path: 'wizard',
        loadChildren: () => import('./views/pages/wizard/wizard.module').then(m => m.WizardModule),
      },
      {
        path: 'builder',
        loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule),
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
      
    ],
  },
  {path: '**', redirectTo: 'error/403', pathMatch: 'full'},

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
