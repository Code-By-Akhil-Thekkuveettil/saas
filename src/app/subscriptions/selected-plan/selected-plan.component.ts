import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { NewSubscribeComponent } from '../new-subscribe/new-subscribe.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selected-plan',
  templateUrl: './selected-plan.component.html',
  styleUrls: ['./selected-plan.component.css']
})
export class SelectedPlanComponent implements OnInit {

  subscription: any;

  constructor(
    public spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    private subs: SubscriptionsService, 
    private toastr: ToastrService,
    private cookieService: CookieService,
    private router: Router,
    private _mdr: MatDialogRef<NewSubscribeComponent>
  ) { }

  ngOnInit(): void { 
    this.subscriptionDetails()
  }
  subscriptionDetails() {
    // this.spinner.show();
    this.subs.getSubscriptionsDetails(this.cookieService.get('user_id'),)
    .subscribe({
      next: (resp: any) => {
        if(resp?.data?.length){          
        this.subscription = resp.data
        this.subscription.forEach(sub => {
          sub.period_start = this.dataformat(sub.period_start);
          sub.period_end = this.dataformat(sub.period_end);
        });
        }else{
          this.router.navigate(['/subscriptions']);}
        this.spinner.hide()

      },
      error: (error: any) => {
        this.spinner.hide()
        let err = '';
        if (!error.code) {
          if (error && error.errors)
            err = error.errors;
          let errMsg: string = err ? err : 'Please try again later';
          this.toastr.error(error?.error?.message);
        }
      }
    });
  }
  cancelSubscription(){
    let obj= {
      "stripe_subscription_id":this.subscription[0].stripe_subscription_id
  }
  
    this.subs.cancelSubscriptions(obj)
    .subscribe({
      next: (resp: any) => {
        this.subscriptionDetails()
        this.spinner.hide()
      },
      error: (error: any) => {
        this.spinner.hide()
        let err = '';
        if (!error.code) {
          if (error && error.errors)
            err = error.errors;
          let errMsg: string = err ? err : 'Please try again later';
          this.toastr.error(error?.error?.message);
        }
      }
    });
  }
  showInvoices(){
    this.router.navigate(['subscriptions/show-invoices', this.subscription[0].stripe_subscription_id]);
  }

  dataformat(sdate: any){
    
    const originalDateString = sdate;
    const date = new Date(originalDateString);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDateString = `${month}-${day}-${year}`;

    return formattedDateString; 
  }
}
