import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SurveyQuestionActionComponent } from '../survey-question-action/survey-question-action.component';
import { SurveyAddSkipLogicComponent } from '../survey-add-skip-logic/survey-add-skip-logic.component';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { SurveyOptionEditComponent } from '../survey-option-edit/survey-option-edit.component';
import { SurveyQuestionJavascriptComponent } from '../survey-question-javascript/survey-question-javascript.component';
import { TextEditorComponent } from 'src/app/shared/text-editor/text-editor.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DeletePopupService } from '../delete-popup/delete-popup.service';
import { PreviewQuestionPopupComponent } from '../preview-question-popup/preview-question-popup.component';
import { ImportQuestionPopupComponent } from '../import-question-popup/import-question-popup.component';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CreateEditPagePopupComponent } from '../create-edit-page-popup/create-edit-page-popup.component';
import { QuestionType } from 'src/app/model/QuestionType';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ChoiceDisplayLogicComponent } from '../choice-display-logic/choice-display-logic.component';

@Component({
  selector: 'app-new-survey-questions',
  templateUrl: './new-survey-questions.component.html',
  styleUrls: ['./new-survey-questions.component.css']
})
export class NewSurveyQuestionsComponent implements OnInit {
  questionAction: MatDialogRef<SurveyQuestionActionComponent> | undefined;
  questionSkipLogic: MatDialogRef<SurveyAddSkipLogicComponent> | undefined;
  optionEdit: MatDialogRef<SurveyOptionEditComponent> | undefined;
  JavascriptPopup: MatDialogRef<SurveyQuestionJavascriptComponent> | undefined;
  textEditorPopup: MatDialogRef<TextEditorComponent> | undefined;
  createPagePopup: MatDialogRef<CreateEditPagePopupComponent> | undefined;
  previewQuestionPopup: MatDialogRef<PreviewQuestionPopupComponent> | undefined;
  importQuestionPopup: MatDialogRef<ImportQuestionPopupComponent> | undefined;
  popup: MatDialogRef<ChoiceDisplayLogicComponent> | undefined;
  isnewquestion = false;
  newquestion: any;
  content: string = "";
  option: any = [];
  optionform: any = [];
  optionmatrixcol: any = [];
  colValue: any = '';
  rowValue: any = '';
  isnew = false;
  copiedQuestion: any;
  i: number = 0;
  isquestionvalid = true;
  matrixtype: any = [];
  isoptiontypevalid = true;
  required: any;
  isRequired: any
  selectoption: string = '';
  questiontypes: QuestionType[] = [];
  selectedQuestionType: number = 3;//Default type radio button
  selectedMatrixQuestionType: any = 3;//Default type radio button
  surveyTitle: string | undefined;
  isEdit: boolean = false;
  isSave: boolean = false;
  survey_identifier: any;
  loading: boolean = false;
  expNavbar: boolean = true;
  showNavbar: any;
  check: number = 0;
  newoption: string = "";
  optionId: number = 0;
  isnewEdit: Boolean = false;
  newoptionform: string = "";
  selectedAlignment: any = {};
  newRow: boolean = false;
  newColumn: boolean = false;
  isPageBreak: boolean = false;
  pagebreakList: any;
  optionIsAdded: boolean = false;
  questionCount: any;
  questionList: any = [];
  tkn: any;
  pages: any = [];
  htmlContent = '';
  skipLogicSets: any[] = [];
  skipLogicList: any[] = [];
  lastPageNo: any;
  pageIndex: number = 0;
  pageCount: number = 0;
  isMultipleOptions: boolean = false;
  remove_option: boolean = false;
  questionIndex: number = 0;
  GAKey: any;
  gaAllowedno: any;
  isMultipleOptionsMatrixCol: boolean = false;
  multipleOptionTextMatrix: string = "";
  multipleOptionText: string = "";
  minValue: number = 0;
  maxValue!: number;
  totalValue: number = 0;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
  }
  limit = 10;
  offset = 0;
  public openMenu: any = {};
  isOver = false;
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private apiService: DashboardService,
    private surveyService: SurveyService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    public spinner: NgxSpinnerService,
    private gaService: GoogleAnalyticsService,
    public deletePopupService: DeletePopupService,
  ) {
    this.getQuestionType();
    const currentState = this.router.getCurrentNavigation();
    this.survey_identifier = this.route.snapshot.paramMap.get('id');
    this.gaAllowedno = this.route.snapshot.paramMap.get('GAallowedno');
    if (currentState) {
      let state = currentState.extras.state;
      this.surveyTitle = state ? state['survey_title'] : '';
      this.isEdit = state ? state['isEdit'] : '';
    }
  }

  ngOnInit(): void {
    this.GAKey = this.gaService.getAnalyticsKey();
    this.pageCount = 0;
    if (this.GAKey != undefined && this.GAKey != "") {
      this.setSurveySettings();
    }
    if (this.isEdit) {
      this.setQuestion();
      this.isSave = true;
      this.isnewquestion = false;
    } else {
      // this.isnewquestion = true;
      this.isSave = true;
      if (this.survey_identifier) {
        this.setQuestion();
      }
    }
  }

  getQuestionType() {
    this.surveyService.surveyQuestionTypeList()
      .subscribe({
        next: (res: any) => {
          this.questiontypes = res?.data
          this.questiontypes = this.questiontypes?.filter((x: any) => { return x?.is_active == 1 })
          this.matrixtype = this.questiontypes?.filter((y: any) => {
            return (y.id == 1 ||
              y.id == 2 ||
              y.id == 3 ||
              y.id == 9 ||
              y.id == 7)
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  copyQuestion(question: any) {
    this.copiedQuestion = question;
  }
  show(show) {
    this.showNavbar = show;
  }
  expand(show) {
    this.expNavbar = show;
  }
  importFromLibrary(page) {
    this.importQuestionPopup = this.matDialog.open(ImportQuestionPopupComponent, {
      disableClose: true,
      height: 'auto',
      width: '700px',
      data: { page_no: page?.page_num, surveyId: this.survey_identifier }
    });
    this.importQuestionPopup.afterClosed().subscribe(res => {
      if (res)
        this.setQuestion();
    });
  }

  addnewquestion(index: any) {
    this.pages.forEach(x => {
      x.isNewPage = false;
    });
    this.pages[index].isNewPage = true;

    // this.isnewquestion = true;
    this.content = "";
    this.newquestion = "";
    this.option = [];
    this.optionform = [];
    this.optionmatrixcol = [];
    this.required = true;
    this.multipleOptionText = '';
    this.multipleOptionTextMatrix = "";
    this.selectedQuestionType = 3;
  }
  pasteQuestion(index) {
    let data = {
      survey_identifier: this.survey_identifier,
      copy_question_identifier: this.copiedQuestion?.question_identifier,
      page_no: index
    }
    this.surveyService.surveyQuestionCopy(data)
      .subscribe({
        next: (resp: any) => {
          this.copiedQuestion = null;
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  addPageBreak(item: any, k: any) {
    // item.isPageBreak = true;
    let data = {
      survey_identifier: this.survey_identifier,
      after_question: item,
      after_page_no: k
    };
    this.surveyService.surveyAddPageBreak(data)
      .subscribe({
        next: (res: any) => {
          this.setQuestion();
          // this.spinner.hide();
        },
        error: error => {
          // this.toastr.error(error, "Unable to update question");
        }
      });
  }

  removePageBreak(item: any) {
    item.isPageBreak = false;
    let id = item.pageBreakID;
    let data = {
      is_active: 0
    };
    this.surveyService.surveyRemovePageBreak(data, id)
      .subscribe({
        next: (res: any) => {

        },
        error: error => {
          // this.toastr.error(error, "Unable to update question");
        }
      });
  }

  add() {
    this.isnew = true;
    this.content = ""
    this.addoption();
  }
  addFormOption() {
    this.isnew = true;
    this.content = ""
    this.addoptionform();
  }
  onContentChange(event: any, question: any) {
    let htmlContent = event.target?.value;
    question.question = htmlContent;
    this.updateQuestion(question);
  }
  stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>?/gm, '');
  }
  updateQuestion(item: any) {
    let data = {};
    if (item.question_type == 5) {
      data = {
        survey_identifier: this.survey_identifier,
        question: item.question,
        question_type: item?.question_type,
        align_type: item?.align_type,
        custom_placeholder: item.custom_placeholder,
        response_status_code: item?.response_status_code,
        is_active: 1,
        row_header: item?.row_header || null,
        column_header: item?.column_header || null,
        required_status: item.required_status == true ? 1 : 0,
        is_contact_form: item.is_contact_form == true ? 1 : 0,
        is_shuffle: item.is_shuffle ? 1 : 0,
        is_multiple: 0,
      }
    } else {
      data = {
        survey_identifier: this.survey_identifier,
        question: item.question,
        question_type: item.question_type,
        custom_placeholder: item.custom_placeholder,
        align_type: item?.align_type,
        response_status_code: item?.response_status_code,
        matrix_question_type: item?.matrix_question_type,
        row_header: item?.row_header || null,
        column_header: item?.column_header || null,
        is_active: 1,
        is_shuffle: item.is_shuffle ? 1 : 0,
        required_status: item.required_status == true ? 1 : 0,
        is_multiple: item.is_multiple == true ? 1 : 0,
        default_value: item.default_value || null
      }
    }
    this.surveyQuestionUpdate(data, item?.question_identifier);
  }
  updateQuestionType(item: any) {
    this.spinner.show();
    let data = {
      survey_identifier: this.survey_identifier,
      question: item.question,
      question_type: item.question_type,
      is_active: 1,
      required_status: item.required_status == true ? 1 : 0,
    }
    this.surveyService.surveyQuestionUpdate(data, item?.question_identifier)
      .subscribe({
        next: (res: any) => {
          item.id = res.data?.id;
          if (item.question_type == 5 ||
            item.question_type == 9) {
            this.newoptionform = "Click here to write option";
            this.addnewoptionform(item.question_identifier);
          } else if (item.question_type == 6) {
            this.addNewRow(item?.question_identifier);
            this.addNewCol(item?.question_identifier);
          } else if ((item.question_type == 3 ||
            item.question_type == 2 || item.question_type == 4) && (item.option == undefined)) {
            this.addnewoption(item.question_identifier, "");
          } else {
            this.setQuestion();
          }
          this.spinner.hide();
        },
        error: error => {
          this.spinner.hide();
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updateStatus(item: any, is_active: any) {
    let data = {
      question: item.question,
      required_status: item.required_status == true ? 1 : 0,
      is_active: is_active,
      question_type: item.question_type,
      survey_identifier: this.survey_identifier
    }
    let msg = 'Do you really want to' + (is_active == 0 ? ' delete?' : ' archive?')
    this.deletePopupService.confirm('Please confirm', msg)
      .then((confirmed) => {
        if (confirmed) {
          this.surveyQuestionUpdate(data, item?.question_identifier)
        }
      });
  }
  surveyQuestionUpdate(data: any, id: any) {
    this.surveyService.surveyQuestionUpdate(data, id)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }


  updateOption(item: any) {
    if (item.option_identifier) {
      let data = {
        choices: item.choices,
        text_entry: item.text_entry == "" || item.text_entry == undefined ? 0 : 1,
        is_required_text_entry: item.is_required_text_entry ? 1 : 0,
        default_option: item.default_option == "" || item.default_option == undefined ? 0 : 1,
        required_status: item.required_status == "" || item.required_status == undefined ? 0 : 1,
        is_exclusive: item.is_exclusive == "" || item.is_exclusive == undefined ? 0 : 1,
      }
      this.surveyQuestionOptionUpdate(data, item?.option_identifier)
    } else {
      this.saveQuestionOption(item)
    }
  }
  surveyQuestionOptionUpdate(data: any, option_identifier: any) {
    this.spinner.show();
    this.surveyService.surveyQuestionOptionUpdate(data, option_identifier)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.setQuestion();
        },
        error: error => {
          this.spinner.hide();
          this.toastr.error(error?.error?.message);
        }
      });
  }
  surveyQuestionOptionFormUpdate(data: any, id: any) {
    this.surveyService.surveyQuestionOptionFormUpdate(data, id)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message)
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updateOptionForm(item: any) {
    if (item.form_identifier) {
      let data = {
        choices: item.choices,
        text_entry: item.text_entry == "" || item.text_entry == undefined ? 0 : 1,
        is_required_text_entry: item.is_required_text_entry ? 1 : 0,
        required_status: item.required_status == "" || item.required_status == undefined ? 0 : 1
      }
      this.surveyQuestionOptionFormUpdate(data, item?.form_identifier);
    }
    else {
      this.saveQuestionOption(item)
    }
  }

  deleteOptionsForm(item: any, options: any) {
    if (options.length > 1) {
      let data = {
        is_active: 0
      }
      if (item.form_identifier) {
        this.spinner.show();
        this.surveyQuestionOptionFormUpdate(data, item?.form_identifier);
      }
    } else {
      this.toastr.error("Minimum 1 option is required");
    }
  }
  surveyMatrixColUpdate(data: any, id: any) {
    this.surveyService.surveyMatrixColUpdate(data, id)
      .subscribe({
        next: (res: any) => {
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updateOptionMatrixCol(item: any) {
    if (item.matrix_option_identifier) {
      let data = {
        matrix_options: item.matrix_options,
        text_entry: item.text_entry == "" || item.text_entry == undefined ? 0 : 1,
        is_required_text_entry: item.is_required_text_entry ? 1 : 0,
        required_status: item.required_status == "" || item.required_status == undefined ? 0 : 1
      }
      this.surveyMatrixColUpdate(data, item?.matrix_option_identifier)
    } else {
      this.saveQuestionOption(item)
    }
  }
  deleteConfirmationDialog(event) {
    this.openConfirmationDialog(event?.type, event?.value, event?.options)
  }
  public openConfirmationDialog(type: any, value: any, options: any = "") {
    this.deletePopupService.confirm('Please confirm', 'Do you really want to delete?')
      .then((confirmed) => {
        if (confirmed) {
          switch (type) {
            case "deletePage": this.deletePage(value)
              break;
            case "deleteSkip": this.deleteSkip(value)
              break;
            case "deleteoptions": this.deleteoptions(value, options)
              break;
            case "deleteOptionsForm": this.deleteOptionsForm(value, options)
              break;
            case "deleteOptionsmatrixcol": this.deleteOptionsmatrixcol(value, options)
              break;
            case "deleteoptionmatrixcol": this.deleteoptionmatrixcol(value)
              break;
            case "deleteoptionmatrixrow": this.deleteoptionform(value)
              break;
            case "deleteoption": this.deleteoption(value);
              break;
            case "deleteoptionform": this.deleteoptionform(value);
              break;
            default: break;
          }
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  deleteOptionsmatrixcol(item: any, options: any) {
    if (options.length > 1) {
      if (item.matrix_option_identifier) {
        let data = {
          is_active: 0
        }
        this.spinner.show();
        this.surveyMatrixColUpdate(data, item.matrix_option_identifier);
      }
    } else {
      this.toastr.error("Minimum 1 option is required");
    }
  }

  editDropdownOption(item: any) {
    this.isnewEdit = true;
  }
  addquestion(item: any, qstn: NgModel, optiontype: NgModel, frm: NgForm, k: any) {
    if ((qstn.valid && qstn.touched) && (optiontype.valid)) {
      if (((this.selectedQuestionType == 2 ||
        this.selectedQuestionType == 3 ||
        this.selectedQuestionType == 4) && this.option.length == 0)) {
        this.optionIsAdded = true;
      } else if (((this.selectedQuestionType == 5 ||
        this.selectedQuestionType == 9) && this.optionform.length == 0)) {
        this.optionIsAdded = true;
      } else if (((this.selectedQuestionType == 6) &&
        this.optionmatrixcol.length == 0 &&
        this.optionform.length == 0)) {
        this.optionIsAdded = true;
      } else {
        this.spinner.show();
        item.isNewPage = false;
        let data: any;
        let requiredStatus = this.required === true ? 1 : 0;
        let options = '';
        if (this.selectedQuestionType == 8) {
          requiredStatus = 0;
        }
        if (this.selectedQuestionType == 2 ||
          this.selectedQuestionType == 3 ||
          this.selectedQuestionType == 4) {
          options = this.option;
          this.optionform = [];
          this.optionmatrixcol = [];
        } else if (this.selectedQuestionType == 5 ||
          this.selectedQuestionType == 9) {//form, continuous sum
          this.option = [];
          this.optionmatrixcol = [];
        } else if (this.selectedQuestionType == 6) {//matrix
          this.option = [];
        } else {
          this.option = [];
          this.optionform = [];
          this.optionmatrixcol = [];
        }
        if (this.selectedQuestionType != 6) {
          this.selectedMatrixQuestionType = null;
        }
        if (item.page_between) {
          data = {
            id: undefined,
            question: this.newquestion,
            question_type: this.selectedQuestionType,
            matrix_question_type: this.selectedMatrixQuestionType,
            required_status: requiredStatus,
            survey_identifier: this.survey_identifier,
            options: options,
            page_no: k,
            add_new_page: {
              new_page_no: k
            }
          }
        } else {
          data = {
            id: undefined,
            question: this.newquestion,
            question_type: this.selectedQuestionType,
            matrix_question_type: this.selectedMatrixQuestionType,
            required_status: requiredStatus,
            survey_identifier: this.survey_identifier,
            options: options,
            page_no: k
          }
        }
        this.surveyService.surveyQuestionSave(data)
          .subscribe({
            next: (resp: any) => {
              this.optionIsAdded = false;
              if (this.option && this.option?.length > 0) {
                this.option.forEach((value: any) => {
                  value.question_identifier = resp.data?.question_identifier;
                });
                this.saveQuestionOption(this.option, false)
              }
              if (this.optionform) {
                const queue: any[] = [];
                const processNextRequest = () => {
                  if (queue.length === 0) {
                    return;
                  }
                  const request = queue[0];
                  this.surveyService.surveyQuestionOptionFormSave(request.value)
                    .subscribe({
                      next: (res: any) => {
                        request.value.id = res.data?.id;
                        queue.shift();
                        this.setQuestion();
                        processNextRequest();
                      },
                      error: error => {
                        this.toastr.error(error?.error?.message);
                      }
                    });
                };
                this.optionform.forEach((value: any) => {
                  value.question_identifier = resp.data?.question_identifier;
                  queue.push({ value });
                });
                processNextRequest();
              }
              if (this.optionmatrixcol) {
                const queue: any[] = [];
                const processNextRequest = () => {
                  if (queue.length === 0) {
                    return;
                  }
                  // Get the next request in the queue
                  const request = queue[0];
                  // Call the API to save the survey question option
                  this.surveyService.surveyOptionMatrixColSave(request.value).subscribe({
                    next: (res: any) => {
                      // Update the ID of the saved option
                      request.value.id = res.data?.id;
                      // Remove the processed request from the queue
                      queue.shift();
                      // Call the setQuestion method to update the component state
                      this.setQuestion();
                      // Process the next request in the queue
                      processNextRequest();
                    },
                    error: error => {
                      // Display an error message if there was an error saving the option
                      this.toastr.error(error?.error?.message);
                    }
                  });
                };

                // Add each option to the back of the queue
                this.optionmatrixcol.forEach((value: any) => {
                  value.question_identifier = resp.data?.question_identifier;
                  queue.push({ value });
                });

                // Start processing the requests in the queue
                processNextRequest();
                // *********************RUN API IN QUEUE ENDS******************************/
              }
              if (this.check == 0) {
                this.check++;
              }
              this.setQuestion();
            },
            error: error => {
              this.spinner.hide();
              this.toastr.error(error?.error?.message);
            }
          });
        this.content = "";
        this.newquestion = "";
        this.selectedQuestionType = -1;
        // this.optionform = [];
        // this.option = [];
        this.required = false;
        this.isnewquestion = false;
        this.isSave = true;
      }
    } else {
      if (qstn.invalid && qstn.untouched) {
        this.isquestionvalid = false;
      } else {
        this.isoptiontypevalid = false;
      }
      this.toastr.error("Invalid question")
    }
  }

  saveQuestionOption(data: any, isNew: boolean = false) {
    this.surveyService.surveyQuestionOptionSave(data)
      .subscribe({
        next: (res: any) => {
          if (isNew) {
            this.newoption = "";
            this.isnew = false;
          } else {
            data.id = res.data?.id;
          }
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  addNewRow(question_identifier: any) {
    let item = {
      question_identifier: question_identifier,
      survey_identifier: this.survey_identifier,
      choices: "",
      option_type: 1
    };
    this.saveQuestionOptionForm(item);
  }

  addNewCol(question_identifier: any) {
    let item = {
      question_identifier: question_identifier,
      survey_identifier: this.survey_identifier,
      matrix_options: "",
      option_type: 1
    };
    this.saveQuestionOptionMatrixCol(item);
  }

  saveQuestionOptionForm(item: any) {
    this.surveyService.surveyQuestionOptionFormSave(item)
      .subscribe({
        next: (res: any) => {
          item.id = res.data?.id
          // item.choices = res.data.choices
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  saveQuestionOptionMatrixCol(item: any) {
    this.surveyService.surveyOptionMatrixColSave(item)
      .subscribe({
        next: (res: any) => {
          item.id = res.data?.id
          // item.choices = res.data.choices
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  addoption() {
    this.option.push({
      choices: this.content,
      option_type: 1,
      question_identifier: '',
      survey_identifier: this.survey_identifier,
      text_entry: 0,
      is_required_text_entry: 0,
      required_status: 0,
      is_exclusive: 0,
      is_all_of_the_above: 0
    });
    this.content = "";
    this.isnew = false;
  }

  addoptionform() {
    this.optionform.push({
      choices: this.content,
      option_type: 1,
      question_identifier: '',
      survey_identifier: this.survey_identifier,
    });
    this.content = "";
    this.isnew = false;
  }
  addoptionmatrixrow() {
    this.optionform.push({
      choices: this.rowValue,
      option_type: 1,
      question_identifier: '',
      survey_identifier: this.survey_identifier,
      text_entry: 0,
      is_required_text_entry: 0,
    });
    this.rowValue = "";
    this.newRow = false;
  }
  addoptionmatrixcol() {
    this.optionmatrixcol.push({
      matrix_options: this.colValue,
      option_type: 1,
      question_identifier: '',
      survey_identifier: this.survey_identifier,
    });
    this.colValue = "";
    this.newColumn = false;
  }
  addMatrixRow() {
    this.newRow = true;
    this.addoptionmatrixrow()
  }
  addMatrixColumn() {
    this.newColumn = true;
    this.addoptionmatrixcol()
  }
  addnewoptionEvent(event: any) {
    this.addnewoption(event.question_identifier, event.option);
  }
  addnewoption(question_identifier: any, option: any) { // add new options to the already added questions
    let data = [{
      question_identifier: question_identifier,
      survey_identifier: this.survey_identifier,
      choices: option,
      option_type: 1,
      text_entry: 0,
      is_required_text_entry: 0,
      required_status: 0,
      is_exclusive: 0,
      is_all_of_the_above: 0
    }];
    this.saveQuestionOption(data, true);
  }

  addnewoptionform(question_identifier: any) { // add new options to the already added form questions
    let data = {
      question_identifier: question_identifier,
      survey_identifier: this.survey_identifier,
      choices: this.newoptionform,
      option_type: 1,
    }

    this.surveyService.surveyQuestionOptionFormSave(data)
      .subscribe({
        next: (res: any) => {
          // item.choices = res.data.choices
          this.setQuestion();
          this.newoptionform = "";
          this.isnew = false;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }
  addNew(question: any) {
    question.isnew = true;
    this.addnewoptionform(question.question_identifier)
  }
  onCheckboxChange(event: MatCheckboxChange) {
    this.remove_option = event.checked;
  }
  addNewContactOption(qid: any, type_id: any) {
    let data = {
      survey_identifier: this.survey_identifier,
      question_identifier: qid,
      contact_form_id: type_id
    }
    this.surveyService.surveylibraryCreateOption(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  editOption() {
  }

  removeoption() {
    this.isnew = false;
  }

  deleteoption(index: number) {
    this.option.splice(index, 1);
  }
  deleteoptionform(index: number) {
    this.optionform.splice(index, 1);
  }
  deleteoptionmatrixcol(index: number) {
    this.optionmatrixcol.splice(index, 1);
  }
  deleteoptions(item: any, options: any) {
    if (options.length > 1) {
      if (item.option_identifier) {
        let data = {
          is_active: 0
        }
        this.surveyQuestionOptionUpdate(data, item?.option_identifier);
      }
    } else {
      this.toastr.error("Minimum 1 option is required");
    }

  }
  backtoPreviewMode() {
    this.isnewEdit = false;
  }

  setQuestion() {
    this.spinner.show();
    this.surveyService.surveyViewQuestion(this.survey_identifier, this.limit, this.offset)
      .subscribe({
        next: (res: any) => {
          this.pages = res.data.survey_data;
          this.surveyTitle = res?.data?.survey_title;
          this.pageCount = res?.data?.count;
          this.questionList = [];
          this.pages.forEach(x => {
            this.questionList.push({ // question list for moving questions
              question: "Top of Page " + x.page_order,
              question_identifier: "",
              page_no: x.page_num,
              page_order: x.page_order
            });
            x.questions.forEach(y => {
              this.questionList.push({ // question list for moving questions
                question: "After Question " + y.unique_question_num,
                question_identifier: y?.question_identifier,
                page_no: x.page_num,
                page_order: x.page_order
              });
            });
            if (x.skip_logic != undefined && x.skip_logic.length > 0) {
              x.skipLogic = this.groupBySkipId(x.skip_logic);
            }
          });
          this.spinner.hide();
        },
        error: error => {
          this.spinner.hide();
          // this.toastr.error(error, "Unable to get survey questions")
        }
      });
  }
  private groupBySkipId(items: any[]): any[] {
    const grouped = items.reduce((acc, item) => {
      const key = item.unique_skip_id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return Object.values(grouped);
  }
  findMaxUniqueSkipId(arr: any[]): string {
    return arr.reduce((max, item) => {
      const currentId = item.unique_skip_id;
      return currentId > max ? currentId : max;
    }, '');
  }

  cancel(index: any) {
    this.pages[index].isNewPage = false;
    this.content = "";
    this.newquestion = "";
    this.selectedQuestionType = -1;
    this.option = [];
    this.optionform = [];
    this.optionmatrixcol = [];
    this.required = false;
    this.isnewquestion = false;
  }

  responseList() {
    this.router.navigate(['/survey/responses/' + this.survey_identifier], { state: { fromSurvey: true, gaAllowed: this.gaAllowedno } });
  }
  distribution() {
    this.router.navigate(['/survey/distribution/' + this.survey_identifier], { state: { gaAllowed: this.gaAllowedno } });
  }
  redirectsurveyFlow() {
    this.router.navigate(['/survey/survey-flow/' + this.survey_identifier], { state: { gaAllowed: this.gaAllowedno } });
  }
  settings() {
    this.router.navigate(['/survey/settings', this.survey_identifier], { state: { gaAllowed: this.gaAllowedno } });
  }

  questionMove(toQuestion: any, question: any) {
    let data = {};
    if (toQuestion.question_identifier == "") {
      data = {
        survey_identifier: this.survey_identifier,
        question_identifier: question.question_identifier,
        on_top: 1,
        move_after_question_identifier: null,
        page_no: toQuestion.page_no
      };
    } else {
      data = {
        survey_identifier: this.survey_identifier,
        question_identifier: question.question_identifier,
        move_after_question_identifier: toQuestion.question_identifier,
        on_top: null,
        page_no: toQuestion.page_no
      };
    }
    this.surveyService.surveyQuestionMove(data)
      .subscribe({
        next: (res: any) => {
          this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
    // }
  }

  initiateSurvey() {
    this.surveyService.getSurveyUrlToken(this.survey_identifier)
      .subscribe({
        next: (resp: any) => {
          this.tkn = resp.data?.token;
          if (this.tkn) {
            localStorage.setItem('gaAllowed', this.gaAllowedno);
            const url = '/general/testsurvey/' + this.tkn;
            window.open(url, '_blank');
          } else {
            this.toastr.error(resp.data?.message);
          }
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

  addnewThankyouPage() {
    this.spinner.show()
    let data1 = {
      survey_identifier: this.survey_identifier,
      page_order: this.pageCount + 1,
      response_status_code: 2,
      terminal_status: 1,
      is_active: 1
    };
    this.surveyService.addPageSurvey(data1)
      .subscribe({
        next: (resp: any) => {
          this.spinner.hide();
          this.setQuestion();
          this.toastr.success(resp?.message);
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
  action(question: any, page_order: any) {
    this.questionAction = this.matDialog.open(SurveyQuestionActionComponent, {
      disableClose: true,
      height: 'auto',
      width: '800px',
      data: {
        question_identifier: question.question_identifier,
        question_type: question.question_type,
        survey_identifier: this.survey_identifier,
        page_num: question?.page_no,
        required_status: question.required_status,
        page_order: page_order
      }
    });

    this.questionAction.afterClosed().subscribe(res => {
      if ((res == true)) {
        this.setQuestion();
      }
    });
  }

  skipLogic(item: any, newSkip: any) {
    this.questionSkipLogic = this.matDialog.open(SurveyAddSkipLogicComponent, {
      disableClose: true,
      height: 'auto',
      width: '800px',
      data: {
        survey_identifier: this.survey_identifier,
        page: item.page_order,
        page_num: item.page_num,
        newSkip: newSkip,
      }
    });
    this.questionSkipLogic.afterClosed().subscribe(res => {
      if (res == true) {
        this.setQuestion();
      }
    });
  }

  deleteSkip(skip: any) {
    skip?.forEach(logic => {
      logic?.question_skip_logical_data.forEach(x => {
        let data = {
          logical_condition_identifier: x?.logical_condition_identifier,
          survey_identifier: x?.survey_identifier,
          parent_question_identifier: x?.parent_question_identifier,
          is_active: 0
        };
        this.surveyService.updateDisplayLogic(data)
          .subscribe({
            next: (res: any) => {
              this.toastr.success(res?.message);
              this.setQuestion();

            },
            error: error => {
              this.toastr.error(error?.error?.message);
            }
          });
      });
    });

  }

  deletePage(page: any) {
    // this.page = this.page.filter((x: any) => { return x.page_no != page.page_no });
    let data = {
      survey_identifier: this.survey_identifier,
      page_no: page.page_num,
      page_order: page.page_order
    };
    this.surveyService.deletePageSurvey(data)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success(resp?.message);
          this.setQuestion();
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

  allowTextEntry(item: any) {
    if (item.text_entry != 1) {
      item.text_entry = 1;
    } else {
      item.text_entry = 0;
    }
    this.updateOption(item);
  }
  default_option(item: any) {
    if (item.default_option != 1) {
      item.default_option = 1;
    } else {
      item.default_option = 0;
    }
    this.updateOption(item);
  }

  isRequiredOption(item: any) {
    if (item.required_status != 1) {
      item.required_status = 1;
    } else {
      item.required_status = 0;
    }
    this.updateOption(item);
  }

  allowTextEntryForMatrix(item: any, matrix_option: boolean = false) {
    if (item.text_entry != 1) {
      item.text_entry = 1;
      item.is_required_text_entry = 1;
    } else {
      item.text_entry = 0;
      item.is_required_text_entry = 0;
    }
    if (matrix_option) {
      this.updateOptionMatrixCol(item);
    } else {
      this.updateOptionForm(item);
    }
  }
  allowTextEntryRequiredForMatrix(item: any, matrix_option: boolean = false) {
    if (item.is_required_text_entry != 1) {
      item.is_required_text_entry = 1;
    } else {
      item.is_required_text_entry = 0;
    }
    if (matrix_option) {
      this.updateOptionMatrixCol(item);
    } else {
      this.updateOptionForm(item);
    }
  }

  isRequiredOptionForMatrix(item: any, matrix_option: boolean = false) {
    if (item.required_status != 1) {
      item.required_status = 1;
    } else {
      item.required_status = 0;
    }
    if (matrix_option) {
      this.updateOptionMatrixCol(item);
    } else {
      this.updateOptionForm(item);
    }
  }

  updateUniqueNoText(question: any) {
    let data = {
      survey_identifier: this.survey_identifier,
      unique_question_num: question.unique_question_num,
      question_type: question?.question_type,
      is_active: 1,
    }
    this.surveyQuestionUpdate(data, question?.question_identifier);
  }

  //add multiple options to the questions throught one input entry

  addMultipleOptions() {
    this.isMultipleOptions = true;
  }
  addMultipleOptionsMatrixCol() {
    this.isMultipleOptionsMatrixCol = true;
  }
  addmultipleConvertionCancel() {
    this.isMultipleOptions = false;
  }
  addmultipleConvertionCancelMatrixCol() {
    this.isMultipleOptionsMatrixCol = false;
  }
  addMultipleAlreadyAdded(question: any) {
    question.isMultipleOptions = true;
  }
  addMultipleAlreadyAddedMatrixCol(question: any) {
    question.isMultipleOptionsCol = true;
  }
  multipleConvertionCancel(question: any) {
    question.isMultipleOptions = false;
  }
  multipleConvertionCancelMatrixCol(question: any) {
    question.isMultipleOptionsCol = false;
  }

  multipleOptionsConvertion() {
    if (this.remove_option) {
      this.option = [];
    }
    let array = this.multipleOptionText.split('\n');
    array.forEach(x => {
      this.option.push({
        choices: x,
        option_type: 1,
        question_identifier: '',
        survey_identifier: this.survey_identifier,
        text_entry: 0,
        is_required_text_entry: 0,
        required_status: 0,
        is_exclusive: 0,
        is_all_of_the_above: 0
      });
    });
    this.isnew = false;
    this.multipleOptionText = "";
    this.isMultipleOptions = false;
    this.remove_option = false;
  }

  multipleOptionsConvertionForm() {
    if (this.remove_option) {
      this.optionform = [];
    }
    let array = this.multipleOptionText.split('\n');
    array.forEach(x => {
      this.optionform.push({
        choices: x,
        option_type: 1,
        question_identifier: '',
        survey_identifier: this.survey_identifier,
      });
    });
    this.isnew = false;
    this.multipleOptionText = "";
    this.isMultipleOptions = false;
    this.remove_option = false;
  }

  multipleOptionsConvertionMatrixRow() {
    if (this.remove_option) {
      this.optionform = [];
    }
    let array = this.multipleOptionText.split('\n');
    array.forEach(x => {
      this.optionform.push({
        choices: x,
        option_type: 1,
        question_identifier: '',
        survey_identifier: this.survey_identifier,
        text_entry: 0,
        is_required_text_entry: 0,
      });
    });
    this.newRow = false;
    this.multipleOptionText = "";
    this.isMultipleOptions = false;
    this.remove_option = false;
  }

  multipleOptionsConvertionMatrixCol() {
    if (this.remove_option) {
      this.optionmatrixcol = [];
    }
    let array = this.multipleOptionTextMatrix.split('\n');
    array.forEach(x => {
      this.optionmatrixcol.push({
        matrix_options: x,
        option_type: 1,
        question_identifier: '',
        survey_identifier: this.survey_identifier,
      });

    });
    this.newColumn = false;
    this.multipleOptionTextMatrix = "";
    this.isMultipleOptionsMatrixCol = false;
    this.remove_option = false;
  }

  multipleConvertionAlreadyAdded(question: any) {
    if (question?.remove_option) {
      //remove existing options
      question?.option?.forEach(element => {
        let data = {
          is_active: 0
        }
        this.surveyQuestionOptionUpdate(data, element?.option_identifier);
      });
    }
    let array = question.multipleOptionText.split('\n');
    let i = 0;
    this.convertMultipleOptions(question, array, i);
    question.remove_option = false;
  }
  convertMultipleOptions(question: any, array: any, index: any) {
    let data = [{
      question_identifier: question?.question_identifier,
      survey_identifier: this.survey_identifier,
      choices: array[index],
      option_type: 1,
      text_entry: 0,
      is_required_text_entry: 0,
      required_status: 0,
      is_exclusive: 0,
      is_all_of_the_above: 0
    }];

    this.surveyService.surveyQuestionOptionSave(data)
      .subscribe({
        next: (res: any) => {
          index++;
          if (index < array.length) {
            this.convertMultipleOptions(question, array, index);
          } else
            this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  multipleConvertionAlreadyAddedForm(question: any) {
    if (question?.remove_option) {
      //remove existing options
      question?.form_questions?.forEach(element => {
        let data = {
          is_active: 0
        }
        this.surveyQuestionOptionFormUpdate(data, element?.form_identifier);
      });
    }
    let array = question.multipleOptionText.split('\n');
    let i = 0;
    this.convertMultipleOptionsForm(question, array, i);
    question.remove_option = false;
  }
  convertMultipleOptionsForm(question: any, array: any, index: any) {
    let data = {
      question_identifier: question?.question_identifier,
      survey_identifier: this.survey_identifier,
      choices: array[index],
      option_type: 1,
    }
    this.surveyService.surveyQuestionOptionFormSave(data)
      .subscribe({
        next: (res: any) => {
          index++;
          if (index < array.length) {
            this.convertMultipleOptionsForm(question, array, index);
          } else {
            this.setQuestion();
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  multipleConvertionAlreadyAddedFormCol(question: any) {
    if (question?.remove_col) {
      //remove existing options
      question?.matrix_option?.forEach(element => {
        let data = {
          is_active: 0
        }
        this.surveyMatrixColUpdate(data, element?.matrix_option_identifier);
      });
    }
    let array = question.multipleOptionText.split('\n');
    let i = 0;
    this.convertMultipleOptionsFormCol(question, array, i);
    question.remove_col = false;
  }
  convertMultipleOptionsFormCol(question: any, array: any, index: any) {
    let data = {
      question_identifier: question?.question_identifier,
      survey_identifier: this.survey_identifier,
      matrix_options: array[index],
      option_type: 1
    };
    this.surveyService.surveyOptionMatrixColSave(data)
      .subscribe({
        next: (res: any) => {
          index++;
          if (index < array.length) {
            this.convertMultipleOptionsFormCol(question, array, index);
          } else
            this.setQuestion();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  displayLogic(data: any = {}) {
    this.popup = this.matDialog.open(ChoiceDisplayLogicComponent, {
      disableClose: true,
      height: 'auto',
      width: '800px',
      data: data
    });

    this.popup.afterClosed().subscribe(res => {
      if ((res == true)) {
      }
    });
  }
  setSurveySettings() {
    this.surveyService.surveySettings(this.survey_identifier)
      .subscribe({
        next: (res: any) => {
          if (res.data.google_analytics_allowed == 1 || this.gaAllowedno == 1) {
            this.initializeGoogleAnalytics(this.GAKey);
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
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

  quotaSettings() {
    this.router.navigate(['/survey/quota', this.survey_identifier],
      { state: { gaAllowed: this.gaAllowedno } });
  }
  editOtherOption(event: any, question_identifier: any) {
    this.editOptions(event?.item, question_identifier, event?.question_type)
  }
  editOptions(items: any, question_identifier: any, question_type: any, matrix_question_type: any = null, matrix_option: boolean = false) {
    this.optionEdit = this.matDialog.open(SurveyOptionEditComponent, {
      disableClose: true,
      height: 'auto',
      width: '600px',
      data: {
        survey_identifier: this.survey_identifier,
        option: items,
        question_type: question_type,
        question_identifier: question_identifier,
        matrix_question_type: matrix_question_type,
        matrix_option: matrix_option
      }
    });
    this.optionEdit.afterClosed().subscribe(res => {
      if ((res == true)) {
        this.setQuestion();
      }
    });
  }

  // javascript popup call
  addJavascript(question: any) {
    this.JavascriptPopup = this.matDialog.open(SurveyQuestionJavascriptComponent, {
      disableClose: true,
      height: '500px',
      width: '600px',
      data: {
        id: question.question_identifier,
        surveyID: this.survey_identifier,
      }
    });

    this.JavascriptPopup.afterClosed().subscribe(res => {
      if ((res == true)) {
      }
    });
  }

  addEditPage(type: any, pageIndex: any, page: any) {
    if (type == 'create') {
      this.createPage(pageIndex);
    } else {
      this.createPagePopup = this.matDialog.open(CreateEditPagePopupComponent, {
        disableClose: true,
        height: '600px',
        width: '700px',
        data: { type: type, survey_identifier: this.survey_identifier, pageIndex: pageIndex, page: page }
      });
      this.createPagePopup.afterClosed().subscribe(res => {
        if (res) this.setQuestion();
      });
    }
  }
  createPage(pageIndex: any) {
    let data = {
      survey_identifier: this.survey_identifier,
      title: 'Page ' + (pageIndex + 1),
      description: '',
      response_status_code: 0,
      terminal_status: 0,
      is_active: 1,
      page_order: pageIndex + 1
    };
    this.surveyService.addPageSurvey(data)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success(resp?.message);
          this.setQuestion();
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
  movePage(page_order: any, move_to_page_order: any) {
    let data = {
      survey_identifier: this.survey_identifier,
      page_order: page_order,
      move_to_page_order: move_to_page_order
    };
    this.spinner.show();
    this.surveyService.movePageSurvey(data)
      .subscribe({
        next: (resp: any) => {
          this.setQuestion();
        },
        error: (error: any) => {
          this.spinner.hide()
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

  isExclusive(item: any) {
    if (item.is_exclusive != 1) {
      item.is_exclusive = 1;
    } else {
      item.is_exclusive = 0;
    }
    this.updateOption(item);
  }
  addPipeChoiceText(event: any) {
    this.addPipeText(event?.pipedText, event?.node, 'option')
  }
  addPipeText(pipedText: any, item: any, type: any = 'question') {
    if (type == 'question') {
      item.question = item.question + " " + pipedText
      this.updateQuestion(item)
    } else if (type == 'form_questions') {
      item.choices = item.choices + " " + pipedText
      let data = {
        choices: item.choices,
      }
      this.surveyQuestionOptionFormUpdate(data, item?.form_identifier);
    } else if (type == 'matrix_options') {
      item.matrix_options = item.matrix_options + " " + pipedText
      let data = {
        matrix_options: item.matrix_options
      }
      this.surveyMatrixColUpdate(data, item?.matrix_option_identifier)
    } else if (type == 'newquestion') {
      this.newquestion = this.newquestion + " " + pipedText
    } else {
      item.choices = item.choices + " " + pipedText
      let data = {
        choices: item.choices,
      }
      this.surveyQuestionOptionUpdate(data, item?.option_identifier)
    }
  }
  savePiping(data) {
    this.surveyService.addPiping(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  moveOption(question: any, from: any, to: any, type: any = "") {
    let data = {}
    if (question.question_type == 2 || question.question_type == 3 || question.question_type == 4) {
      data = {
        "survey_identifier": this.survey_identifier,
        "question_identifier": question?.question_identifier,
        "option_order": from,
        "move_to_option_order": to
      };
      this.surveyService.moveOption(data)
        .subscribe({
          next: (resp: any) => {
            this.setQuestion();
          },
          error: (error: any) => {
            let err = '';
            if (!error.code) {
              if (error && error.errors)
                err = error.errors;
              let errMsg: string = err ? err : 'Please try again later';
            }
          }
        });
    } else if (question.question_type == 5 || question.question_type == 9 || type == 'form') {
      data = {
        "survey_identifier": this.survey_identifier,
        "question_identifier": question?.question_identifier,
        "form_question_order": from,
        "move_to_form_question_order": to
      }
      this.surveyService.moveFormQuestion(data)
        .subscribe({
          next: (resp: any) => {
            this.setQuestion();
          },
          error: (error: any) => {
            let err = '';
            if (!error.code) {
              if (error && error.errors)
                err = error.errors;
              let errMsg: string = err ? err : 'Please try again later';
            }
          }
        });
    } else if (question.question_type == 6) {
      data = {
        "survey_identifier": this.survey_identifier,
        "question_identifier": question?.question_identifier,
        "matrix_options_order": from,
        "move_to_matrix_options_order": to
      }
      this.surveyService.moveMatrixOption(data)
        .subscribe({
          next: (resp: any) => {
            this.setQuestion();
          },
          error: (error: any) => {
            let err = '';
            if (!error.code) {
              if (error && error.errors)
                err = error.errors;
              let errMsg: string = err ? err : 'Please try again later';
            }
          }
        });
    }

  }

  editTextEditor(item: any, type: any) {
    this.textEditorPopup = this.matDialog.open(TextEditorComponent, {
      disableClose: true,
      height: '500px',
      width: '700px',
      data: {
        content: type == "question" ? item.question :
          type == "newquestion" ? item :
            type == "choices" ? item.choices : item.matrix_options
      }
    });
    this.textEditorPopup.afterClosed().subscribe(res => {
      if (res) {
        if (type == "question") {
          item.question = res;
          this.updateQuestion(item);
        } else if (type == "newquestion") {
          this.newquestion = res;
        } else if (type == "choices") {
          item.choices = res;
          this.updateOptionForm(item)
        } else {
          item.matrix_options = res;
          this.updateOptionMatrixCol(item)
        }
      }
    });
  }
  previewQuestion(question: any) {
    this.previewQuestionPopup = this.matDialog.open(PreviewQuestionPopupComponent, {
      disableClose: true,
      height: 'auto',
      width: '700px',
      data: {
        question: question
      }
    });
  }
  updateAlignment(event: any, question: any) {
    question.align_type = event?.value;
    this.updateQuestion(question);
  }
  updateResponseStatusType(event: any, question: any) {
    question.response_status_code = event?.value;
    this.updateQuestion(question);
  }
  updateMatrixQuestiontype(event: any, question: any) {
    question.matrix_question_type = event?.value
    this.updateQuestion(question);
  }

  clickMenu(id: any) {
    if (this.openMenu[id])
      this.openMenu[id] = false;
    else {
      this.openMenu = {};
      this.openMenu[id] = true;
    }
  }
  updateSurveyTitle(title: any) {
    if (title != "") {
      let data = {
        title: title,
      }
      this.surveyService.surveyUpdate(this.survey_identifier, data)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res?.message);
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.offset = (e.pageSize * e.pageIndex);
    this.limit = e.pageSize;
    this.setQuestion();
  }
}
