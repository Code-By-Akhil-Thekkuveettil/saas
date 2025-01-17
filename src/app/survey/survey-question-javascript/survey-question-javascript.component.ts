import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-survey-question-javascript',
  templateUrl: './survey-question-javascript.component.html',
  styleUrls: ['./survey-question-javascript.component.css']
})
export class SurveyQuestionJavascriptComponent implements OnInit {

  @Output() upload = new EventEmitter();
  onClose: any;
  expNavbar: boolean = true;
  jscode: any;
  question_type: any;

  constructor(
    private surveyService: SurveyService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<SurveyQuestionJavascriptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getJScode()
  }

  expand(show) {
    this.expNavbar = show;
  }

  closeDialog() {
    this._mdr.close()
  }

  getJScode() {
    this.surveyService.getQuestionView(this.data.id)
      .subscribe({
        next: (res: any) => {
          let question = res.data[0];
          this.jscode = question.javascript;
          this.question_type = question?.question_type
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  addJs() {
    let data = {
      survey_identifier: this.data.surveyID,
      question_type: this.question_type,
      javascript: this.jscode
    };
    this.surveyService.surveyQuestionUpdate(data, this.data.id)
      .subscribe({
        next: () => {
          this._mdr.close(true);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

}
