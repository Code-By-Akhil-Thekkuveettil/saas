import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  apiUrl: any;
  constructor(private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public http: HttpClient,
    private route: Router,
    configurationLoader: ConfigLoaderService) {
    this.passwordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.spinner.show();
    const URL = this.apiUrl + 'login/user/forget_password';
    const data = {
      email: this.passwordForm.controls.email.value,
    };
    this.http.post(URL, data)
      .subscribe((result: any) => {
        this.route.navigate(['']);
        this.spinner.hide();
        this.toastr.success(result?.message);
      }, err => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message);
      });
  }
}
