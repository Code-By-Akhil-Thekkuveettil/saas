import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  showPassword: boolean = false;
  returnUrl!: string;
  apiUrl: any;
  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public route: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public cookieService: CookieService,
    configurationLoader: ConfigLoaderService,
    private router: ActivatedRoute
  ) {
    this.signInForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false),
    });
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }

  ngOnInit(): void {
    this.returnUrl = this.router.snapshot.queryParamMap.get('returnUrl') || '';
    this.signInForm.get('email')?.setValue(localStorage.getItem('userID'));
    this.signInForm.get('password')?.setValue(localStorage.getItem('password'));
    const rememberMe = localStorage.getItem('rememberMe');
    rememberMe == 'false' ? this.signInForm.get('rememberMe')?.setValue(false) : this.signInForm.get('rememberMe')?.setValue(true);
    
  }

  forgotPassword() {
    this.route.navigate(['./forgotPassword']);
  }

  signIn() {
    this.spinner.show();
    const URL = this.apiUrl + 'login/user/signin';
    const data = {
      email: this.signInForm.controls['email'].value,
      password: this.signInForm.controls['password'].value
    };
    this.http.post(URL, data)
      .subscribe((result: any) => {
        this.spinner.hide();
        if (result.errors != null) {
          this.toastr.error('', result.errors);
        } else {
          this.cookieService.set('token', result.data.access, 0, '/');
          this.cookieService.set('refresh', result.data.refresh, 0, '/');
          this.cookieService.set('is_superuser', result.data.is_superuser);
          this.cookieService.set('organization_id', result.data.organization_id);
          this.cookieService.set('organization_name', result.data.organization_name);
          this.cookieService.set('role_id', result.data.role_id);
          this.cookieService.set('role_title', result.data.role_title);
          this.cookieService.set('user_id', result.data.user_id);
          this.cookieService.set('email', this.signInForm.controls['email'].value);
          //ga
          this.cookieService.set('google_analytics_key', "G-M0SZB9JYTG");
          localStorage.setItem('rememberMe', this.signInForm.controls['rememberMe'].value);
          if(this.signInForm.controls['rememberMe'].value ){
            localStorage.setItem('userID', '');
            localStorage.setItem('password', '');
            localStorage.setItem('userID', this.signInForm.controls['email'].value);
            localStorage.setItem('password', this.signInForm.controls['password'].value);
          } else {
            if(localStorage.getItem('userID') === this.signInForm.controls['email'].value) {
              localStorage.setItem('userID', '');
              localStorage.setItem('password', '');
            }
          }
         
            let url = this.returnUrl || '/dashboard';
            console.log(url);
            setTimeout(() => {
              this.route.navigate([url])
              .then(() => {
                window.location.href = url;
              });
            });
           
        
          
        }
      }, err => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message);
      });
  }

  signUp() {
    this.route.navigate(['./signUp']);
  }
}
