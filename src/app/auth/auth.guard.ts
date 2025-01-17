import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  currentUser!:any;

  constructor(
    private authService:AuthenticationService,
    private router: Router,
    private cookieService: CookieService
  ){
    this.currentUser = this.cookieService.get('user_id');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //   this.currentUser = this.authService.currentUserValue;
      if (this.currentUser) {
        return true;
      }

      // not logged in. so redirect to login page with the return url
      this.router.navigate([''], { queryParams: { returnUrl: state.url } });
      return false;
  }
  
}
