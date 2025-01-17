import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TextEditorComponent } from 'src/app/shared/text-editor/text-editor.component';
@Component({
  selector: 'app-survey-settings',
  templateUrl: './survey-settings.component.html',
  styleUrls: ['./survey-settings.component.css']
})
export class SurveySettingsComponent implements OnInit {

  expNavbar: boolean = true;
  showNavbar: any;
  survey_name: string = "";
  isIPCheck: boolean = false;
  id: any;
  ipcheck: any;
  roomsFilter: any;
  selectedStartDate!: Date;
  selectedEndDate!: Date;
  isSurveyname: boolean = true;
  isStartDate: boolean = true;
  minDate!: Date;
  isValidEndDate: boolean = true;
  isGAAllowed: boolean = false;
  GAKey: any;
  gaAllowedno: any;
  isEmailConnected: boolean = false;
  textEditorPopup: MatDialogRef<TextEditorComponent> | undefined;
  settings_data = {
    "settings_is_active": true,
    "is_thankyou_mail": true,
    "show_survey_title": false,
    "show_question_number": false,
    "settings_identifier": null
  }
  trigger_email = {
    "trigger_email_identifier": null,
    "from_email": '',
    "from_name": "",
    "to_email": '',
    "to_name": '',
    subject: 'Thank you for taking our Screener',
    "thankyou_mail_content": 'Thank you very much for taking your valuable time to complete our screener. We value your insights and opinions very much. <b>The recruiter will be in touch with you very soon regarding setting up this interview.</b>',
    "trigger_email_is_active": true
  }

  constructor(
    private apiService: SurveyService,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private gaService: GoogleAnalyticsService,
  ) {
    let survey_id = this.route.snapshot.paramMap.get('id');
    this.id = survey_id;
  }

  ngOnInit(): void {
    this.GAKey = this.gaService.getAnalyticsKey();
    this.gaAllowedno = this.route.snapshot.paramMap.get('gaAllowed');
    const myDate = this.selectedStartDate;
    const formattedDate = this.datePipe.transform(myDate, 'MM/dd/yyyy');
    // this.selectedEndDate = formattedDate; 
    this.setSurveySettings();
    this.getSettings();
  }

  show(show) {
    this.showNavbar = show;
  }

