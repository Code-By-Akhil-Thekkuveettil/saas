import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-new-survey',
  templateUrl: './new-survey.component.html',
  styleUrls: ['./new-survey.component.css'],
})
export class NewSurveyComponent implements OnInit {
  @Output() upload = new EventEmitter();

  survey_name: string = '';
  onClose: any;
  validateSurveyName: boolean = false;
  expNavbar: boolean = true;
  baseUrl: any;
  redirectLink: any;
  includeQuestion: boolean = false;
  includeThankyou: boolean = true;
  includeContact: any;
  loading: boolean = false;
  isSubmitted: boolean = false;
  surveyUrl: string = "";

  constructor(
    public http: HttpClient,
    public spinner: NgxSpinnerService,
    private surveyService: SurveyService,
    private router: Router,
    public modal: BsModalRef,
    private toastr: ToastrService,
    private cookieService: CookieService,
    configurationLoader: ConfigLoaderService,
    private _mdr: MatDialogRef<NewSurveyComponent>
  ) {
    this.surveyUrl = configurationLoader.apiBaseUrl().surveyLink;
  }

  ngOnInit(): void {
  }
  expand(show) {
    this.expNavbar = show;
  }

  checkNull() {
    let surveyNameInput = this.survey_name?.trim().length === 0
    if (surveyNameInput) {
      this.validateSurveyName = false
    }
    else {
      this.validateSurveyName = true
    }
  }

  create(surveyForm: NgForm) {
    this.isSubmitted = false;
    this.checkNull();
    if (surveyForm.valid && this.validateSurveyName) {
      this.spinner.show();
      this.isSubmitted = true;
      let data: any;

      data = {
        title: this.survey_name,
        organization: this.cookieService.get('organization_id'),
        created_user: this.cookieService.get('user_id'),
        status: 0,
        is_ip_check: 0,
        introduction_question: this.includeQuestion == true ? 1 : 0,
        contact_form: this.includeContact == true ? 1 : 0,
        thankyou_page: this.includeThankyou == true ? 1 : 0,
      }
      this.surveyService.createSurvey(data).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(res?.message);
          this.router.navigate(['survey/questions', res.data?.survey_identifier], { state: { isEdit: false, survey_title: this.survey_name } });
          this._mdr.close(true);
        },
        error: error => {
          this.spinner.hide();
          this.toastr.error(error?.error?.message);
        }
      });
    }
  }
  closeDialog() {
    this._mdr.close()
  }
}
