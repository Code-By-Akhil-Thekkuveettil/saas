import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AddUsersRoutingModule } from './add-users-routing.module';
import { AddUsersComponent } from './add-users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { CreateNewUserPopupComponent } from './create-new-user-popup/create-new-user-popup.component';


@NgModule({
  declarations: [
    AddUsersComponent,
    AddNewUserComponent,
    CreateNewUserPopupComponent
  ],
  imports: [
    CommonModule,
    AddUsersRoutingModule,
    SharedModule,
    NgxPaginationModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    Ng2SearchPipeModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ]
})
export class AddUsersModule { }
