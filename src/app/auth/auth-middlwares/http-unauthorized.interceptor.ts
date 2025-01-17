import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { catchError, switchMap } from 'rxjs/operators';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private apiUrl: any;

  constructor(
    private auth: AuthenticationService,
    private cookieService: CookieService,
    configurationLoader: ConfigLoaderService,
    private router: Router) {
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.cookieService.get('token');
    let excludeUrls = [
      this.apiUrl + 'login/country/view',
      this.apiUrl + 'login/reset_password'];
    if (!excludeUrls.includes(request.url)) {
      return next.handle(this.addAuthorizationHeader(request, accessToken)).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.router.navigate(['./']);
          }
          return throwError(err);
        })
      );
    } else {
      return next.handle(request).pipe(
      );
    }
  }
  private logoutAndRedirect(err: HttpErrorResponse): Observable<HttpEvent<any>> {
    this.auth.logout();
    return throwError(() => new Error('test'));
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return request.clone({
        headers: new HttpHeaders().append('Authorization', 'Bearer ' + token)
      });
    }
    return request;
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.refreshToken().pipe(
      switchMap((data: any) => {
        this.cookieService.set('token', data.data.access);
        return next.handle(this.addAuthorizationHeader(request, data.data.access));
      })
    );
  }
}
