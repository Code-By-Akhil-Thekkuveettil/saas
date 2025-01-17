import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoogleAnalyticsModule } from 'src/app/google-analytics/google-analytics.module';
import { SurveyModule } from '../survey/survey.module';

@NgModule({
  declarations: [
    AccountDetailsComponent,
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    SharedModule,
    GoogleAnalyticsModule,
    SurveyModule
  ],
})
export class MyAccountModule { }
