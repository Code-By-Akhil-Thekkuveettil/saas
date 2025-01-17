import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';


@Component({
  selector: 'app-plugin-popup',
  templateUrl: './plugin-popup.component.html',
  styleUrls: ['./plugin-popup.component.css']
})
export class PluginPopupComponent implements OnInit {
  smsForm!: FormGroup;
  emailForm!: FormGroup;
  account_org: any;
  account_email: any;
  constructor(private dashboardService: DashboardService,
    public fb: FormBuilder,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private _mdr: MatDialogRef<PluginPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getPluginDetails();
  }

  ngOnInit(): void {
    this.account_org = this.cookieService.get('organization_name');
    this.account_email = this.cookieService.get('email');
    this.smsForm = this.fb.group({
      twilio_account_sid: new FormControl('', [Validators.required]),
      twilio_auth_token: new FormControl('', [Validators.required]),
      twilio_from_mob_number: new FormControl('', [Validators.required])
    });
    this.emailForm = this.fb.group({
      from_email: new FormControl(this.account_email, [Validators.required]),
      from_name: new FormControl(this.account_org, [Validators.required]),
      sendgrid_api_key: new FormControl('', [Validators.required])
    });
  }
  closeDialog() {
    this._mdr.close();
  }
  getPluginDetails() {
    switch (this.data.plugin_name) {
      case 'google analytics': break;
      case 'sms-plugin':
        this.dashboardService.getPluginsConnectView(this.data.id)
          .subscribe({
            next: (resp: any) => {
              this.smsForm.patchValue({
                twilio_account_sid: resp.data[0].twilio_account_sid,
                twilio_auth_token: resp.data[0].twilio_auth_token,
                twilio_from_mob_number: resp.data[0].twilio_from_mob_number
              });
            },
            error: error => {

            }
          });
        break;
      case 'email-plugin': this.dashboardService.getPluginsConnectView(this.data.id)
        .subscribe({
          next: (resp: any) => {
            this.emailForm.patchValue({
              from_email: resp.data[0].from_email,
              from_name: resp.data[0].from_name,
              sendgrid_api_key: resp.data[0].sendgrid_api_key
            });
          },
          error: error => {

          }
        });
        break;

    }
  }
  connect() {
    this.dashboardService.pluginsConnect(this.data.id)
      .subscribe({
        next: (res: any) => {
        },
        error: error => {


        }
      });
  }
  addSMS() {
    let data = {
      user: this.cookieService.get('user_id'),
      organization: this.cookieService.get('organization_id'),
      plugin: this.data.id,
      twilio_account_sid: this.smsForm.controls['twilio_account_sid'].value,
      twilio_auth_token: this.smsForm.controls['twilio_auth_token'].value,
      twilio_from_mob_number: this.smsForm.controls['twilio_from_mob_number'].value,
    };
    this.dashboardService.pluginUpdate(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.connect();
          this._mdr.close(true);
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
      plugin: this.data.id,
      sendgrid_api_key: this.emailForm.controls['sendgrid_api_key'].value,
      from_email: this.emailForm.controls['from_email'].value,
      from_name: this.emailForm.controls['from_name'].value
    };
    this.dashboardService.pluginUpdate(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.connect();
          this._mdr.close(true);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
}
