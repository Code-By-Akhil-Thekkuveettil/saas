import { Component, OnInit } from '@angular/core';
import { AddDetailsGaComponent } from 'src/app/google-analytics/add-details-ga/add-details-ga.component';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  isGaEnabled: boolean = false;
  isEmailEnabled: boolean = false;
  isSMSEnabled: boolean = false;
  GaID: any;
  SmsID: any;
  EmailID: any;
  smsForm: FormGroup;
  emailForm: FormGroup;
  account_org: any;
  account_email: any;
  expNavbar: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    public fb: FormBuilder,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    this.account_org = this.cookieService.get('organization_name');
    this.account_email = this.cookieService.get('email');
    this.smsForm = this.fb.group({
      twilio_account_sid: new FormControl('', [Validators.required]),
      twilio_auth_token: new FormControl('', [Validators.required]),
      twilio_from_mob_number: new FormControl('', [Validators.required])
    });
    this.emailForm = this.fb.group({
      from_name: new FormControl(this.account_org, [Validators.required]),
      from_email: new FormControl(this.account_email, [Validators.required]),
      sendgrid_api_key: new FormControl('', [Validators.required])
    });
    this.getPluginDetails();
  }
  expand(show) {
    this.expNavbar = show;
  }
  ngOnInit(): void {

  }

  getPluginDetails() {
    this.dashboardService.getPluginsView()
      .subscribe({
        next: (res: any) => {
          res.data.forEach(x => {
            if (x.plugin_name == "google analytics") {
              if (x.plugin_connection_data != null && x.plugin_connection_data != undefined && x.plugin_connection_data != "") {
                if (x.plugin_connection_data.is_connect == 1) {
                  this.isGaEnabled = true;
                  this.GaID = x.id;
                } else {
                  this.isGaEnabled = false;
                }
              }
            } else if (x.plugin_name == "sms-plugin") {
              if (x.plugin_connection_data != null && x.plugin_connection_data != undefined && x.plugin_connection_data != "") {
                if (x.plugin_connection_data.is_connect == 1) {
                  this.isSMSEnabled = true;
                  this.SmsID = x.id;
                  this.smsForm.patchValue({
                    twilio_account_sid: x.plugin_connection_data.twilio_account_sid,
                    twilio_auth_token: x.plugin_connection_data.twilio_auth_token,
                    twilio_from_mob_number: x.plugin_connection_data.twilio_from_mob_number
                  });
                } else {
                  this.isSMSEnabled = false;
                }
              }
            } else if (x.plugin_name == "email-plugin") {
              if (x.plugin_connection_data != null && x.plugin_connection_data != undefined && x.plugin_connection_data != "") {
                if (x.plugin_connection_data.is_connect == 1) {
                  this.isEmailEnabled = true;
                  this.EmailID = x.id;
                  this.emailForm.patchValue({
                    from_email: x.plugin_connection_data.from_email,
                    from_name: x.plugin_connection_data.from_name,
                    sendgrid_api_key: x.plugin_connection_data.sendgrid_api_key
                  });
                } else {
                  this.isEmailEnabled = false;
                }
              }
            }
          });
        },
        error: error => {
        }
      });
  }

  addSMS() {
    let data = {
      user: this.cookieService.get('user_id'),
      organization: this.cookieService.get('organization_id'),
      plugin: this.SmsID,
      twilio_account_sid: this.smsForm.controls['twilio_account_sid'].value,
      twilio_auth_token: this.smsForm.controls['twilio_auth_token'].value,
      twilio_from_mob_number: this.smsForm.controls['twilio_from_mob_number'].value,
    };
    this.dashboardService.pluginUpdate(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.getPluginDetails();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  addEmail() {
    let data = {
      user: this.cookieService.get('user_id'),
      organization: this.cookieService.get('organization_id'),
      plugin: this.EmailID,
      sendgrid_api_key: this.emailForm.controls['sendgrid_api_key'].value,
      from_email: this.emailForm.controls['from_email'].value,
      from_name: this.emailForm.controls['from_name'].value
    };
    this.dashboardService.pluginUpdate(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.getPluginDetails();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
}
