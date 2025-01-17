import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { GoogleAnalyticsRoutingModule } from './google-analytics-routing.module';
import { AddDetailsGaComponent } from './add-details-ga/add-details-ga.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AddDetailsGaComponent
  ],
  imports: [
    CommonModule,
    GoogleAnalyticsRoutingModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddDetailsGaComponent]
})
export class GoogleAnalyticsModule { }
