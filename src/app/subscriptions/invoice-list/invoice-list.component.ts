import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { NewSubscribeComponent } from '../new-subscribe/new-subscribe.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  subscription: any;
  subscriptionId: any;

  constructor(
    public spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    private subs: SubscriptionsService, 
    private toastr: ToastrService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private _mdr: MatDialogRef<NewSubscribeComponent>
  ) {
    this.subscriptionId = this.route.snapshot.paramMap.get('id');

   }
  ngOnInit(): void {
    this.showInvoices()
  }
  showInvoices(){
    this.spinner.show()
    this.subs.getInvoiceList(this.cookieService.get('user_id'),this.subscriptionId)
    .subscribe({
      next: (resp: any) => {
        // window.open(resp.data[0].hosted_invoice_url,"_blank")
        this.subscription=resp.data
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
  back(){
    this.router.navigate(['subscriptions']);

  }
}
