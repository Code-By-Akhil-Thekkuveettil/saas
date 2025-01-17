import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-quota-settings',
  templateUrl: './quota-settings.component.html',
  styleUrls: ['./quota-settings.component.css']
})
export class QuotaSettingsComponent implements OnInit {

  isGAAllowed: boolean = false;
  GAKey: any;
  gaAllowedno: any;
  id: any;
  overall_quota: any;
  isOverall: boolean = false;

  constructor(
    private gaService: GoogleAnalyticsService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: SurveyService,
    private toastr: ToastrService,
  ) {
    let survey_id = this.route.snapshot.paramMap.get('id');
    this.id = survey_id;
   }

  ngOnInit(): void {
    this.GAKey = this.gaService.getAnalyticsKey();
    this.gaAllowedno = this.route.snapshot.paramMap.get('gaAllowed');
    if(this.GAKey != undefined && this.GAKey != ""){
      this.setSurveySettings();
    }
  }

  back(){
    this.router.navigate(['/survey/questions/'+this.id]);
  }

  addQuota(){

  }

  addOverallQuota(){
    this.isOverall = true;
  }
  
  setSurveySettings(){
    this.apiService.surveySettings(this.id)
      .subscribe({
        next: (res: any) => {
         
          if(res.data.google_analytics_allowed == 1){
            this.isGAAllowed = true;
          }else{
            this.isGAAllowed = false;
          }
          
          if(res.data.google_analytics_allowed == 1 || this.gaAllowedno == 1){
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
      gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${ this.GAKey }`);
  
      let gaScript2 = document.createElement('script');
      gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${ this.GAKey }\');`;
  
      document.head.appendChild(gaScript);
      document.head.appendChild(gaScript2);
    }

}
