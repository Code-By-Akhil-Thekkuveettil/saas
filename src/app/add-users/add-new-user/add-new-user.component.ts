import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { CreateNewUserPopupComponent } from '../create-new-user-popup/create-new-user-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css']
})
export class AddNewUserComponent implements OnInit {

  panelTitle: any;
  phone: any;
  isEdit: boolean = false;
  loading: boolean = false;
  panelId: any;
  membersList: any[] = [];
  newFirstName: string = "";
  newLastName: string = "";
  newEmail: string = "";
  memberCount: number = 0;
  isNewMember: boolean = true;
  inValidForm: boolean = true;
  emailValid: boolean = true;
  firstNameReq: boolean = true;
  lastNameReq: boolean = true;
  emailReq: boolean = true;
  newPhone: any;
  phoneValid: boolean = true;
  countryList: any = [];
  newPhoneCode: any;
  searchText;
  status: any;
  createUserPopup: MatDialogRef<CreateNewUserPopupComponent> | undefined;
  constructor(
    private dashboardService: DashboardService,
    public authService: AuthenticationService,
    private cookieService: CookieService,
    private matDialog: MatDialog,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    // this.getPanelDetails();
    this.getCountryList();
    this.status = [{
      sts: "Active",
      value: true
    },
    {
      sts: "Disable",
      value: false
    }]

  }

  getCountryList() {
    this.authService.getCountryList().subscribe((result) => {
      this.countryList = result.data;
      this.getMembers();
    },
      err => {
        if (err.error.code !== 401) {
          this.toastr.error('', err.error.error, {
            timeOut: 3000
          });
        }
      });
  }

  deleteMember(item: any) {
    let data = {
      user: item.id,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      contact_number: item.contact_number,
      country_code: item.mobile_code,
      is_active: 0
    };
    this.dashboardService.organizationUserUpdate(data)
      .subscribe({
        next: (res: any) => {
          this.getMembers();
          this.toastr.success(res?.message)
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  deleteNewMember() {
    this.newEmail = "";
    this.newFirstName = "";
    this.newLastName = "";
    this.newPhone = "";
    this.newPhoneCode = "";
    this.inValidForm = true;
    this.emailValid = true;
  }

  save() {
    let checkRequired = true;
    this.membersList.forEach(x => {
      if (x.firstNameReq == false || x.lastNameReq == false || x.emailReq == false || x.phoneReq == false) {
        checkRequired = false;
      }
    });
    if (checkRequired) {
      this.newEmail = this.newEmail.trim();
      this.newFirstName = this.newFirstName.trim();
      this.newLastName = this.newLastName.trim();
      this.newPhone = this.newPhone;
      if (this.newPhone == undefined) {
        this.newPhone = "";
      }
      this.newPhone = this.newPhone.toString().trim();
      if (this.newEmail != "" && this.newEmail != undefined && this.newFirstName != "" && this.newFirstName != undefined && this.newLastName != "" && this.newLastName != undefined) {
        if (!this.checkEmailValid(this.newEmail)) {
          this.emailValid = false;
        } else {
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
                  this.getMembers();
                  this.newEmail = "";
                  this.newFirstName = "";
                  this.newLastName = "";
                  this.newPhone = "";
                  this.newPhoneCode = "";
                  this.inValidForm = true;
                  // this.router.navigate(['/panel-distribution/']);
                },
                error: error => {
                  this.toastr.error(error?.error?.message);
                }
              });
          }
        }
      } else if ((this.newEmail == "" || this.newEmail == undefined) && (this.newFirstName == "" || this.newFirstName == undefined) && (this.newLastName == "" || this.newLastName == undefined) && (this.newPhone == "" || this.newPhone == undefined)) {
        // this.router.navigate(['/panel-distribution/']);
      } else if (this.isNewMember == true && ((this.newEmail != "" && this.newEmail != undefined) || (this.newFirstName != "" && this.newFirstName != undefined) || (this.newLastName != "" && this.newLastName != undefined))) {
        this.inValidForm = false;
      }
    }

  }

  update(member: any) {
    if (member.first_name == "") {
      member.firstNameReq = false;
    } else if (member.last_name == "") {
      member.lastNameReq = false;
    } else if (!this.checkEmailValid(member.email)) {
      member.emailReq = false;
    } else if (member.contact_number.toString().length != 10 && (member.country_code == undefined || member.country_code == "")) {
      member.phoneReq = false;
    } else {
      member.firstNameReq = true;
      member.lastNameReq = true;
      member.emailReq = true;
      member.phoneReq = true;
      let data = {
        user: member.id,
        // organization: this.cookieService.get('organization_id'),
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        contact_number: member.contact_number,
        country_code: member.country_code,
        is_active: member.is_active ? 1 : 0
      };
      this.dashboardService.organizationUserUpdate(data)
        .subscribe({
          next: (res: any) => {
            // this.getMembers();
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }

  }

  createUser() {
    this.createUserPopup = this.matDialog.open(CreateNewUserPopupComponent, {
      disableClose: true,
      height: 'auto',
      width: '700px',
    });
    this.createUserPopup.afterClosed().subscribe(res => {
      if (res) this.getMembers();
    });
  }
  addNewMember() {
    this.newEmail = this.newEmail.trim();
    this.newFirstName = this.newFirstName.trim();
    this.newLastName = this.newLastName.trim();
    this.newPhone = this.newPhone;
    if (this.newPhone == undefined) {
      this.newPhone = "";
    }
    this.newPhone = this.newPhone.toString().trim();
    if (this.newEmail != "" && this.newEmail != undefined && this.newFirstName != "" && this.newFirstName != undefined && this.newLastName != "" && this.newLastName != undefined) {
      if (!this.checkEmailValid(this.newEmail)) {
        this.emailValid = false;
      } else {
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
                // this.dashboardService.getPanelMemberList(this.panelId)
                //   .subscribe({
                //     next: (res: any) => {
                //       this.membersList = res.data;
                //       this.memberCount = this.membersList.length;
                //       this.isNewMember = true;
                //     },
                //     error: error => {
                //       this.toastr.error(error, "Unable to get panel list")
                //     }
                //   });
                this.getMembers();
                this.newEmail = "";
                this.newFirstName = "";
                this.newLastName = "";
                this.newPhone = "";
                this.newPhoneCode = "";
                this.inValidForm = true;

              },
              error: error => {
                this.toastr.error(error?.error?.message);
              }
            });
        }
      }
    } else if (!this.isNewMember) {
      this.isNewMember = true;
    } else if (this.isNewMember == true && ((this.newEmail != "" && this.newEmail != undefined) || (this.newFirstName != "" && this.newFirstName != undefined) || (this.newLastName != "" && this.newLastName != undefined))) {
      this.inValidForm = false;
    }
  }

  getMembers() {
    this.loading = true;
    this.dashboardService.organizationUserList()
      .subscribe({
        next: (res: any) => {
          this.membersList = res.data;
          this.loading = false;
          this.memberCount = this.membersList.length;
          this.membersList.forEach(x => {
            this.countryList.forEach(y => {
              if (x.country_code_data == y.code) {
                x.country_code = y.id;
              }
            });
          });
          if (this.memberCount == 0) {
            this.isNewMember = true;
          } else {
            this.isNewMember = false;
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  getPanelDetails() {
    this.dashboardService.getPanelDetails(this.panelId)
      .subscribe({
        next: (res: any) => {
          this.panelTitle = res.data[0].title;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  checkEmailValid(email: any) {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }



}
