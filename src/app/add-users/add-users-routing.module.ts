import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './add-users.component';
import { AuthGuard } from '../auth/auth.guard';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';

const routes: Routes = [{ 
  path: '', component: AddUsersComponent,
  children: [
    {path: '', redirectTo: 'new-users',pathMatch: 'full'},
    {path: '', component: AddNewUserComponent, canActivate: [AuthGuard]},
    {path: '**', redirectTo: 'dashboard',pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddUsersRoutingModule { }
