import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPluginsComponent } from './add-plugins/add-plugins.component';

const routes: Routes = [
  {
    path: '',
    component : AddPluginsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRoutingModule { }
