import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/auth/auth.module').then(x => x.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../app/dashboard/dashboard.module').then(x => x.DashboardModule),
  },
  { path: 'public', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  { path: 'survey', loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule) },
  { path: 'general', loadChildren: () => import('./anonymous-link/anonymous-link.module').then(m => m.AnonymousLinkModule) },
  { path: 'plugins', loadChildren: () => import('./plugins/plugins.module').then(m => m.PluginsModule) },
  { path: 'panel-distribution', loadChildren: () => import('./panel-distribution/panel-distribution.module').then(m => m.PanelDistributionModule) },
  { path: 'subscriptions', loadChildren: () => import('./subscriptions/subscriptions.module').then(m => m.SubscriptionsModule) },
  { path: 'new-users', loadChildren: () => import('./add-users/add-users.module').then(m => m.AddUsersModule) },
  { path: 'my-account', loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule) },
  { 
    path: '**',
    redirectTo: '', 
    pathMatch: 'full' 
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
