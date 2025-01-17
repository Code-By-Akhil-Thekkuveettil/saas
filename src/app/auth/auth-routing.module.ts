import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component : SigninComponent,
  },
  {
    path: 'signUp',
    component : SignupComponent,
  },
  {
    path: 'forgotPassword',
    component : ForgotPasswordComponent,
  },
  {
    path: 'resetPassword',
    component : ChangePasswordComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
