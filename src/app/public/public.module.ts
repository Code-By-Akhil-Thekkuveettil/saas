import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public/public.component';
import { SubmitFormComponent } from './submit-form/submit-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PublicComponent,
    SubmitFormComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule
  ]
})
export class PublicModule { }
