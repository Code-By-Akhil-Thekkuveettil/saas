import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelDistributionComponent } from './panel-distribution.component';
import { PanelListComponent } from './panel-list/panel-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { AddNewMembersComponent } from './add-new-members/add-new-members.component';

const routes: Routes = [{ 
    path: '', component: PanelDistributionComponent,
    children: [
      {path: '', redirectTo: 'panel-distribution',pathMatch: 'full'},
      {path: '', component: PanelListComponent, canActivate: [AuthGuard]},
      {path: 'members/:id', component: AddNewMembersComponent, canActivate: [AuthGuard]},
      {path: '**', redirectTo: 'dashboard',pathMatch: 'full'}
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelDistributionRoutingModule { }
