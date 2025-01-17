import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MustMatch } from '../../shared/Providers/customValidators';
import { whitespace } from 'src/app/shared/Providers/customValidators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewSubscribeComponent } from 'src/app/subscriptions/new-subscribe/new-subscribe.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  subscription: MatDialogRef<NewSubscribeComponent> | undefined;
  apiUrl: any;
  isHidden = false;
  countryList: any = [];
  signUpForm: FormGroup;
  public showPassword: boolean = false;
  constructor(public fb: FormBuilder,
    public http: HttpClient,
    public route: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public authService: AuthenticationService,
    private matDialog: MatDialog,
    configurationLoader: ConfigLoaderService) {
    this.signUpForm = this.fb.group({
      companyName: ['', Validators.required],
      companyWebsite: ['', Validators.required],
      firstName: ['', Validators.required],
      LastName: ['', Validators.required],
      email: new FormControl('', [Validators.required, Validators.email]),
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      country_code: ['', Validators.required],
      country_Number: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validator: MustMatch('password', 'confirmPassword') });
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }

  ngOnInit(): void {
    this.signUpForm.get('companyName')?.addValidators([whitespace]);
    this.signUpForm.get('companyWebsite')?.addValidators([whitespace]);
    this.signUpForm.get('firstName')?.addValidators([whitespace]);
    this.signUpForm.get('LastName')?.addValidators([whitespace]);
    this.getCountryList();
  }

  getCountryList() {
    this.spinner.show();
    this.authService.getCountryList().subscribe((result) => {
      this.spinner.hide();
      this.countryList = result.data;
    },
      err => {
        this.spinner.hide();
        if (err.error.code !== 401) {
          this.toastr.error('', err.error?.message, {
            timeOut: 3000
          });
        }
      });
  }

  signUp() {
    if (this.signUpForm.invalid) {
      return;
    }
    this.spinner.show();
    const URL = this.apiUrl + 'login/user/create';
    const data = {
      organization_name: this.signUpForm.controls['companyName'].value,
      organization_url: this.signUpForm.controls['companyWebsite'].value,
      first_name: this.signUpForm.controls['firstName'].value,
      last_name: this.signUpForm.controls['LastName'].value,
      email: this.signUpForm.controls['email'].value,
      password: this.signUpForm.controls['password'].value,
      country_code: this.signUpForm.controls['country_code'].value,
      contact_number: this.signUpForm.controls['country_Number'].value,
    };
    this.http.post(URL, data)
      .subscribe((result: any) => {
        this.spinner.hide();
        this.toastr.success(result?.message);
        this.route.navigate(['']);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message);
      });
  }

  keyPressNumbersWithDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  changed(evt) {
    this.signUpForm.setValue['acceptTerms'] = evt.target.checked;
  }

  addSubscription() {
    if (this.signUpForm.invalid) {
      return;
    }
    this.subscription = this.matDialog.open(NewSubscribeComponent, {
      disableClose: true,
      height: '500px',
      width: '700px',

    });

    this.subscription.afterClosed().subscribe(res => {
      if ((res == true)) {
        this.signUp();
      }
    });
  }
}