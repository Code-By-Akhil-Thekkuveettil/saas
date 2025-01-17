import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyLinkComponent } from './survey-link/survey-link.component';
import { AnonymousLinkComponent } from './anonymous-link.component';
import { PanelUnsubscribeComponent } from './panel-unsubscribe/panel-unsubscribe.component';

const routes: Routes = [
  {
    path: '',
    component: AnonymousLinkComponent,
    children: [
      {path: '', redirectTo: 'general',pathMatch: 'full'},
      {path: 'testsurvey/:id', component: SurveyLinkComponent},
      {path: 'unsubscribe', component: PanelUnsubscribeComponent},

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousLinkRoutingModule { }
