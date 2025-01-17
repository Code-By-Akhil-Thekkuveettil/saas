import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgModel } from '@angular/forms';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-new-panel',
  templateUrl: './add-new-panel.component.html',
  styleUrls: ['./add-new-panel.component.css']
})
export class AddNewPanelComponent implements OnInit {

  panelName: any;
  description: any;

  constructor( 
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService,
    private matDialog: MatDialog,
    private _mdr: MatDialogRef<AddNewPanelComponent>
    ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this._mdr.close()
  }

  save(panel: NgModel){
    if ((panel.valid && panel.touched)) {
      let data = {
        user: this.cookieService.get('user_id'),
        organization: this.cookieService.get('organization_id'),
        title: this.panelName,
        description: this.description
      }
      this.dashboardService.newPanelDistribution(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success("Panel Succesfully added.");
          this.closeDialog();
          this.router.navigate(['panel-distribution/members', res.data.id], {state:{isEdit : false, panelTitle : this.panelName}});
        },
        error: error => {
         
          let err = '';
          if(!error.code){
            if(error && error.errors)
              err = error.errors;
            let errMsg: string = err ? err : 'Please try again later';
            // this.messageService.error(errMsg, "Error");
            this.toastr.error(error?.error?.message);
          }
        }
      });
    }
  }

}
