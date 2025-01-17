import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { DeletePopupService } from '../delete-popup/delete-popup.service';
import { KeyValue } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'view-response',
  templateUrl: './view-response.component.html',
  styleUrls: ['./view-response.component.css']
})
export class ViewResponseComponent implements OnInit {
  // assignedId: string | null;
  questionList: any = [];
  currentUser: any;
  loading: boolean = false;
  downloadedData: any;
  expNavbar: boolean = true;
  showNavbar: any;
  surveyTitle: any;
  questions: any;
  limit = 10;
  offset = 0;
  pageIndex: number = 0;
  page: number = 1;
  survey_count: number = 0;
  responseType: number = 3;
  isLoading = false;
  survey_partial_response_count: number = 0;
  survey_complete_response_count: number = 0;
  survey_disqualified_response_count: number = 0;
  question_head: any[] = [];
  answers: any[] = [];
  responses: any[] = [];
  fromSurvey: boolean = false;
  searchText;
  GAKey: any;
  gaAllowedno: any;
  dataSource: any;
  selection = new SelectionModel<Element>(true, []);
  columnNames: any = ['select', 'action', 'index', 'response_status', 'survey_live_status', 'createdDate', 'ip', 'variables'];
  @ViewChild('paginator') paginator!: MatPaginator;
  data: any = Object.assign(this.responses);
  surveyIdentifier: any;
  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): any => {
    return 0;
  };
  page_count: any = 0;

  ngAfterViewInit() {
    if (this.dataSource)
      this.dataSource.paginator = this.paginator;
  }
  constructor(
    private router: Router,
    private deletePopupService: DeletePopupService,
    private surveyService: SurveyService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private gaService: GoogleAnalyticsService,
  ) {
    this.surveyIdentifier = this.route.snapshot.paramMap.get('id');
    this.GAKey = this.gaService.getAnalyticsKey();
    this.gaAllowedno = this.route.snapshot.paramMap.get('gaAllowed');
    if (this.GAKey != undefined && this.GAKey != "") {
      this.setSurveySettings();
    }
    const currentState = this.router.getCurrentNavigation();
    if (currentState) {
      let state = currentState.extras.state;
      this.fromSurvey = state ? state['fromSurvey'] : '';
    }
  }

  ngOnInit(): void {
    this.getQuestionList();
  }
  handlePageEvent(e: PageEvent) {
    this.selection = new SelectionModel<Element>(true, []);//reset selection
    this.pageIndex = e.pageIndex;
    this.getQuestionAndAnswer();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  removeSelectedRows() {
    let msg = 'Do you really want to delete?'
    this.deletePopupService.confirm('Please confirm', msg)
      .then((confirmed) => {
        if (confirmed) {
          this.selection.selected.forEach(item => {
            let index: number = this.data.findIndex(d => d === item);
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
            let data = {
              survey_identifier: this.surveyIdentifier,
              answer_response_identifier: item.id,
              is_active: 0
            }
            this.surveyService.deleteUserResponse(data)
              .subscribe({
                next: (res: any) => {
                  this.toastr.success(res?.message);
                },
                error: error => {
                  this.toastr.error(error?.error?.message);
                }
              });
          });
          this.selection = new SelectionModel<Element>(true, []);
        }
      });
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource?.data?.forEach(row => this.selection.select(row));
  }
  getQuestionList() {
    this.columnNames = ['select', 'action', 'index', 'response_status', 'survey_live_status', 'createdDate', 'ip', 'variables'];
    this.surveyService.surveyQuestionList(this.surveyIdentifier)
      .subscribe({
        next: (res: any) => {
          this.questionList = res.data.questions;
          this.questionList?.forEach((qst: any, index) => {
            if (qst.question_type_name == "Matrix") {
              qst?.form_questions?.forEach((question: any, f_index: any) => {
                if (qst.old_status == 1) {
                  this.question_head.push({
                    header: qst.unique_question_num + " - " + question.choices + " - Old "
                  });
                  if (!this.columnNames.includes(qst.unique_question_num + " - " + question.choices + " - Old"))
                    this.columnNames.push(qst.unique_question_num + " - " + question.choices + " - Old")
                } else {
                  this.question_head.push({
                    header: qst.unique_question_num + " - " + question.choices
                  });
                  if (!this.columnNames.includes(qst.unique_question_num + " - " + question.choices))
                    this.columnNames.push(qst.unique_question_num + " - " + question.choices);
                }
              });
            } else if (qst.question_type_name == "Form" || qst.question_type_name == "Continuous Sum") {
              qst?.form_questions?.forEach((question: any, f_index: number) => {
                if (qst.old_status == 1) {
                  this.question_head.push({
                    header: qst.unique_question_num + " - " + question.choices + " - Old"
                  });
                  if (!this.columnNames.includes(qst.unique_question_num + " - " + question.choices + " - Old"))
                    this.columnNames.push(qst.unique_question_num + " - " + question.choices + " - Old")
                } else {
                  this.question_head.push({
                    header: qst.unique_question_num + " - " + question.choices
                  });
                  if (!this.columnNames.includes(qst.unique_question_num + " - " + question.choices))
                    this.columnNames.push(qst.unique_question_num + " - " + question.choices)
                }
              });
            } else if (qst.question_type_name == "Text/Media") {
              //skip text/media questions in response
            } else if (qst.old_status == 1) {
              this.question_head.push({
                header: qst.unique_question_num + " - Old"
              });
              if (!this.columnNames.includes(qst.unique_question_num + " - Old"))
                this.columnNames.push(qst.unique_question_num + " - Old")
            } else {
              this.question_head.push({
                header: qst.unique_question_num
              });
              if (!this.columnNames.includes(qst.unique_question_num))
                this.columnNames.push(qst.unique_question_num)
            }
          });
          this.getQuestionAndAnswer();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getQuestionAndAnswer() {
    this.answers = [];
    this.responses = [];
    this.loading = true;
    this.data = Object.assign(this.responses);
    this.dataSource = new MatTableDataSource(this.responses);
    let index = 0;
    this.surveyService.surveyQuestionAnswerView(this.surveyIdentifier, this.responseType, this.limit, this.offset)
      .subscribe({
        next: (res: any) => {
          this.survey_count = res.data?.survey_total_response_count;
          this.page_count = res.data?.count;
          this.survey_complete_response_count = res.data?.survey_complete_response_count;
          this.survey_disqualified_response_count = res.data?.survey_disqualified_response_count;
          this.survey_partial_response_count = res.data?.survey_partial_response_count;
          let answerResponse = res.data?.total_response;
          answerResponse?.forEach(x => {
            x.question?.forEach(qst => {
              if (qst.answer.length > 0) {
                if (qst.question_type_name == "Matrix") {
                  qst.answer?.forEach((ans: any, f_index: any) => {
                    let options = "";
                    ans?.choices?.forEach((choice: any) => {
                      if (ans.text_entry_value != "" && ans.text_entry_value != undefined) {
                        if (options == "") {
                          options = options + choice + " - " + ans.text_entry_value;
                        } else {
                          options = options + ", " + choice + " - " + ans.text_entry_value;
                        }
                      } else if (options == "") {
                        options = options + choice
                      } else {
                        options = options + ", " + choice
                      }
                    });
                    this.answers[qst.unique_question_num + " - " + ans.form_questions] = { choices: options };
                  });
                } else if (qst.question_type == 2 || qst.question_type == 3 || qst.question_type == 4) {
                  let options = "";
                  qst.answer?.forEach(ans => {
                    if (ans.text_entry_value != "" && ans.text_entry_value != undefined) {
                      if (options == "") {
                        options = options + ans.choices + " - " + ans.text_entry_value;
                      } else {
                        options = options + ", " + ans.choices + " - " + ans.text_entry_value;
                      }
                    } else if (options == "") {
                      options = options + ans.choices
                    } else {
                      options = options + ", " + ans.choices
                    }
                  });
                  let answer = { choices: options };
                  this.answers[qst.unique_question_num] = answer;
                } else if (qst.question_type_name == "Text/Media") {
                  // skip for text/media 
                } else if (qst.question_type_name == "Signature") {
                  qst.answer?.forEach(ans => {
                    this.answers[qst.unique_question_num] = { choices: ans?.choices, file: ans?.signature_file };
                  });
                } else {
                  qst.answer?.forEach((ans: any, f_index: any) => {
                    let answer: any;
                    if (ans.text_entry_value != "" && ans.text_entry_value != undefined) {
                      answer = { choices: ans.choices + " - " + ans.text_entry_value };
                    } else {
                      answer = { choices: ans.choices };
                    }
                    if (ans.form_questions != null) {
                      this.answers[qst.unique_question_num + " - " + ans.form_questions] = answer;
                    } else {
                      this.answers[qst.unique_question_num] = answer;
                    }
                  });
                }
              } else {
                let answer = { choices: "" };
                this.answers[qst.unique_question_num] = answer;
              }
            });
            index++;
            this.responses.push({
              index: index,
              id: x?.answers_response_identifier,
              response_status: x?.response_status,
              survey_live_status: x?.survey_live_status,
              answer: this.answers,
              createdDate: x?.response_added_date,
              ip: x?.response_ip,
              variables: x?.variable_list
            });
            this.answers = [];
          });
          this.dataSource = new MatTableDataSource(this.responses);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.toastr.error(error?.error?.message);
        }
      });
  }

  show(show) {
    this.showNavbar = show;
  }
  expand(show) {
    this.expNavbar = show;
  }
  downloadSurveyResponse() {
    this.isLoading = true;
    this.surveyService.surveyDownload(this.surveyIdentifier, this.responseType)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status == 200) {
            this.downloadedData = res.data.url
            window.location.href = this.downloadedData;
          } else {
            this.toastr.error('', res?.message)  //error  
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
          this.isLoading = false;
        }
      });
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

  // Google Analytics scripts
  private initializeGoogleAnalytics(analyticsKey: string): void {

    let gaScript = document.createElement('script');
    gaScript.setAttribute('async', 'true');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.GAKey}`);

    let gaScript2 = document.createElement('script');
    gaScript2.innerText = "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\\'js\\', new Date());gtag(\\'config\\', \\'${this.GAKey}\\');";

    document.head.appendChild(gaScript);
    document.head.appendChild(gaScript2);
  }
  updateResponseType(event: any) {
    this.getQuestionAndAnswer();
    //reset pagination
    this.pageIndex = 0;
  }
  applyFilter() {
    let filteredData = this.responses.filter(obj => {
      return obj.response_status == this.responseType;
    });
    this.dataSource = new MatTableDataSource(filteredData);
  }
  viewUserResponse(responseId) {
    this.surveyService.surveyAnswerDownload(this.surveyIdentifier, responseId).subscribe({
      next: (result: any) => {
        if (result?.data?.url != null)
          window.open(result?.data?.url);
      },
      error: (error: any) => {
      },
    });
  }
  deleteUserResponse(responseId) {
    let data = {
      survey_identifier: this.surveyIdentifier,
      answer_response_identifier: responseId,
      is_active: 0
    }
    let msg = 'Do you really want to delete?'
    this.deletePopupService.confirm('Please confirm', msg)
      .then((confirmed) => {
        if (confirmed) {
          this.surveyService.deleteUserResponse(data)
            .subscribe({
              next: (res: any) => {
                this.toastr.success(res?.message);
                this.getQuestionAndAnswer()
              },
              error: error => {
                this.toastr.error(error?.error?.message);
              }
            });
        }
      });

  }
}
