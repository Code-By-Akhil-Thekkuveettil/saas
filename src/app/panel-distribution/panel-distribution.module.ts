import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { PanelDistributionRoutingModule } from './panel-distribution-routing.module';
import { PanelDistributionComponent } from './panel-distribution.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PanelListComponent } from './panel-list/panel-list.component';
import { AddNewPanelComponent } from './add-new-panel/add-new-panel.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'
import { AddNewMembersComponent } from './add-new-members/add-new-members.component';
import { UploadSampleFileComponent } from './upload-sample-file/upload-sample-file.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    PanelDistributionComponent,
    PanelListComponent,
    AddNewPanelComponent,
    AddNewMembersComponent,
    UploadSampleFileComponent
  ],
  imports: [
    CommonModule,
    PanelDistributionRoutingModule,
    SharedModule,
    NgxPaginationModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTableModule,
    FormsModule,
    Ng2SearchPipeModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ]
})
export class PanelDistributionModule { }
