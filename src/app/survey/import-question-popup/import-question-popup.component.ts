import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-import-question-popup',
  templateUrl: './import-question-popup.component.html',
  styleUrls: ['./import-question-popup.component.css']
})
export class ImportQuestionPopupComponent implements OnInit {
  listview: any;
  selectedItem: string = "";

  constructor(private apiService: SurveyService,
    public spinner: NgxSpinnerService,
    private _mdr: MatDialogRef<ImportQuestionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.importFromLibrary();
  }
  importFromLibrary() {
    this.spinner.show();
    this.apiService.libraryQuestionListView()
      .subscribe({
        next: (res: any) => {
          this.listview = res?.data;
          this.spinner.hide();
        },
        error: error => {
          this.spinner.hide();
        }
      });
  }
  closeDialog() {
    this._mdr.close();
  }
  selectType(id: any) {
    this.selectedItem = id;
  }
  selectQuestion() {
    this.spinner.show();
    let data = {
      survey_identifier: this.data.surveyId,
      page_no: this.data.page_no,
      library_question_id: this.selectedItem
    };
    this.apiService.getQuestionCreate(data)
      .subscribe({
        next: (res: any) => {      
          this._mdr.close(true);
        },
        error: error => {
          this.spinner.hide();
        }
      });
  }
}
