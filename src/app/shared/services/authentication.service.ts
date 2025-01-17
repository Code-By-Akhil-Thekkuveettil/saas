import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl: any;
  public isLoggedIn: boolean = false;
  
  constructor(private cookieService: CookieService,
    private http: HttpClient,
    configurationLoader: ConfigLoaderService,
    public spinner: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router) { 
      this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
    }

  logout() {
    this.spinner.show();
    const URL = this.apiUrl + 'login/user/signout';
    const header = new HttpHeaders().set('Content-Type', 'application/json')
    const headers = { headers: header };
    this.http.post(URL, {}, headers)
      .subscribe((result: any) => {
        this.spinner.hide();
        this.router.navigate(['./']);
        setTimeout(() => {
          this.deleteAllCookies();
        }, 300);
      },
        err => {
          this.spinner.hide();
          if (err.error.code === 401) {
            this.router.navigate(['']);
          } else {
            this.toastrService.error('', err.error?.message, {
              timeOut: 3000
            });
          }
        });
  }

  deleteAllCookies() {
    const res = document.cookie;
    const multiple = res.split(';');
    for (let i = 0; i < multiple.length; i++) {
      const key = multiple[i].split('=');
      document.cookie = key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    }
  }

  getCountryList(): Observable<any> {
    const URL = this.apiUrl + 'login/country/view';
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = { headers: header };
    return this.http.get(URL, headers) 
  }

  refreshToken(): Observable<any> {
    const URL = this.apiUrl + 'login/refresh';
    let data = {
      refresh : this.cookieService.get('refresh')
    }
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = { headers: header };
    return this.http.post(URL, data , headers) 
  }

  resetPassword(data: any): Observable<any> {
    const URL = this.apiUrl + 'login/reset_password';
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = { headers: header };
    return this.http.post(URL, data, headers)
  }
}
