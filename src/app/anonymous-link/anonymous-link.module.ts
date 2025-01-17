import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AnonymousLinkRoutingModule } from './anonymous-link-routing.module';
import { SurveyLinkComponent } from './survey-link/survey-link.component';
import { AnonymousLinkComponent } from './anonymous-link.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { UtilsModule } from 'src/app/shared/utils/utils.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef } from '@angular/material/dialog';
import { PanelUnsubscribeComponent } from './panel-unsubscribe/panel-unsubscribe.component';
import { MatRadioModule , MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatCheckboxModule , MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { SignatureComponentComponent } from './signature-component/signature-component.component';

@NgModule({
  declarations: [
    SurveyLinkComponent,
    AnonymousLinkComponent,
    PanelUnsubscribeComponent,
    SignatureComponentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    ClipboardModule,
    NgxPaginationModule,
    BsDatepickerModule,
    UtilsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    AngularEditorModule,
    MatInputModule,
    MatDividerModule,
    // BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    AnonymousLinkRoutingModule
  ],
  providers: [DatePipe,
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } as MatCheckboxDefaultOptions }
  ]
})
export class AnonymousLinkModule { }
