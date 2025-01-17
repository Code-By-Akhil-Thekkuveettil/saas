import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadSampleFileComponent } from '../upload-sample-file/upload-sample-file.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-add-new-members',
  templateUrl: './add-new-members.component.html',
  styleUrls: ['./add-new-members.component.css']
})
export class AddNewMembersComponent implements OnInit {
  panelTitle: any;
  isEdit: boolean = false;
  panelId: any;
  membersList: any[] = [];
  newFirstName: string = "";
  newLastName: string = "";
  newEmail: string = "";
  newDepartment: string = "";
  newJobType: string = "";
  memberCount: number = 0;
  isNewMember: boolean = true;
  inValidForm: boolean = true;
  emailValid: boolean = true;
  firstNameReq: boolean = true;
  lastNameReq: boolean = true;
  loading: boolean = false;
  emailReq: boolean = true;
  uploadFile: MatDialogRef<UploadSampleFileComponent> | undefined;
  newPhone: any;
  phoneValid: boolean = true;
  countryList: any;
  newPhoneCode: any;
  searchText;
  department: any[] = [];
  jobType: any[] = [];
  newNpiNumber: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    public authService: AuthenticationService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
  ) {
    const currentState = this.router.getCurrentNavigation();
    if (currentState) {
      let state = currentState.extras.state;
      this.panelTitle = state ? state['panelTitle'] : '';
      this.isEdit = state ? state['isEdit'] : '';
    }
    this.panelId = this.route.snapshot.paramMap.get('id');
    if (this.isEdit) {
      this.isNewMember = false;
    }
  }

  ngOnInit(): void {
    this.getCountryList();
    this.getDepartmentList();
    this.getJobTypeList();

    // this.countryList = [{
    //   code: "+1",
    //   name: "US"
    // },
    // {
    //   code: "+91",
    //   name: "India"
    // }];
  }

  getCountryList() {
    this.authService.getCountryList().subscribe((result) => {
      this.countryList = result.data;
      this.getPanelDetails();
      this.getMembers();
    },
      err => {
        if (err.error.code !== 401) {
          this.toastr.error('', err.error?.message, {
            timeOut: 3000
          });
        }
      });
  }

  getDepartmentList() {
    this.dashboardService.panelDepartmentList().subscribe({
      next: (res: any) => {
        this.department = res.data;
      },
      error: error => {
        this.toastr.error(error?.error?.message);
      }
    });
  }

  getJobTypeList() {
    this.dashboardService.panelJobTypeList().subscribe({
      next: (res: any) => {
        this.jobType = res.data;
      },
      error: error => {
        this.toastr.error(error?.error?.message);
      }
    });
  }

  deleteMember(item: any) {
    let data = {
      panel: this.panelId,
      is_active: 0
    };
    this.dashboardService.updatePanelMember(data, item.id)
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
    this.inValidForm = true;
    this.emailValid = true;
    this.newDepartment = "";
    this.newJobType = "";
    this.newPhone = "";
    this.newPhoneCode = "";
    this.newNpiNumber = "";
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
      if (this.newPhone == undefined) {
        this.newPhone = "";
      }
      this.newPhone = this.newPhone.toString().trim();
      if (this.newEmail != "" && this.newEmail != undefined && this.newFirstName != "" && this.newFirstName != undefined && this.newLastName != "" && this.newLastName != undefined) {
        if (!this.checkEmailValid(this.newEmail)) {
          this.emailValid = false;
        } else {
          if ((this.newPhone.length != 10 && this.newPhone.length > 0) || ((this.newPhoneCode == undefined || this.newPhoneCode == "") && this.newPhone.length > 0) || (this.newPhone.length == 0 && (this.newPhoneCode != undefined && this.newPhoneCode != ""))) {
            this.phoneValid = false;
          } else {

            let depID = this.department.filter((y: any) => { return y.name == this.newDepartment });
            let jobTypeID = this.jobType.filter((y: any) => { return y.name == this.newJobType });
            let data = {
              panel: this.panelId,
              first_name: this.newFirstName,
              last_name: this.newLastName,
              email: this.newEmail,
              contact_number: this.newPhone,
              country_code: this.newPhoneCode,
              department: depID[0]?.id,
              job_type: jobTypeID[0]?.id,
              npi_number: this.newNpiNumber
            };
            this.dashboardService.saveNewPanelMember(data)
              .subscribe({
                next: (res: any) => {
                  // this.getMembers();
                  this.newEmail = "";
                  this.newFirstName = "";
                  this.newLastName = "";
                  this.newPhone = "";
                  this.inValidForm = true;
                  this.router.navigate(['/panel-distribution/']);
                },
                error: error => {
                  this.toastr.error(error?.error?.message);
                }
              });
          }
        }
      } else if ((this.newEmail == "" || this.newEmail == undefined) && (this.newFirstName == "" || this.newFirstName == undefined) && (this.newLastName == "" || this.newLastName == undefined) && (this.newPhone == "" || this.newPhone == undefined)) {
        this.router.navigate(['/panel-distribution/']);
      } else if (this.isNewMember == true && ((this.newEmail != "" && this.newEmail != undefined) || (this.newFirstName != "" && this.newFirstName != undefined) || (this.newLastName != "" && this.newLastName != undefined))) {
        this.inValidForm = false;
      }
    }

  }

  update(member: any) {
    console.log(member.contact_number + "ss");
    if (member.first_name == "") {
      member.firstNameReq = false;
    } else if (member.last_name == "") {
      member.lastNameReq = false;
    } else if (!this.checkEmailValid(member.email)) {
      member.emailReq = false;
    } else if ((member.contact_number.toString().length != 10 && (member.contact_number != undefined && member.contact_number != "")) || (member.contact_number > 0 && (member.mobile_code == undefined || member.mobile_code == "")) || (member.mobile_code != undefined && member.mobile_code != "" && member.contact_number.toString().length == 0)) {
      member.phoneReq = false;
    } else {
      member.firstNameReq = true;
      member.lastNameReq = true;
      member.emailReq = true;
      member.phoneReq = false;
      let jobTypeID = this.jobType.filter((y: any) => { return y.name == member.job_type_name });
      let depID = this.department.filter((y: any) => { return y.name == member.department_name });
      let data = {
        panel: member.panel,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
        contact_number: member.contact_number,
        mobile_code: member.mobile_code,
        department: depID[0].id,
        job_type: jobTypeID[0].id,
        npi_number: member.npi_number
      };
      this.dashboardService.updatePanelMember(data, member.id)
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

  addNewMember() {

    this.newEmail = this.newEmail.trim();
    this.newFirstName = this.newFirstName.trim();
    this.newLastName = this.newLastName.trim();
    if (this.newPhone == undefined) {
      this.newPhone = "";
    }
    this.newPhone = this.newPhone.toString().trim();
    if (this.newEmail != "" && this.newEmail != undefined && this.newFirstName != "" && this.newFirstName != undefined && this.newLastName != "" && this.newLastName != undefined) {
      if (!this.checkEmailValid(this.newEmail)) {
        this.emailValid = false;
      } else {
        if ((this.newPhone.length != 10 && this.newPhone.length > 0) || ((this.newPhoneCode == undefined || this.newPhoneCode == "") && this.newPhone.length > 0) || (this.newPhone.length == 0 && (this.newPhoneCode != undefined && this.newPhoneCode != ""))) {
          this.phoneValid = false;
        } else {
          this.phoneValid = true;
          let jobTypeID = this.jobType.filter((y: any) => { return y.name == this.newJobType });
          let depID = this.department.filter((y: any) => { return y.name == this.newDepartment });
          let data = {
            panel: this.panelId,
            first_name: this.newFirstName,
            last_name: this.newLastName,
            email: this.newEmail,
            contact_number: this.newPhone,
            country_code: this.newPhoneCode,
            department: depID[0].id,
            job_type: jobTypeID[0].id,
            npi_number: this.newNpiNumber
          };
          this.dashboardService.saveNewPanelMember(data)
            .subscribe({
              next: (res: any) => {
                this.dashboardService.getPanelMemberList(this.panelId)
                  .subscribe({
                    next: (res: any) => {
                      this.membersList = res.data;
                      this.memberCount = this.membersList.length;
                      this.isNewMember = false;
                    },
                    error: error => {
                      this.toastr.error(error?.error?.message);
                    }
                  });
                this.newEmail = "";
                this.newFirstName = "";
                this.newLastName = "";
                this.newPhone = "";
                this.newPhoneCode = "";
                this.newDepartment = "";
                this.newJobType = "";
                this.newNpiNumber = "";
                this.inValidForm = true;
                this.isNewMember = false;

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
    this.dashboardService.getPanelMemberList(this.panelId)
      .subscribe({
        next: (res: any) => {
          this.membersList = res.data;
          this.loading = false;
          this.memberCount = this.membersList.length;
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

  uploadCSVPanel() {
    this.uploadFile = this.matDialog.open(UploadSampleFileComponent, {
      disableClose: true,
      height: '500px',
      width: '600px',
      data: {
        id: this.panelId
      }
    });

    this.uploadFile.afterClosed().subscribe(res => {
      if ((res == true)) {
        this.getMembers();
      }
    });
  }
}
