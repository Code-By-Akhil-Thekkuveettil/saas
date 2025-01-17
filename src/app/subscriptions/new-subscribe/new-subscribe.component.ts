import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';

@Component({
  selector: 'app-new-subscribe',
  templateUrl: './new-subscribe.component.html',
  styleUrls: ['./new-subscribe.component.css']
})
export class NewSubscribeComponent implements OnInit {

  @Output() upload = new EventEmitter();
  planList: any;

  constructor(
    public spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    private subs: SubscriptionsService,
    private router: Router,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private _mdr: MatDialogRef<NewSubscribeComponent>
  ) { }

  ngOnInit(): void {
    this.getPlanList()
    this.subscriptionDetails()
  }
  subscriptionDetails() {
    // this.spinner.show();
    this.subs.getSubscriptionsDetails(this.cookieService.get('user_id'),)
      .subscribe({
        next: (resp: any) => {
          if (resp?.data?.length) {
            this.router.navigate(['/subscriptions/my-plans']);
          }
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
  getPlanList() {
    this.spinner.show();
    this.subs.getSubscriptionsList()
      .subscribe({
        next: (resp: any) => {
          this.planList = resp.data
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
  CloseDialog() {
    this._mdr.close();
  }

  save(item) {
    let obj = {
      "user": this.cookieService.get('user_id'),
      "organization": this.cookieService.get('organization_id'),
      "product_id": item.id
    }

    this.subs.selectPlan(obj)
      .subscribe({
        next: (resp: any) => {
          // this.buy()
          window.open(resp.data, "_blank")
          this.router.navigate(['/subscriptions/my-plans'])
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
  create(item: any) {
    this.spinner.show();
    let obj = {
      "user": this.cookieService.get('user_id'),
      "organization": this.cookieService.get('organization_id'),
      "payment_method_type": "card",
      "card_number": "4242424242424242",
      "card_exp_month": 8,
      "card_exp_year": 2024,
      "card_cvc": "314"
    }

    this.subs.createCustomer(obj)
      .subscribe({
        next: (resp: any) => {
          this.save(item)
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
}
