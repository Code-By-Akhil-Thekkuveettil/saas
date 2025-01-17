import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails: any;

  constructor(public authService: AuthenticationService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
   this.userDetails = {
    orgName : this.cookieService.get('organization_name'),
    role : this.cookieService.get('role_title'),
    email : this.cookieService.get('email')
   };   
  }

  logOut(){
    this.authService.logout();
  }

}
