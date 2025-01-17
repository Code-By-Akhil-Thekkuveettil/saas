import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyComponent } from './survey.component';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { NewSurveyQuestionsComponent } from './new-survey-questions/new-survey-questions.component';
import { ViewResponseComponent } from './view-response/view-response.component';
import { AuthGuard } from '../auth/auth.guard';
import { SurveySettingsComponent } from './survey-settings/survey-settings.component';
import { SurveyDistributionComponent } from './survey-distribution/survey-distribution.component';
import { QuotaSettingsComponent } from './quota-settings/quota-settings.component';
import { SurveyFlowComponent } from './survey-flow/survey-flow.component';

const routes: Routes = [{ 
  path: '', component: SurveyComponent,

  children: [
    {path: '', redirectTo: 'survey',pathMatch: 'full'},
    {path: 'new-survey', component: NewSurveyComponent, canActivate: [AuthGuard]},
    {path: '', component: SurveyListComponent, canActivate: [AuthGuard]},
    {path: 'questions/:id', component: NewSurveyQuestionsComponent, canActivate: [AuthGuard]},
    {path: 'responses/:id', component: ViewResponseComponent, canActivate: [AuthGuard]},
    {path: 'settings/:id', component: SurveySettingsComponent, canActivate: [AuthGuard]},
    {path: 'distribution/:id', component: SurveyDistributionComponent},
    {path: 'survey-flow/:id', component: SurveyFlowComponent},
    {path: 'quota/:id', component: QuotaSettingsComponent},
    {path: '**', redirectTo: 'dashboard',pathMatch: 'full'}
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
