import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard/dashboard.component';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-survey-distribution',
  templateUrl: './survey-distribution.component.html',
  styleUrls: ['./survey-distribution.component.css']
})
export class SurveyDistributionComponent implements OnInit {
  surveyIdentifier: any;
  token: any;
  link: any;
  baseUrl: any;
  isEmailShare: boolean = false;
  selectedItems: any[] = [];
  selectedItemsSMS: any[] = [];
  panel: any[] = [];
  sharedPanels: any[] = [];
  panelSelectReq: boolean = false;
  isSMSShare: boolean = false;
  isSMSConnected: boolean = false;
  GAKey: any;
  gaAllowedno: any;
  surveyTitle: any;

  constructor(
    private location: Location,
    private surveyService: SurveyService,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private gaService: GoogleAnalyticsService,
    configurationLoader: ConfigLoaderService,) {
    this.baseUrl = configurationLoader.apiBaseUrl().surveyLink;
  }

  ngOnInit(): void {
    this.surveyIdentifier = this.route.snapshot.paramMap.get('id');
    this.GAKey = this.gaService.getAnalyticsKey();
    this.gaAllowedno = this.route.snapshot.paramMap.get('gaAllowed');
    if (this.GAKey != undefined && this.GAKey != "") {
      this.setSurveySettings();
    }
    this.surveyLink();
    this.alreadySharedPanels();
    this.panelList();
    this.smsConnected();
  }

  back() {
    this.location.back();
  }

  surveyLink() {
    this.surveyService.getSurveyUrlToken(this.surveyIdentifier)
      .subscribe({
        next: (resp: any) => {
          this.token = resp?.data?.token;
          // let token = this.token;
          // console.log('token'+this.token);
          // this.router.navigate(['/survey/surveylink', token], { target: '_blank' });
          if (this.token)
            this.link = this.baseUrl + 'general/anonymouslink/' + this.token;
          else {
            this.toastr.error(resp.data?.message);
          }
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

  panelList() {
    this.dashboardService.getPanelList()
      .subscribe({
        next: (res: any) => {
          this.panel = res.data;

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

  emailShare() {
    this.isEmailShare = true;
    this.isSMSShare = false;
    this.panelSelectReq = false;
  }

  share() {
    if (this.selectedItems.length > 0) {
      this.panelSelectReq = false;
      let data = {
        survey_identifier: this.surveyIdentifier,
        panel: this.selectedItems,
        is_email: 1,
        organization: this.cookieService.get('organization_id')
      };
      this.shareEmailSurveyLink(data)
    } else {
      this.panelSelectReq = true;
    }
  }

  shareSMS() {
    if (this.selectedItemsSMS.length > 0) {
      this.panelSelectReq = false;

      // let panel: any[] = [];
      // let i = 0;
      // this.selectedItems.forEach(x=> {
      //   // console.log()
      //     panel.push(); 
      // });
      let data = {
        survey_identifier: this.surveyIdentifier,
        panel: this.selectedItemsSMS,
        is_email: 0,
        organization: this.cookieService.get('organization_id')
      };
      this.shareEmailSurveyLink(data)
    } else {
      this.panelSelectReq = true;
    }
  }
  shareEmailSurveyLink(data: any) {
    this.surveyService.shareEmailSurveyLink(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.alreadySharedPanels();
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

  alreadySharedPanels() {
    this.surveyService.getSharedPanelForSurvey(this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.sharedPanels = res.data;

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

  smsShare() {
    this.isSMSShare = true;
    this.isEmailShare = false;
    this.panelSelectReq = false;
  }

  smsConnected() {
    this.dashboardService.getPluginsView()
      .subscribe({
        next: (res: any) => {
          res.data.forEach(x => {
            if (x.plugin_name == "sms-plugin") {
              if (x.plugin_connection_data != undefined) {
                if (x.plugin_connection_data.is_connect == 1) {
                  this.isSMSConnected = true;
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
  setSurveySettings() {
    this.surveyService.surveySettings(this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.surveyTitle = res?.data?.title;
          if (res.data.google_analytics_allowed == 1 || this.gaAllowedno == 1) {
            this.initializeGoogleAnalytics(this.GAKey);
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
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