  expand(show) {
    this.expNavbar = show;
  }
  emailConnected() {
    if (this.settings_data.is_thankyou_mail) {
      this.dashboardService.getPluginsView()
        .subscribe({
          next: (res: any) => {
            res.data.forEach(x => {
              if (x.plugin_name == "email-plugin") {
                if (x.plugin_connection_data != undefined) {
                  if (x.plugin_connection_data.is_connect == 0) {
                    this.isEmailConnected = false;
                    this.toastr.show("Connect email plugin")
                  } else {
                    this.isEmailConnected = true;
                  }
                }
              }
            });
          },
          error: (error: any) => {
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

  save() {
    let isvalidDate = true;
    let s = new Date();
    s = this.selectedStartDate;
    this.selectedStartDate = new Date(this.selectedStartDate);
    this.selectedStartDate.setHours(0, 0, 0, 0);
    if (this.selectedEndDate != null) {
      this.selectedEndDate = new Date(this.selectedEndDate);
      if (this.selectedEndDate.getTime() < this.selectedStartDate.getTime()) {
        isvalidDate = false;
      }
    }

    if (this.survey_name == "") {
      this.isSurveyname = false;
      this.setSurveySettings();
    } else if (!this.selectedStartDate) {
      this.isStartDate = false;
      this.setSurveySettings();
    } else if (isvalidDate == false) {
      this.isValidEndDate = false;
    } else {
      let data = {};
      if (this.selectedEndDate != null) {
        data = {
          end_date: this.onDate(this.selectedEndDate),
          start_date: this.onDate(s),
          title: this.survey_name,
          is_ip_check: this.ipcheck,
          google_analytics_allowed: this.isGAAllowed == true ? 1 : 0
        }
      } else {
        data = {
          end_date: null,
          start_date: this.onDate(s),
          title: this.survey_name,
          is_ip_check: this.ipcheck,
          google_analytics_allowed: this.isGAAllowed == true ? 1 : 0
        }
      }
      this.apiService.surveyUpdate(this.id, data)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res?.message)
            this.setSurveySettings();
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
    this.updateSettings();
  }

  ipchechChange() {
    console.log(this.isIPCheck);
    if (this.isIPCheck) {
      this.ipcheck = 0;
      this.isIPCheck = false;
    } else {
      this.ipcheck = 1;
      this.isIPCheck = true;
    }
  }

  // isGAallowChange(){

  //   if(this.isGAAllowed){
  //     this.ipcheck = 0;
  //     this.isGAAllowed = false;
  //   }else{
  //     this.ipcheck = 1;
  //     this.isGAAllowed = true;
  //   }
  // }

  back() {
    this.router.navigate(['/survey/questions/' + this.id]);
  }
  isIncludeQuestionNo() {

  }

  isIncludeSurveyTitle() {

  }
  onDate(dat: any) {
    let mydate = new Date(dat);

    // let formatteddate = this.datePipe.transform(mydate, 'yyyy-MM-dd');
    // var date = mydate;
    let m = mydate.getMonth();
    m = m + 1;
    let y = mydate.getFullYear();
    let d = mydate.getDate();
    return (y + "-" + m + "-" + d);
  }
  updateSettings() {
    if (this.settings_data.is_thankyou_mail) {
      if (!this.trigger_email.from_email || !this.trigger_email.from_name || !this.trigger_email.to_email || !this.trigger_email.to_name) {
        this.toastr.info("Please fill required fields")
        return;
      }
      if (!this.isEmailConnected) {
        this.toastr.info("Connect email plugin")
        return;
      }
    }
    let data = {
      "survey_identifier": this.id,
      "settings_identifier": this.settings_data.settings_identifier,
      "is_thankyou_mail": this.settings_data.is_thankyou_mail,
      "show_survey_title": this.settings_data.show_survey_title,
      "show_question_number": this.settings_data.show_question_number,
      "settings_is_active": this.settings_data.settings_is_active,
      trigger_email: [this.trigger_email]
    }

    this.apiService.updateSettings(data)
      .subscribe({
        next: (res: any) => {
          this.getSettings();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }
  connect() {
    this.router.navigate(['/plugins']);
  }
  getSettings() {
    this.apiService.viewSettings(this.id)
      .subscribe({
        next: (res: any) => {
          if (res?.data?.settings_data) {
            this.settings_data = res?.data?.settings_data;
          }
          if (res?.data?.trigger_email_data) {
            this.trigger_email = res?.data?.trigger_email_data;
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  setSurveySettings() {
    this.apiService.surveySettings(this.id)
      .subscribe({
        next: (res: any) => {
          this.survey_name = res.data.title
          this.ipcheck = res.data.is_ip_check
          if (this.ipcheck == 1) {
            this.isIPCheck = true;
          } else {
            this.isIPCheck = false;
          }
          if (res.data.google_analytics_allowed == 1) {
            this.isGAAllowed = true;
          } else {
            this.isGAAllowed = false;
          }
          this.selectedStartDate = res.data.start_date;
          this.selectedEndDate = res.data.end_date;
          if (res.data.google_analytics_allowed == 1 || this.gaAllowedno == 1) {
            this.initializeGoogleAnalytics(this.GAKey);
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  editTextEditor(data: any) {
    this.textEditorPopup = this.matDialog.open(TextEditorComponent, {
      disableClose: true,
      height: '500px',
      width: '700px',
      data: { content: data }
    });
    this.textEditorPopup.afterClosed().subscribe(res => {
      if (res) {
        this.trigger_email.thankyou_mail_content = res;
      }
    });
  }

  // Google Analytics scripts
  private initializeGoogleAnalytics(analyticsKey: string): void {

    let gaScript = document.createElement('script');
    gaScript.setAttribute('async', 'true');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.GAKey}`);

    let gaScript2 = document.createElement('script');
    gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${this.GAKey}\');`;

    document.head.appendChild(gaScript);
    document.head.appendChild(gaScript2);
  }
}
