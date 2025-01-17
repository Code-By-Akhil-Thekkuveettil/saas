import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSubscribeComponent } from './new-subscribe/new-subscribe.component';
import { SubscriptionsModule } from './subscriptions.module';
import { SubscriptionsComponent } from './subscriptions.component';
import { AuthGuard } from '../auth/auth.guard';
import { SelectedPlanComponent } from './selected-plan/selected-plan.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

const routes: Routes = [
 { path: '', component: SubscriptionsComponent,
 children: [
  {path: '', component: NewSubscribeComponent, canActivate: [AuthGuard]},
  {path: 'my-plans', component: SelectedPlanComponent, canActivate: [AuthGuard]},
  {
    path: 'show-invoices/:id',
    component : InvoiceListComponent,
  },
  {path: '**', redirectTo: 'dashboard',pathMatch: 'full'}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }
