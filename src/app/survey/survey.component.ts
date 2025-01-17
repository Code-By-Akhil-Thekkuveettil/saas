import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';

imports: [    RouterModule,  ]


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  expNavbar: boolean = true;
  path!: string;
  tknPassed !: string;

  constructor(private gaService: GoogleAnalyticsService) { }

  ngOnInit(): void {
    const analyticsKey = this.gaService.getAnalyticsKey();

    //  // Dynamically load Google Analytics script
    //  const script = document.createElement('script');
    //  script.async = true;
    //  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsKey}`;
    //  script.onload = () => {
    //    this.initializeGoogleAnalytics(analyticsKey);
    //  };
 
    //  document.head.appendChild(script);
    // this.initializeGoogleAnalytics(analyticsKey);
     
  }

  private initializeGoogleAnalytics(analyticsKey: string): void {

    let gaScript = document.createElement('script');
    gaScript.setAttribute('async', 'true');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${ analyticsKey }`);

    let gaScript2 = document.createElement('script');
    gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${ analyticsKey }\');`;

    document.head.appendChild(gaScript);
    document.head.appendChild(gaScript2);
  }

  expand(show) {
    this.expNavbar = show;
  }

}
