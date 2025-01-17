import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TrackingIdService } from './tracking-id.service';

declare let ga: Function; // Google Analytics global variable

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor(private cookieService: CookieService) {}

  getAnalyticsKey(): string {
    return this.cookieService.get('google_analytics_key'); 
  }

}
