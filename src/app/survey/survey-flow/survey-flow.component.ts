import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { Location } from '@angular/common';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeletePopupService } from '../delete-popup/delete-popup.service';

@Component({
  selector: 'app-survey-flow',
  templateUrl: './survey-flow.component.html',
  styleUrls: ['./survey-flow.component.css']
})
export class SurveyFlowComponent implements OnInit {
  GAKey: any;
  gaAllowedno: any;
  page: any = [];
  deletedVariables: any[] = [];
  variables: any;
  isnewvariable: Boolean = false;
  variable: any = "";
  isVariableValid: boolean = true;
  isVariableNameValid: any = {};
  variable_value: any = "";
  selectedQuestion: any = {};
  surveyIdentifier: any;
  surveyTitle: any;

  constructor(
    private gaService: GoogleAnalyticsService,
    public spinner: NgxSpinnerService,
    private surveyService: SurveyService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location,
    private deletePopupService: DeletePopupService
  ) { }

  ngOnInit(): void {
    this.surveyIdentifier = this.route.snapshot.paramMap.get('id');
    this.GAKey = this.gaService.getAnalyticsKey();
    this.gaAllowedno = this.route.snapshot.paramMap.get('gaAllowed');
    if (this.GAKey != undefined && this.GAKey != "") {
      this.setSurveySettings();
    }
    this.getAllVariables();
    this.setQuestion();
  }
  changeQuestion(questions: any, variable: any) {
    this.selectedQuestions(questions, variable);
    variable.isEdited = true;
  }
  selectedQuestions(questions: any, variable: any) {
    let qst = questions?.filter((y: any) => {
      return variable.question_identifier == y.question_identifier
    });
    this.selectedQuestion[variable.variable_identifier] = qst[0];
  }
  checkValid() { }
  noSpaceValidation(value) {
    let valid = true;
    var regexp = "/^\S+$/";
    var pattern = new RegExp(regexp);
    valid = pattern.test(value);
    this.isVariableNameValid = valid;
    return valid;
  }
  setQuestion() {
    this.spinner.show();
    this.surveyService.surveyFullView(this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.page = res.data.survey_data;
          this.surveyService.getAllSurveyVariables(this.surveyIdentifier)
            .subscribe({
              next: (resp: any) => {
                let d = resp.data;
                this.spinner.hide()
                this.page.forEach(pg => {
                  pg.variables = [];
                  let vr = d.filter((x: any) => { return x.page_no == pg.page_num });
                  if (vr.length > 0) {
                    pg.isNewVariable = true;
                    vr.forEach(y => {
                      y.is_active = 1;
                      pg.variables.push(y);
                      this.selectedQuestions(pg?.questions, y)
                    });
                  }
                });
              },
              error: error => {
                this.toastr.error(error?.error?.message);
              }
            });

        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }


  back() {
    this.location.back();
  }

  addVariable(item: any, index: any) {
    item.isNewVariable = true;
    item.variables = [];
    item.variables.push({
      variables: "v_" + index,
      value: null,
      page_no: item.page_num,
      question_identifier: null,
      option_identifier: null,
      form_identifier: null,
      matrix_option_identifier: null,
      form_option_identifier: null,
      is_active: 1
    });
  }

  addNewvariable(item: any, index: any) {
    item.variables.push({
      variables: "v_" + index,
      value: "",
      page_no: item.page_num,
      is_active: 1,
      question_identifier: null,
      option_identifier: null,
      form_identifier: null,
      matrix_option_identifier: null,
      form_option_identifier: null,
    });
  }
  cancelURLVariable() {
    this.isnewvariable = false;
    this.variable = "";
  }
  addNewURLVariable() {
    this.isnewvariable = true;
  }
  addURLVariable() {
    if (this.variable != "") {
      let data = [
        {
          variables: this.variable,
          value: this.variable_value,
          page_no: 0,
          is_active: 1,
          question_identifier: null,
          option_identifier: null,
          form_identifier: null,
          matrix_option_identifier: null,
          form_option_identifier: null,
        }
      ];
      this.saveNewVariables(data);
    } else {
      this.isVariableValid = false;
    }
  }
  public openConfirmationDialog(variable: any, item: any) {
    this.deletePopupService.confirm('Please confirm', 'Do you really want to delete?')
      .then((confirmed) => {
        if (confirmed) {
          variable.is_active = 0;
          let data = {
            is_active: 0,
            question_identifier: variable?.question_identifier || null,
            option_identifier: null,
            form_identifier: variable?.form_identifier || null,
            matrix_option_identifier: variable?.matrix_option_identifier || null,
            form_option_identifier: null,
            survey_identifier: this.surveyIdentifier
          }
          if (variable.variable_identifier != undefined && variable.variable_identifier != "" && variable.variable_identifier != null) {
            this.deletedVariables.push(variable);
          }
          if (item) {
            item.variables = item.variables.filter((x: any) => { return x.variable_identifier != variable.variable_identifier });
            if (item.variables.length == 0) {
              item.isNewVariable = false;
            }
          }
          this.surveyUpdateVariables(variable?.variable_identifier, data);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  getAllVariables() {
    this.surveyService.getSurveyVariables(0, this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.variables = res.data
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  updateURLVariable(variable: any) {
    if (variable.variables != undefined && variable.variables != "" && variable.variables != null) {
      let data = {
        variables: variable.variables,
        value: variable.value,
        survey_identifier: this.surveyIdentifier,
        question_identifier: null,
        option_identifier: null,
        form_identifier: null,
        matrix_option_identifier: null,
        form_option_identifier: null,
      }
      this.surveyUpdateVariables(variable.variable_identifier, data)
    } else {
      this.getAllVariables();
    }
  }
  surveyUpdateVariables(variable_identifier: any, data: any) {
    this.surveyService.surveyUpdateVariables(variable_identifier, data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.getAllVariables();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  variableEdited(variable: any) {
    variable.isEdited = true;
    this.noSpaceValidation(variable);
  }
  saveVariable(x: any) {
    let data: any[] = [];
    if (x.variables != null || x.variables != undefined) {
      x.variables.forEach(y => {
        let variable = {
          variables: y?.variables,
          value: null,
          page_no: y?.page_no,
          question_identifier: y?.question_identifier,
          option_identifier: null,
          form_identifier: y?.form_identifier,
          matrix_option_identifier: y?.matrix_option_identifier,
          form_option_identifier: null,
          survey_identifier: y?.survey_identifier,
          is_active: y.is_active
        }
        if (y.is_active && (y.variable_identifier == undefined || y.variable_identifier == "" || y.variable_identifier == null)) {
          data.push(variable);
        } else {
          if (y.isEdited == true) {
            this.surveyUpdateVariables(y.variable_identifier, variable);
          }
        }
      });
    }
    if (data.length > 0) {
      this.saveNewVariables(data);
    }
    if (this.deletedVariables.length > 0) {
      this.deletedVariables.forEach((x: any) => {
        this.deleteAddedVariables(x);
      });
    }
    this.setQuestion();
  }
  save() {
    let data: any[] = [];
    this.page.forEach(x => {
      if (x.variables != null || x.variables != undefined) {
        x.variables.forEach(y => {
          let variable = {
            variable_identifier: y?.variable_identifier,
            variables: y?.variables,
            value: null,
            page_no: y?.page_no,
            question_identifier: y?.question_identifier,
            option_identifier: null,
            form_identifier: y?.form_identifier,
            matrix_option_identifier: y?.matrix_option_identifier,
            form_option_identifier: null,
            survey_identifier: y?.survey_identifier,
            is_active: y.is_active
          }
          if (y.is_active && (y.variable_identifier == undefined || y.variable_identifier == "" || y.variable_identifier == null)) {
            data.push(variable);
          } else {
            if (y.isEdited == true) {
              this.surveyUpdateVariables(y.variable_identifier, variable);
            }
          }
        });
      }
    });
    if (data.length > 0) {
      this.saveNewVariables(data);
    }

    if (this.deletedVariables.length > 0) {
      this.deletedVariables.forEach((x: any) => {
        this.deleteAddedVariables(x);
      });
    }

    this.setQuestion();

  }

  saveNewVariables(data: any) {
    this.surveyService.surveyAddVariables(data, this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.isnewvariable = false;
          this.variable_value = "";
          this.variable = "";
          this.getAllVariables();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }



  deleteAddedVariables(variable: any) {
    let data = {
      is_active: variable.is_active,
      question_identifier: variable?.question_identifier,
      option_identifier: null,
      form_identifier: variable?.form_identifier,
      matrix_option_identifier: variable?.matrix_option_identifier,
      form_option_identifier: null,
      survey_identifier: this.surveyIdentifier
    }
    this.surveyUpdateVariables(variable?.variable_identifier, data)
  }

  setSurveySettings() {
    this.surveyService.surveySettings(this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.surveyTitle = res?.data?.title;
          if (res.data.google_analytics_allowed == 1 || this.gaAllowedno == 1) {
            this.initializeGoogleAnalytics(this.GAKey);
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  private groupById(items: any[]): any[] {
    const grouped = items.reduce((acc, item) => {
      const key = item.page_no;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  // Google Analytics scripts
  private initializeGoogleAnalytics(analyticsKey: string): void {

    let gaScript = document.createElement('script');
    gaScript.setAttribute('async', 'true');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.GAKey}`);

    let gaScript2 = document.createElement('script');
    gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${this.GAKey}\');`;

    document.head.appendChild(gaScript);
    document.head.appendChild(gaScript2);
  }

}
