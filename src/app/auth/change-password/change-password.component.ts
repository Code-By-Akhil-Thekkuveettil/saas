import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MustMatch } from 'src/app/shared/Providers/customValidators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePassword : FormGroup;
  isHidden = false;
  public showPassword : boolean = false;
  apiUrl: any;
  token: any;
  constructor(private fb: FormBuilder,
    public http: HttpClient,
    configurationLoader: ConfigLoaderService,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
     private authService: AuthenticationService) {
    this.changePassword = this.fb.group({
      new_Password: ['', Validators.required],
      con_Password: ['', Validators.required]
    }, {validator: MustMatch('new_Password', 'con_Password') });
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
   }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      this.token = queryParams.get("token");
    })
  }
  

  passwordChange(){
    this.spinner.show();
    const data = {
      user : this.token,
      password: this.changePassword.controls['new_Password'].value
    }
    this.authService.resetPassword(data).subscribe((result) => {
      this.spinner.hide();
      this.toastr.success(result.status);
      this.router.navigate([' ']);
    },
      err => {
        this.spinner.hide();
        console.log(err);
        if (err.error.code !== 401) {
          this.toastr.error('', err.error.message, {
            timeOut: 3000
          });
        }
      });
  }
}
