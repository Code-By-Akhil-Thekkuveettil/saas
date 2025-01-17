import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-create-edit-page-popup',
  templateUrl: './create-edit-page-popup.component.html',
  styleUrls: ['./create-edit-page-popup.component.css']
})
export class CreateEditPagePopupComponent implements OnInit {
  survey_identifier: any;
  pageIndex: any;
  page: any = {
    "title": "",
    "description": '',
    "response_status_code": 0,
    "terminal_status": 0,
    'is_active': 1
  }
  type: any;
  constructor(
    private apiService: SurveyService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private _mdr: MatDialogRef<CreateEditPagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.survey_identifier = data?.survey_identifier;
    this.pageIndex = data?.pageIndex;
    this.type = data?.type;
    if (this.type == 'edit') {
      this.page = data.page;
    } else {
      let order = this.pageIndex + 1;
      this.page.title = 'Page ' + order;
    }
  }
  ngOnInit(): void {
  }
  createPage() {
    let data = {
      survey_identifier: this.survey_identifier,
      title: this.page?.title,
      description: this.page?.description,
      response_status_code: this.page?.response_status_code,
      terminal_status: this.page?.terminal_status,
      is_active: this.page?.is_active,
      page_order: this.pageIndex + 1
    };
    this.apiService.addPageSurvey(data)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success(resp?.message);
          this._mdr.close(true);
        },
        error: (error: any) => {
          let err = '';
          if (!error.code) {
            if (error && error.errors)
              err = error.errors;
            let errMsg: string = err ? err : 'Please try again later';
            this.toastr.error(error?.error?.message);
          }
        }
      });
  }
  editPage() {
    let data = {
      title: this.page?.title,
      description: this.page?.description,
      response_status_code: this.page?.response_status_code,
      terminal_status: this.page?.terminal_status ? 1 : 0,
      is_active: this.page?.is_active,
      page_order: this.page?.page_order
    };
    this.apiService.editPageSurvey(data, this.page?.page_identifier)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success(resp?.message);
          this._mdr.close(true);
        },
        error: (error: any) => {
          let err = '';
          if (!error.code) {
            if (error && error.errors)
              err = error.errors;
            let errMsg: string = err ? err : 'Please try again later';
            this.toastr.error(error?.error?.message);
          }
        }
      });
  }
  closeDialog() {
    this._mdr.close();
  }

}
