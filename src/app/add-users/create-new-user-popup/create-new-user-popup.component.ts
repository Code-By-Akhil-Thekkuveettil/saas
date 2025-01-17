import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-create-new-user-popup',
  templateUrl: './create-new-user-popup.component.html',
  styleUrls: ['./create-new-user-popup.component.css']
})
export class CreateNewUserPopupComponent implements OnInit {
  phone: any;
  panelId: any;
  newFirstName: string = "";
  newLastName: string = "";
  newEmail: string = "";
  inValidForm: boolean = false;
  emailValid: boolean = true;
  newPhone: any;
  phoneValid: boolean = true;
  countryList: any = [];
  newPhoneCode: any;

  constructor(private dashboardService: DashboardService,
    public authService: AuthenticationService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<CreateNewUserPopupComponent>) { }

  ngOnInit(): void {
    this.getCountryList();
  }
  getCountryList() {
    this.authService.getCountryList().subscribe((result) => {
      this.countryList = result.data;
    },
      err => {
        if (err.error.code !== 401) {
          this.toastr.error('', err.error?.message, {
            timeOut: 3000
          });
        }
      });
  }

  closeDialog() {
    this._mdr.close();
  }
  save() {
    if ((this.newEmail != "" && this.newEmail != undefined) &&
      (this.newFirstName != "" && this.newFirstName != undefined) &&
      (this.newLastName != "" && this.newLastName != undefined)) {
      this.inValidForm = false;
      this.newEmail = this.newEmail.trim();
      this.newFirstName = this.newFirstName.trim();
      this.newLastName = this.newLastName.trim();
      this.newPhone = this.newPhone;
      if (this.newPhone == undefined) {
        this.newPhone = "";
      }
      this.newPhone = this.newPhone.toString().trim();
      this.checkEmailValid(this.newEmail);
      if (this.newEmail != "" && this.newEmail != undefined &&
        this.newFirstName != "" && this.newFirstName != undefined &&
        this.newLastName != "" && this.newLastName != undefined && this.emailValid) {
        if ((this.newPhone.length != 10 || (this.newPhoneCode == undefined || this.newPhoneCode == ""))) {
          this.phoneValid = false;
        } else {
          this.phoneValid = true;
          let data = {
            organization: this.cookieService.get('organization_id'),
            first_name: this.newFirstName,
            last_name: this.newLastName,
            email: this.newEmail,
            contact_number: this.newPhone,
            country_code: this.newPhoneCode
          };
          this.dashboardService.organizationUserCreate(data)
            .subscribe({
              next: (res: any) => {
                this.toastr.success(res?.message)
                this._mdr.close(true);
              },
              error: error => {
                this.toastr.error(error?.error?.message);
              }
            });
        }
      } else {
        this.inValidForm = true;
      }
    } else {
      this.inValidForm = true;
    }
  }
  checkEmailValid(email: any) {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email?.match(mailformat)) {
      this.emailValid = true;
    } else {
      this.emailValid = false;
    }
  }
}
