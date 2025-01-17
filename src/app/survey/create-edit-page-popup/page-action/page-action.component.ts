import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeletePopupService } from '../../delete-popup/delete-popup.service';
import { CreateEditPagePopupComponent } from '../create-edit-page-popup.component';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-page-action',
  templateUrl: './page-action.component.html',
  styleUrls: ['./page-action.component.css']
})
export class PageActionComponent implements OnInit {
  @Input() survey_identifier: any;
  redirectLink: any = {};
  isnewRedirect: boolean = false;
  redirectLinks: any = [];
  @Input() pageIndex: any;
  @Input() response_status_code: any;
  embeddedData: any = []
  operators: any = []
  logicValid: boolean = false;

  constructor(private deletePopupService: DeletePopupService,
    public toastr: ToastrService,
    private apiService: SurveyService,
    private _mdr: MatDialogRef<CreateEditPagePopupComponent>,
  ) { }

  ngOnInit(): void {
    this.getAllRedirect();
    this.getAllVariables();
    this.getLogicalOperators();
    this.redirectLink = {
      redirect_urls: "https://",
      is_logic: 0,
      "logic": null,
      "logic_value": null,
      "logical_operators_type": null,
      "variable_identifier": null
    }
  }
  getAllVariables() {
    this.apiService.getAllSurveyVariables(this.survey_identifier)
      .subscribe({
        next: (res: any) => {
          this.embeddedData = res.data
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getLogicalOperators() {
    this.apiService.getLogicalOperatorView(0)
      .subscribe({
        next: (res: any) => {
          this.operators = res?.data;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updateLogic(logic: any) {
    logic.edited = true
  }
  changeLink(redirect: any) {
    redirect.edited = true
    this.urlValidation(redirect.redirect_urls);
  }
  textOperatorUpdate(logic: any) {
    logic.edited = true;
    logic.textFieldValid = logic.logical_operators_type != 7 && logic.logical_operators_type != 8
  }
  checkLogicValid(logic: any) { logic.edited = true; }
  addRedirect() {
    if (this.redirectLink.redirect_urls != "" && this.urlValidation(this.redirectLink.redirect_urls)) {
      let data = {
        survey_identifier: this.survey_identifier,
        redirect_urls: this.redirectLink.redirect_urls,
        is_logic: this.redirectLink.is_logic ? 1 : 0,
        "logic": this.redirectLink.logic,
        "logic_value": this.redirectLink.logic_value,
        "logical_operators_type": this.redirectLink.logical_operators_type,
        "variable_identifier": this.redirectLink.variable_identifier || null,
        response_status: this.response_status_code,
        page_no: this.pageIndex
      }
      this.apiService.surveyAddRedirectLink(data)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res?.message);
            this.isnewRedirect = false;
            this.redirectLink = {};
            this._mdr.close();
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  cancelRedirect() {
    this.redirectLink = {};
    this.isnewRedirect = false;
  }
  getAllRedirect() {
    this.apiService.getSurveyRedirectLinkByPagenum(this.survey_identifier, this.pageIndex)
      .subscribe({
        next: (res: any) => {
          this.redirectLinks = [];
          res?.data?.forEach(data => {
            this.redirectLinks.push({
              redirect_identifier: data.redirect_identifier,
              redirect_urls: data.redirect_urls,
              edited: false,
              textFieldValid: data?.logic_data?.logical_operators_type != 7 && data?.logic_data?.logical_operators_type != 8,
              is_logic: data?.is_logic ? 1 : 0,
              "logic": data?.logic_data?.logic,
              "logic_value": data?.logic_data?.logic_value,
              "logical_operators_type": data?.logic_data?.logical_operators_type,
              "variable_identifier": data?.logic_data?.variable_identifier
            })
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updateRedirectLink() {
    this.redirectLinks?.forEach(element => {
      if (element.edited) {
        this.updateRedirect(element);
      }
    });
  }
  updateRedirect(redirect: any) {
    if (redirect.redirect_urls != "") {
      let data = {
        survey_identifier: this.survey_identifier,
        redirect_urls: redirect.redirect_urls,
        is_logic: redirect.is_logic ? 1 : 0,
        "logic": redirect.logic,
        "logic_value": redirect.logic_value,
        "logical_operators_type": redirect.logical_operators_type,
        "variable_identifier": redirect.variable_identifier || null
      }
      this.surveyUpdateRedirectLink(redirect.redirect_identifier, data)
    }
  }
  deleteRedirect(redirect: any) {
    let data = {
      is_active: 0
    }
    this.surveyUpdateRedirectLink(redirect?.redirect_identifier, data);
  }
  surveyUpdateRedirectLink(id: any, data: any) {
    this.apiService.surveyUpdateRedirectLink(id, data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message)
          this._mdr.close();
          this.getAllRedirect();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  addnewRedirect() {
    this.isnewRedirect = true;
  }
  urlValidation(link: any) {
    let valid = true;
    var pattern = new RegExp("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)");
    valid = pattern.test(link);
    return valid;
  }
  public openConfirmationDialog(type: any, value: any, options: any = "") {
    this.deletePopupService.confirm('Please confirm', 'Do you really want to delete?')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteRedirect(value);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
