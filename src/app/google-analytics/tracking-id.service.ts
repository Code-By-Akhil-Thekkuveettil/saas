import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TrackingIdService {

  private readonly trackingCookieKey = 'google_analytics_key';

  constructor(private cookieService: CookieService) {}

  getUserTrackingId(): string {
    return this.cookieService.get(this.trackingCookieKey);
  }

  setUserTrackingId(trackingId: string): void {
    this.cookieService.set(this.trackingCookieKey, trackingId);
  }

}
