import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { NewSubscribeComponent } from './new-subscribe/new-subscribe.component';
import { SubscriptionsComponent } from './subscriptions.component';
import { SharedModule } from '../shared';
import { FormsModule } from '@angular/forms';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { SelectedPlanComponent } from './selected-plan/selected-plan.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';


@NgModule({
  declarations: [
    NewSubscribeComponent,
    SubscriptionsComponent,
    SelectedPlanComponent,
    InvoiceListComponent
  ],
  imports: [
    CommonModule,
    SharedModule, 
    FormsModule,
    CommonModule,
    SubscriptionsRoutingModule
  ],
  
  providers:[DatePipe,
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } as MatCheckboxDefaultOptions}
  ]
})
export class SubscriptionsModule { }
