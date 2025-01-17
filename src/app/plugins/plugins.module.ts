import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PluginsRoutingModule } from './plugins-routing.module';
import { AddPluginsComponent } from './add-plugins/add-plugins.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PluginPopupComponent } from './add-plugins/plugin-popup/plugin-popup.component';
import { GoogleAnalyticsModule } from "../google-analytics/google-analytics.module";

@NgModule({
  declarations: [
    AddPluginsComponent,
    PluginPopupComponent
  ],
  imports: [
    CommonModule,
    PluginsRoutingModule,
    SharedModule,
    Ng2SearchPipeModule,
    GoogleAnalyticsModule
]
})
export class PluginsModule { }
