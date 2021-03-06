// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';

import {FrontOfficeModule} from './front-office/front-office.module'
import { MaterialModule} from './material/material.module';



@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    PartialsModule,
    MailModule,
    ECommerceModule,
    UserManagementModule,
    MaterialModule,
    
    FrontOfficeModule,
    
  ],
  providers: []
})
export class PagesModule {
}
