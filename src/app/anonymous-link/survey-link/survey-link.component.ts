import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { GoogleAnalyticsService } from 'src/app/google-analytics/google-analytics.service';
import { SurveyAnswerService } from 'src/app/shared/services/surveyAnswer.service';
export interface SurveyResponse {
  question_identifier: any,
  answer_type: any,
  choices: any
}
@Component({
  selector: 'app-survey-link',
  templateUrl: './survey-link.component.html',
  styleUrls: ['./survey-link.component.css']
})
export class SurveyLinkComponent implements OnInit {
  token: any;
  survey_identifier: any;
  progress: any = 0;
  surveyTitle: string = "";
  questions: any;
  check: any;
  answers: any;
  isSave: boolean = false;
  response: any[] = [];
  valid: any;
  pagebreakList: any;
  lastPage: boolean = false;
  varaibleSaved: boolean = false;
  started: boolean = false;
  lastquestionID: any;
  isfinish: boolean = false;
  response_code: any;
  isActive: boolean = true;
  message: any = ""
  page_no: any;
  page_order: any;
  displayLogicSet: any[] = [];
  displayLogicQuestion: any[] = [];
  errMessage: string = "Please answer this question.";
  errMessageText: string = "You have entered a text into an unselected option. Please select the option or remove the text."
  errMessageText2: string = "You have not entered a text into a selected option. Please unselect the option or enter text."
  terminate: boolean = false;
  gaAllowedno: any;
  GAKey: any;
  organizationName: any;
  panelDetails: any;
  isAddedPanelDetails: boolean = true;
  surveyClosed: boolean = false;
  surveyStarted: boolean = false;
  variables: any[] = [];
  total: any = {};
  matrixTotal: any = {};
  variables_URL: any = []
  page_terminal_status: any;
  skipLogic: any;
  page_response_status_code: any = 0;
  show_survey_title: boolean = false;
  show_question_number: boolean = false;
  trigger_email: boolean = false;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    public apiService: SurveyAnswerService,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private gaService: GoogleAnalyticsService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    let tk = this.route.snapshot.paramMap.get('id');
    this.token = tk;
  }

  ngOnInit(): void {
    this.getSurveyId();
  }

  //adding custom javascript code 
  addScriptToHead(scriptCode: string) {
    if (this.renderer) {
      const script = this.renderer.createElement('script');
      script.type = 'text/javascript';
      script.text = scriptCode;

      // Append the script to the <head> element
      this.renderer.appendChild(this.el?.nativeElement?.ownerDocument?.head, script);
    }
  }

  getSurveyId() {
    this.apiService.getSurveyUrl(this.token)
      .subscribe({
        next: (resp: any) => {
          if (resp?.data?.survey_identifier) {
            this.survey_identifier = resp?.data?.survey_identifier
            this.getSettings();
            this.getURLVariable(0, this.survey_identifier);
            if (!this.started) {//show first question
              this.setQuestion();
            } else {//show next
              this.setQuestionOnNext();
            }
          } else {
            this.isActive = false;
            this.message = resp?.message;
          }
        },
        error: (error: any) => {
          let err = '';
          if (!error.code) {
            this.toastr.error(error?.error?.message);
          }
        }
      });
  }
  getSettings() {
    this.apiService.viewSettings(this.survey_identifier)
      .subscribe({
        next: (res: any) => {
          let settings_data = res?.data?.settings_data
          if (settings_data) {
            this.trigger_email = settings_data.is_thankyou_mail;
            this.show_survey_title = settings_data.show_survey_title;
            this.show_question_number = settings_data.show_question_number;
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getSurveyRedirectLink(response_code: any) {
    this.apiService.getSurveyRedirectLinkByPagenum(this.survey_identifier, this.page_no, response_code)
      .subscribe({
        next: (resp: any) => {
          this.spinner.hide();
          let redirectLinks = resp?.data?.redirect_url;
          if (redirectLinks) {
            let replacedValue = redirectLinks;
            if (this.variables_URL.length > 0)
              replacedValue = this.replaceWithVariableValue(redirectLinks);
            window.location.replace(replacedValue);
          }
        },
        error: error => {
          this.spinner.hide();
          this.toastr.error(error?.error?.message);
        }
      });
  }
  setQuestion() {
    this.spinner.show();
    if (this.lastPage) {
      this.isfinish = true;
      //this.getSurveyRedirectLink();
    } else {
      this.apiService.surveyUserViewQuestion(this.token)
        .subscribe({
          next: (res: any) => {
            if (res.data == null || res.data?.length == 0) {
              this.isActive = false;
              this.message = res?.message;
              this.spinner.hide();
            } else {
              this.isActive = true;
              this.setSurveySettings();
              this.setQuestionView(res)
            }
            this.spinner.hide();
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  submitResponse() {
    let d = {
      id: this.survey_identifier,
      page: this.page_no,
      is_skip: this.skipLogic ? 1 : 0
    }
    if (Object.keys(this.response).length !== 0) {
      this.apiService.surveyAddAnswer(d, this.response)
        .subscribe({
          next: (res: any) => {
            this.surveyVariableResponseView(res?.data?.response_code);
            //save variable
            if (!this.varaibleSaved)
              this.saveVariables(res?.data?.response_code)
            //trigger email          
            if (this.trigger_email && this.response[0].response_status == 2) {
              let data = {
                "survey_identifier": this.survey_identifier,
                "response_code": res?.data?.response_code
              }
              this.triggerEmail(data);
            }
            this.getSurveyRedirectLink(res?.data?.response_code);
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  triggerEmail(data: any) {
    this.apiService.triggerEmail(data)
      .subscribe({
        next: (res: any) => {

        },
        error: error => {
        }
      });
  }
  setQuestionOnNext() {
    this.response = [];
    this.spinner.show();
    if (this.lastPage) {
      this.isfinish = true;
      this.spinner.hide();
      //this.getSurveyRedirectLink();
    } else {
      this.surveyUserViewQuestionOnNext(this.page_order + 1)
    }
  }
  surveyUserViewQuestionOnNext(page_order: any) {
    this.apiService.surveyUserViewQuestionOnNext(this.token, this.lastquestionID, page_order, this.response_code)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.data != null) {
            this.setQuestionView(res);
          }
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  insert(array, l, val, ind) {
    return ind >= l
      ? array.concat(val)
      : array.reduce(
        (accumulator, currentValue, i) => accumulator.concat(i === ind ? [val, currentValue] : currentValue),
        [],
      );
  }
  setQuestionView(res: any) {
    this.surveyTitle = res.data.survey_title
    this.questions = res.data.questions;
    this.page_order = res.data?.page_order;
    this.page_no = res.data?.page_no;
    this.page_response_status_code = res?.data?.page_response_status_code;
    this.skipLogic = res.data?.skip_logic;
    this.page_terminal_status = res?.data?.page_terminal_status;
    let currentCount = res.data?.total_question_count - res.data?.balance_question_count
    this.progress = currentCount == 0 ? 100 : (currentCount / res.data?.total_question_count) * 100;
    let all_empty = 0;
    this.questions?.forEach((question: any) => {
      if (question == null || question.question_identifier == undefined || question.question_identifier == "" || question.question_identifier == null) {
        //no questions
      } else {
        //replace survey variable
        question.question = this.replaceWithVariable(question.question);
        //replace piped text
        question?.piping_data?.forEach((pipe: any) => {
          question.question = this.replaceWithPipedText(question.question, pipe?.variable_pattern, pipe?.data)
        });
        all_empty++;
        question.answer = "";
        question.valid = true;
        question.active = true;
        //set default option/value
        if (question.question_type == 3) {//Radio button
          let excludeFromShuffle = question?.option?.filter(item => item.is_shuffle == false)
          question.option = question?.option?.filter(item => item.is_shuffle);
          if (excludeFromShuffle?.length > 0) {
            excludeFromShuffle?.forEach(element => {
              question.option = this.insert(question.option, question.option?.length, element, element.option_order - 1)
            });
          }
          question?.option?.forEach((option: any) => {
            if (option?.default_option == 1)
              question.answer = option?.option_identifier
          });
        } else if (question.question_type == 4) {//Drop Down
          question.answer = [];
          question?.option?.forEach((option: any) => {
            if (option?.default_option == 1)
              question.answer.push(option?.option_identifier)
          });
        } else if (question.question_type == 2) {//Check box
          let excludeFromShuffle = question?.option?.filter(item => item.is_shuffle == false)
          question.option = question?.option?.filter(item => item.is_shuffle);
          if (excludeFromShuffle?.length > 0) {
            excludeFromShuffle?.forEach(element => {
              question.option = this.insert(question.option, question.option?.length, element, element.option_order - 1)
            });
          }
          question?.option?.forEach((option: any) => {
            if (option?.default_option == 1)
              option.checked = true;
          });
        } else if (question.question_type == 1) {//Text box
          if (question.default_value != null)
            question.answer = question.default_value;
        } else if (question.question_type == 11) { //Datepicker
          question.answer = new Date();
        } else if (question.question_type == 10) {//Signature
          if (question.default_value != null)
            question.choices = question.default_value;
        } else if (question.question_type == 5 || question.question_type == 6 || question.question_type == 9) {//Matrix
          //initialisation for matrix
          let excludeFromShuffle = question?.form_questions?.filter(item => item.is_shuffle == false)
          question.form_questions = question?.form_questions?.filter(item => item.is_shuffle);
          if (excludeFromShuffle?.length > 0) {
            excludeFromShuffle?.forEach(element => {
              question.form_questions = this.insert(question.form_questions, question.form_questions?.length, element, element.form_question_order - 1)
            });
          }
          this.matrixTotal[question.question_identifier] = {}
          question?.form_questions?.forEach((item: any) => {
            item.answers = [];
            question?.matrix_option?.forEach((option: any) => {
              item.answers[option.matrix_option_identifier] = {}
              this.matrixTotal[question.question_identifier][option.matrix_option_identifier] = 0;
            });
          });
        }
      }
    });
    if (all_empty == 0 || this.questions.length == 0) {//no questions
      if (this.page_terminal_status != 1 && res.data.next_count > 0) {
        this.setQuestionOnNext();//next page
      } else {
        this.lastPage = true;//no next page; last page
        this.submitResponse();
      }
    } else {
      if (this.questions.length == 1) {
        this.questions.forEach(item => {
          this.response = [{
            question_identifier: item.question_identifier,
            answer_type: 1,
            response_code: this.response_code,
            response_status: this.page_response_status_code,
            choices: item?.answer,
            text_entry_value: item?.text_entry_value,
          }];
          if (this.page_terminal_status == 1) {
            this.terminate = true;
            this.submitResponse();
          }
        });
      }
      if (res.data.next_count <= 0) {//no next page
        this.lastPage = true;
      } else {
        this.lastquestionID = this.questions[this.questions.length - 1].question_identifier;
        this.lastPage = false;
      }
      this.questions.forEach(x => {
        if (x.question_logical_data?.length > 0) {
          let question_logical_data = x?.question_logical_data;
          question_logical_data?.forEach((grouplogic) => {
            if (grouplogic?.group_condition_logic == "True") {
              grouplogic?.question_logical_data?.forEach((logic) => {
                if (logic?.parent_question_page_no == logic?.condition_question_page_no) {
                  x.active = false;
                  this.displayLogicQuestion.push(x)
                }
              });
            }
          });
        } else {
          x.active = true;
        }
        this.addScriptToHead(x.javascript);
      });
      let ch = this.questions.filter((x: any) => { return x.active == true });
      if (ch == 0) {
        this.setQuestionOnNext();
      } else {
        this.surveyStarted = true;
      }
    }
  }

  private surveyVariableResponseView(response_code: any) {
    this.apiService.surveyVariableResponseView(this.survey_identifier, response_code)
      .subscribe({
        next: (res: any) => {
          this.variables = res.data;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }
  private getURLVariable(pg: any, qstn: any) {
    this.apiService.getSurveyVariables(pg, this.survey_identifier)
      .subscribe({
        next: (res: any) => {
          res?.data?.forEach(x => {
            if (x?.value == "") {
              this.route.queryParams.subscribe((query: Params) => {
                if (query[x?.variables])
                  this.variables_URL.push(
                    {
                      variable_value: query[x?.variables],
                      variables: x?.variables,
                      variable_identifier: x?.variable_identifier,
                    }
                  );
              });
            } else {
              this.variables_URL.push(
                {
                  variable_value: x?.value,
                  variables: x?.variables,
                  variable_identifier: x?.variable_identifier,
                }
              );
            }
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }
  signature(event: any, question: any) {
    question.choices = event?.name;
    question.signature_file = event?.signature_file;
  }
  setAnswersSurvey() {
    this.valid = this.requiredValidation();
    let surveyStatus = 0;
    if (this.valid) {
      this.response = [];
      this.questions.forEach((question: any) => {
        if (question.question_type == 5 ||
          question.question_type == 9) {//Form, Continuous sum
          question.form_questions.forEach((item: any) => {
            this.response.push(
              {
                question_identifier: question.question_identifier,
                answer_type: 1,
                response_code: this.response_code,
                response_status: surveyStatus,
                form_identifier: item.form_identifier,
                text_entry_value: item.text_entry_value,
                choices: item.answer,
              }
            );
          });
        } else if (question.question_type == 6) {//Matrix
          let matrixOption: any;
          question.form_questions.forEach((item: any) => {
            if (question.matrix_question_type == 2) {//Check Box
              question.matrix_option?.forEach((x: any) => {
                if (item.answers[x.matrix_option_identifier].checked) {
                  this.response.push(
                    {
                      question_identifier: question.question_identifier,
                      answer_type: 1,
                      response_code: this.response_code,
                      response_status: surveyStatus,
                      form_identifier: item.form_identifier,
                      matrix_option_identifier: x.matrix_option_identifier,
                      choices: x.matrix_options,
                      text_entry_value: item.answers[x.matrix_option_identifier].text_entry_value
                    }
                  );
                }
              });
            } else if (question.matrix_question_type == 7 ||
              question.matrix_question_type == 1 ||
              question.matrix_question_type == 9) {
              question.matrix_option?.forEach((x: any) => {
                if (item.answers[x.matrix_option_identifier].answer) {
                  this.response.push(
                    {
                      question_identifier: question.question_identifier,
                      answer_type: 1,
                      response_code: this.response_code,
                      response_status: surveyStatus,
                      form_identifier: item.form_identifier,
                      matrix_option_identifier: x.matrix_option_identifier,
                      choices: item.answers[x.matrix_option_identifier].answer,
                      text_entry_value: item.answers[x.matrix_option_identifier].text_entry_value
                    }
                  );
                }
              });
            } else {
              if (item.answer != undefined && item.answer != "") {
                question.matrix_option?.forEach((x) => {
                  if (x.matrix_option_identifier == item.answer) {
                    matrixOption = x.matrix_options
                  }
                });
                this.response.push(
                  {
                    question_identifier: question.question_identifier,
                    answer_type: 1,
                    response_code: this.response_code,
                    response_status: surveyStatus,
                    form_identifier: item.form_identifier,
                    matrix_option_identifier: item.answer,
                    choices: matrixOption,
                    text_entry_value: item.text_entry_value,
                  }
                );
              }
            }
            if (this.response.length == 0) {
              this.response.push(
                {
                  question_identifier: question.question_identifier,
                  answer_type: 1,
                  response_code: this.response_code,
                  response_status: surveyStatus,
                  choices: '',
                }
              );
            }
          });
        } else if (question.question_type == 2) {//Checkbox
          let option: any[] = []; //selected checkbox options seperated by ,
          question.option.forEach((item) => {
            if (item.checked) {
              //Adding options as array
              option.push({
                option: item.choices,
                option_identifier: item.option_identifier,
                text_entry_value: item.text_entry_value ?? null
              });
            }
          });
          this.response.push(
            {
              question_identifier: question.question_identifier,
              answer_type: 1,
              response_code: this.response_code,
              response_status: surveyStatus,
              choices: option,
            }
          );
        } else if (question.question_type == 8) {//Text/Media
          surveyStatus = this.page_response_status_code;
          this.response.push(
            {
              question_identifier: question.question_identifier,
              answer_type: 1,
              response_code: this.response_code,
              response_status: surveyStatus,
              choices: question.answer,
              text_entry_value: question.text_entry_value || null,
            }
          );
        } else if (question.question_type == 3) {//Radio Button
          let choices = "";
          question.option.forEach((item) => {
            if (question.answer == item.option_identifier) {
              choices = item?.choices;
              if (item.text_entry == 1) {
                if (item.text_entry_value != "") {
                  question.text_entry_value = item.text_entry_value
                }
              }
            }
          });
          this.response.push(
            {
              question_identifier: question.question_identifier,
              answer_type: 1,
              response_code: this.response_code,
              response_status: surveyStatus,
              choices: choices,
              option_identifier: question.answer,
              text_entry_value: question.text_entry_value,
            }
          );

        } else if (question.question_type == 4) {//Drop down
          let option: any[] = []; //selected options seperated by ,
          question.answer?.forEach((answer) => {
            question.option?.forEach((item) => {
              if (answer == item.option_identifier) {
                option.push({
                  option: item.choices,
                  option_identifier: item.option_identifier,
                  text_entry_value: item.text_entry_value ?? null
                });
              }
            });
          });
          this.response.push(
            {
              question_identifier: question.question_identifier,
              answer_type: 1,
              response_code: this.response_code,
              response_status: surveyStatus,
              choices: option,
            }
          );
        } else if (question.question_type == 10) {//Signature
          this.response.push(
            {
              question_identifier: question.question_identifier,
              answer_type: 1,
              response_code: this.response_code,
              response_status: surveyStatus,
              choices: question?.choices,
              signature_file: question.signature_file,
              text_entry_value: question.text_entry_value,
            }
          );
        } else {
          this.response.push(
            {
              question_identifier: question.question_identifier,
              answer_type: 1,
              response_code: this.response_code,
              response_status: surveyStatus,
              choices: question.answer,
              text_entry_value: question.text_entry_value,
            }
          );
        }
      });
      let d = {
        id: this.survey_identifier,
        page: this.page_no,
        is_skip: this.skipLogic ? 1 : 0
      }
      this.spinner.show();
      this.apiService.surveyAddAnswer(d, this.response)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            this.surveyVariableResponseView(res?.data?.response_code)
            //save variable
            if (!this.varaibleSaved)
              this.saveVariables(res?.data?.response_code)
            if (!this.started) {
              this.response_code = res.data.response_code;
              this.organizationName = res.data.organization_name;
            }
            this.started = true;
            if (res.data.skip_details != "False" &&
              res.data.skip_details != undefined &&
              res.data.skip_details != "") {
              this.page_no = res.data.skip_details.page_number;
              this.page_order = res.data.skip_details.page_order;
              this.surveyUserViewQuestionOnNext(this.page_order)
            } else {
              this.setQuestionOnNext();
            }
          },
          error: error => {
            this.spinner.hide();
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  saveVariables(response_code: any) {
    let data = this.variables_URL;
    this.apiService.surveyVariableResponse(data, this.survey_identifier, response_code)
      .subscribe({
        next: (res: any) => {
          this.varaibleSaved = true;
        },
        error: error => {
          this.spinner.hide();
          this.toastr.error(error?.error?.message);
        }
      });
  }

  requiredValidation() {
    let isValid = true;
    this.questions.forEach((question) => {
      /* resetting the error variables STARTS */
      question.valid = true;
      question.custom_validation_message = question.custom_validation_message || this.errMessage;
      question.option_required_error = false;
      question.option_required = []
      /* resetting the error variables ENDS */

      if (question.active) {
        question.valid = true;
        //text entry validation
        //Check Box
        //Radio Button
        //Drop down
        if (question.question_type == 2 ||
          question.question_type == 3 ||
          question.question_type == 4
        ) {
          question.option.forEach((item: any) => {
            let isItemselected = false;
            if (question.question_type == 2) {
              isItemselected = item.checked
            } else if (question.question_type == 4) {
              if (question.answer?.includes(item.option_identifier))
                isItemselected = true
            } else if (question.question_type == 3) {
              if (item.option_identifier == question.answer)
                isItemselected = true
            }
            if (isItemselected && item.text_entry == 1) {//selected item
              if (item.text_entry_value == "" ||
                item.text_entry_value == undefined) { //text entry validation
                if (item.is_required_text_entry == 1) {
                  question.valid = false;
                  isValid = false;
                  question.custom_validation_message = this.errMessageText2;
                  return isValid;
                }
              } else {
                let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 4 })
                if (!this.checkAllowTextValidation(validation_data, item.text_entry_value)) {
                  isValid = false;
                  item.valid = false;
                  question.valid = false;
                  question.custom_validation_message = '';
                  return isValid;
                }
              }
            } else if (!isItemselected && item.text_entry == 1 &&
              item.text_entry_value != "" &&
              item.text_entry_value != undefined) {
              question.valid = false;
              item.valid = false;
              isValid = false;
              question.custom_validation_message = this.errMessageText;
              return isValid;
            }
            return isValid;
          });
        } else if (question.question_type == 6) {//Matrix
          question.form_questions?.forEach((item: any) => {
            item.valid = true;
            question.matrix_option?.forEach((option) => {
              let isNotAnswered: boolean;
              option.valid = true;
              if (question.matrix_question_type == null || question.matrix_question_type == 3) {//Radio Button
                isNotAnswered = item.answer == undefined || item.answer == null;
              } else if (question.matrix_question_type == 2) {//Check Box
                isNotAnswered = (item.answers[option.matrix_option_identifier].checked == undefined ||
                  !item.answers[option.matrix_option_identifier].checked ||
                  item.answers[option.matrix_option_identifier].checked == null)
              } else {
                if (question.matrix_question_type != 9)
                  item.answers[option.matrix_option_identifier].answer = item.answers[option.matrix_option_identifier].answer?.trim();
                isNotAnswered = (item.answers[option.matrix_option_identifier].answer == 0 ||
                  item.answers[option.matrix_option_identifier].answer == undefined ||
                  item.answers[option.matrix_option_identifier].answer == null)
              }
              if (!isNotAnswered) {
                if (item.text_entry == 1 && item.is_required_text_entry == 1 &&
                  (item.text_entry_value == "" ||
                    item.text_entry_value == undefined)) {
                  question.valid = false;
                  item.valid = false;
                  item.message = "Please specify text"
                  isValid = false;
                  return isValid;
                }
                //question validation
                let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
                if (!this.checkAllowTextValidation(validation_data, item.answers[option.matrix_option_identifier].answer)) {
                  item.valid = false;
                  isValid = false;
                  question.valid = false;
                  option.valid = false;
                  return isValid;
                } else {
                  //item validation
                  let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 2 })
                  if (!this.checkAllowTextValidation(validation_data, item.answers[option.matrix_option_identifier].answer)) {
                    item.valid = false;
                    isValid = false;
                    question.valid = false;
                    option.valid = false;
                    return isValid;
                  }
                }
              } else {
                if (item.text_entry == 1 &&
                  item.text_entry_value != "" &&
                  item.text_entry_value != undefined) {
                  question.valid = false;
                  item.valid = false;
                  isValid = false;
                  return isValid;
                }
              }
              return isValid;
            });
          });
        } else if (question.question_type == 5 || question.question_type == 9) { //answer format validation  //form         
          question.form_questions.forEach((item) => {
            item.valid = true;
            if (question.question_type == 5)
              item.answer = item.answer?.trim();
            if (item.answer == '' || item.answer == undefined || item.answer == null) {
              // not answered            
            } else {
              //question validation
              let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
              if (!this.checkAllowTextValidation(validation_data, item.answer)) {
                item.valid = false;
                isValid = false;
                question.valid = false;
                return isValid;
              } else {
                //item validation
                let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 2 })
                if (!this.checkAllowTextValidation(validation_data, item.answer)) {
                  item.valid = false;
                  isValid = false;
                  question.valid = false;
                  return isValid;
                }
              }
            }
            return isValid;
          });
        } else if (question.question_type == 1 || question.question_type == 7) {//text box
          question.answer = question.answer?.trim()
          if (question.answer == '' || question.answer == undefined || question.answer == null) {
          } else {
            let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
            if (!this.checkAllowTextValidation(validation_data, question.answer)) {
              isValid = false;
              question.valid = false;
              return isValid;
            }
          }
        } else if (question.question_type == 11) {
          if (question.answer == '' || question.answer == undefined || question.answer == null) {
          } else {
            let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
            if (!this.checkAllowTextValidation(validation_data, question.answer)) {
              isValid = false;
              question.valid = false;
              return isValid;
            }
          }
        }
        //required validation
        let ans_count = 0;
        if (question.required_status == 1) {
          if (question.question_type == 5 ||
            question.question_type == 9) {//Form, Continuous Sum
            //option answer required validation
            ans_count = 0;
            question.form_questions.forEach((item) => {
              if (item?.answer?.toString() == '' || item?.answer == undefined || item.answer == null) {
                if (item.required_status == 1) {
                  isValid = false;
                  question.valid = false;
                  question.option_required_error = true;
                  if (!question.option_required.includes(item.choices))
                    question.option_required.push(item.choices);
                  return isValid;
                }
              } else {
                ans_count++;
                //question validation
                let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
                if (!this.checkAllowTextValidation(validation_data, item.answer)) {
                  item.valid = false;
                  isValid = false;
                  question.valid = false;
                  return isValid;
                } else {
                  //item validation
                  let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 1 })
                  if (!this.checkAllowTextValidation(validation_data, item.answer)) {
                    item.valid = false;
                    isValid = false;
                    question.valid = false;
                    return isValid;
                  }
                }
              }
              return isValid;
            });
            if (ans_count == 0) {
              isValid = false;
              question.valid = false;
              question.option_required_error = true;
              return isValid;
            }
          } else if (question.question_type == 6) {//Matrix
            ans_count = 0;
            question.form_questions?.forEach((item: any) => {
              let choiceAnswered = 0;
              question.matrix_option?.forEach((option) => {
                let isNotAnswered: boolean;
                let optionanswered = 0;
                if (question.matrix_question_type == null || question.matrix_question_type == 3) {//Radio Button
                  isNotAnswered = item.answer == undefined || item.answer == null;
                } else if (question.matrix_question_type == 2) {//Check Box
                  isNotAnswered = (item.answers[option.matrix_option_identifier].checked == undefined ||
                    !item.answers[option.matrix_option_identifier].checked ||
                    item.answers[option.matrix_option_identifier].checked == null)
                } else {
                  isNotAnswered = (item.answers[option.matrix_option_identifier].answer == 0 ||
                    item.answers[option.matrix_option_identifier].answer == undefined ||
                    item.answers[option.matrix_option_identifier].answer == null)
                  if (!isNotAnswered) {
                    //question validation
                    let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
                    if (!this.checkAllowTextValidation(validation_data, item.answers[option.matrix_option_identifier].answer)) {
                      item.valid = false;
                      isValid = false;
                      question.valid = false;
                      option.valid = false;
                      return isValid;
                    } else {
                      //item validation
                      let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 2 })
                      if (!this.checkAllowTextValidation(validation_data, item.answers[option.matrix_option_identifier].answer)) {
                        item.valid = false;
                        isValid = false;
                        question.valid = false;
                        option.valid = false;
                        return isValid;
                      }
                    }
                  }
                }
                if (isNotAnswered) {
                  if (item.required_status == 1 || option.required_status == 1) {
                    isValid = false;
                    question.valid = false;
                    item.valid = false;
                    question.option_required_error = true;
                    if (item.required_status == 1) {
                      if (!question.option_required.includes(item.choices))
                        question.option_required.push(item.choices);
                    } else {
                      if (!question.option_required.includes(option.matrix_options))
                        question.option_required.push(option.matrix_options);
                    }
                    return isValid;
                  }
                } else {
                  choiceAnswered++;
                  ans_count++;
                  optionanswered++;
                }
                return isValid
              });
              if (item.required_status == 1 && choiceAnswered == 0) {
                isValid = false;
                question.valid = false;
                item.valid = false;
                question.option_required_error = true;
                if (!question.option_required.includes(item.choices))
                  question.option_required.push(item.choices);
                return isValid;
              }
              //min & max answer count validation
              let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_type == 7 })
              if (validation_data?.length > 0) {
                let validation = validation_data[0];
                let min = Number(validation.min)
                let max = Number(validation.max)
                if ((validation.min != null && min > 0) || (validation.max != null && max > 0)) {
                  if ((choiceAnswered < min && min > 0) ||
                    (choiceAnswered > max && max > 0)) {
                    isValid = false;
                    question.valid = false;
                    validation.isValid = false;
                    validation.message = validation.message || 'Please enter  ' + (min || 'no') + " minimum answers and  " + (max || 'no') + " maximum answers"
                    return isValid;
                  }
                }
              }
              if (question.valid) {
                let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_type == 7 })
                if (validation_data?.length > 0) {
                  let validation = validation_data[0];
                  let min = Number(validation.min)
                  let max = Number(validation.max)
                  if (min > 0 || max > 0) {
                    if ((choiceAnswered < min && min > 0) ||
                      (choiceAnswered > max && max > 0)) {
                      isValid = false;
                      question.valid = false;
                      validation.isValid = false;
                      validation.message = validation.message || 'Please enter  ' + (min || 'no') + " minimum answers and  " + (max || 'no') + " maximum answers"
                      return isValid;
                    }
                  }
                }
              }
              return isValid;
            });
            if (ans_count == 0) {
              isValid = false;
              question.valid = false;
              return isValid;
            }
          } else if (question.question_type == 2) {//Check Box
            ans_count = 0;
            question.option.forEach((item) => {
              if (item.checked) {
                ans_count++;
              }
            });
            if (ans_count == 0) {
              isValid = false;
              question.valid = false;
              return isValid;
            }
          } else if (question.question_type == 4 && question.is_multiple) {//Multi select dropdown
            if (question?.answer?.length == 0) {
              isValid = false;
              question.valid = false;
              return isValid;
            }
          } else if (question.question_type == 8) {//Text/Media
          } else if (question.question_type == 10) {//Signature
            if (question.signature_file == undefined || question.choices == undefined || question.choices == "") {
              isValid = false;
              question.valid = false;
              return isValid;
            }
          } else if (question.answer == '' || question.answer == undefined ||
            question.answer == null) {
            isValid = false;
            question.valid = false;
            return isValid;
          }
        }
        //must total validation
        if (question.question_type == 9) {//Continuous Sum 
          let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_type == 5 })
          if (validation_data?.length > 0) {
            let validation = validation_data[0];
            let max = Number(validation.max)
            if (ans_count > 0 && this.total[question?.question_identifier] != max) {
              question.valid = false;
              isValid = false;
              validation.isValid = false;
              validation.message = validation.message || 'Total value must be equal to ' + max;
              return isValid;
            }
          }
        }
        if (question.matrix_question_type == 9) {//Continuous Sum         
          //must total validation
          let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_type == 5 })
          if (validation_data?.length > 0) {
            let validation = validation_data[0];
            let max = Number(validation.max)
            if (ans_count > 0) {
              question.matrix_option?.forEach((option: any) => {
                if (this.matrixTotal[question.question_identifier][option?.matrix_option_identifier] != max) {
                  question.valid = false;
                  isValid = false;
                  validation.isValid = false;
                  validation.message = validation.message || 'Total value must be equal to ' + max
                  return isValid;
                }
                return isValid;
              });
            }
          }
        }
        //min & max answer count validation
        let validation_data = question?.validation_data?.filter((validation: any) => { return validation.validation_type == 7 })
        if (validation_data?.length > 0) {
          let validation = validation_data[0];
          let min = Number(validation.min)
          let max = Number(validation.max)
          if (min > 0 || max > 0) {
            if ((ans_count < min && min > 0) ||
              (ans_count > max && max > 0)) {
              isValid = false;
              question.valid = false;
              validation.isValid = false;
              validation.message = validation.message || 'Please enter  ' + (min || 'no') + " minimum answers and  " + (max || 'no') + " maximum answers";
              return isValid;
            }
          }
        }
      }
      return isValid
    });
    return isValid;
  }
  // 0-questions,1-option, 2-forms_question, 3-matrix_option, 4-text entry, 5-form_options
  checkAllowTextValidation(validation_data: any, value: string) {
    let isValid = true;
    validation_data = validation_data?.sort((a: { priority: number }, b: { priority: number }) =>
      b.priority - a.priority);
    if (validation_data) {
      validation_data?.forEach((validation: any) => {
        if (isValid) {
          validation.isValid = validation.isValid || true;
          switch (validation.validation_type) {
            case 2:
              //  Number validation
              let num = Number(value);
              if (num != 0) {
                if (!num) {
                  validation.isValid = false;
                  isValid = false;
                  validation.message = validation.message || 'Please enter valid number'
                  return isValid;
                }
              }
              break;
            case 3:
              //  Date validation
              if (validation.value) {
                let result = moment(value, validation?.value, true).isValid();
                if (!result) {
                  validation.isValid = false
                  isValid = false;
                  validation.message = validation.message || 'Please enter a valid date in the format ' + validation?.value;
                  return isValid;
                }
              }
              break;
            case 4:
              //email validation
              if (!RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).exec(value)) {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid email'
                return isValid;
              }
              break;
            case 6:
              //Regex
              if (!RegExp(validation.value).exec(value)) {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid value'
                return isValid;
              }
              break;
            case 9://range
              let min = Number(validation.min);
              let max = Number(validation.max);
              let val = Number(value);
              if (val || val == 0) {
                if ((validation.min != null && val < min) || (validation.max != null && val > max)) {
                  validation.isValid = false;
                  isValid = false;
                  validation.message = validation.message || 'Please enter number not less than ' + min + ' greater than ' + max
                  return isValid;
                }
              } else {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid number'
                return isValid;
              }
              break;
            case 10:
              //Text only
              if (!RegExp(/^[A-Za-z]+/).exec(value)) {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid text'
                return isValid;
              }
              break;
            case 13:
              //US phone number
              if (!RegExp(/^\d{10}$/).exec(value)) {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid phone number'
                return isValid;
              }
              break;
            case 14:
              //US postal code
              if (!RegExp(/^\d{5}$/).exec(value)) {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid zip code'
                return isValid;
              }
              break;
            default:
              break;
          }
          return validation.isValid;
        }
      });
    }
    return isValid;
  }

  displayLogicCheck(question: any) {
    let valid = false;
    let i = 1;
    question?.question_logical_data?.forEach(group => {
      group?.question_logical_data?.forEach(x => {
        if (x.logical_operators_type == 1) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.field_value == x.condition_question_answer) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.field_value == x.condition_question_answer)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (x.field_value == x.condition_question_answer) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.field_value == x.condition_question_answer)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 2) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.field_value != x.condition_question_answer) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.field_value != x.condition_question_answer)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (x.field_value != x.condition_question_answer) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.field_value != x.condition_question_answer)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 3) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (parseInt(x.field_value) < parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (parseInt(x.field_value) < parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else
            if (i == 1) {
              if (parseInt(x.field_value) < parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else {
              if (valid || (parseInt(x.field_value) < parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            }
        } else if (x.logical_operators_type == 4) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (parseInt(x.field_value) <= parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (parseInt(x.field_value) <= parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else {
            if (i == 1) {
              if (parseInt(x.field_value) <= parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else {
              if (valid || (parseInt(x.field_value) <= parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            }
          }
        } else if (x.logical_operators_type == 5) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (parseInt(x.field_value) > parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (parseInt(x.field_value) > parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }

          } else {
            if (i == 1) {
              if (parseInt(x.field_value) > parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else {
              if (valid || (parseInt(x.field_value) > parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            }
          }
        } else if (x.logical_operators_type == 6) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (parseInt(x.field_value) >= parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (parseInt(x.field_value) >= parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (parseInt(x.field_value) >= parseInt(x.condition_question_answer)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (parseInt(x.field_value) >= parseInt(x.condition_question_answer))) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 7) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.condition_question_answer == "" || x.condition_question_answer == undefined) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.condition_question_answer == "" || x.condition_question_answer == undefined)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (x.condition_question_answer == "" || x.condition_question_answer == undefined) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.condition_question_answer == "" || x.condition_question_answer == undefined)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 8) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.condition_question_answer != "" && x.condition_question_answer != undefined) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.condition_question_answer != "" && x.condition_question_answer != undefined)) {
              valid = true;
            } else {
              valid = false;
            }

          } else if (i == 1) {
            if (x.condition_question_answer != "" && x.condition_question_answer != undefined) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.condition_question_answer != "" && x.condition_question_answer != undefined)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 9 && x.question_type == 2 ||
          (x.logical_operators_type == 10 && x.question_type == 2)
        ) {//Check Box
          let ch = false;
          x.condition_question_answer.forEach(ans => {
            if (ans.option == x.condition_question_option) {
              ch = true;
            }
          });
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (ch) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && ch) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (ch) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || ch) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 9 && x.question_type == 6) {//Matrix
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.condition_question_answer == x.condition_matrix_option_value) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.condition_question_answer == x.condition_matrix_option_value)) {
              valid = true;
            } else {
              valid = false;
            }

          } else if (i == 1) {
            if (x.condition_question_answer == x.condition_matrix_option_value) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.condition_question_answer == x.condition_matrix_option_value)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 10 && x.question_type == 6) {//Matrix
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.condition_question_answer != x.condition_matrix_option_value) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.condition_question_answer != x.condition_matrix_option_value)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (x.condition_question_answer != x.condition_matrix_option_value) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.condition_question_answer != x.condition_matrix_option_value)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 9) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.condition_question_answer == x.condition_question_option) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.condition_question_answer == x.condition_question_option)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (x.condition_question_answer == x.condition_question_option) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.condition_question_answer == x.condition_question_option)) {
            valid = true;
          } else {
            valid = false;
          }
        } else if (x.logical_operators_type == 10) {
          if (x.logical_condition == "And") {
            if (i == 1) {
              if (x.condition_question_answer != x.condition_question_option) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid && (x.condition_question_answer != x.condition_question_option)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (i == 1) {
            if (x.condition_question_answer != x.condition_question_option) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (valid || (x.condition_question_answer != x.condition_question_option)) {
            valid = true;
          } else {
            valid = false;
          }
        }
        i++;
      });
    });
    question.active = valid;
  }
  calculateSum(question: any) {
    this.total[question?.question_identifier] = 0;
    question?.form_questions.forEach((element: any) => {
      if (element?.answer)
        this.total[question?.question_identifier] = this.total[question?.question_identifier] + element?.answer;
    })
    return this.total[question?.question_identifier];
  }
  calculateMatrixSum(question: any) {
    question.matrix_option?.forEach((option: any) => {
      this.matrixTotal[question.question_identifier][option.matrix_option_identifier] = 0;
    });
    question?.form_questions.forEach((element: any) => {
      question.matrix_option?.forEach((option: any) => {
        if (element?.answers[option.matrix_option_identifier]?.answer) {
          this.matrixTotal[question.question_identifier][option.matrix_option_identifier] = this.matrixTotal[question.question_identifier][option.matrix_option_identifier] + element?.answers[option.matrix_option_identifier]?.answer;
        }
      });
    })
    return this.matrixTotal[question?.question_identifier];
  }
  showValue(q: any, checkboxSelected: any = []) {
    /*  if (!this.checkAllowTextValidation(q?.validation_data, q.answer)) {
       q.valid = false;
       q.valid = false;
     } */
    if (q.question_type == 2) {//Check Box
      q.option.forEach(n => {
        if (checkboxSelected.is_exclusive == 1 && checkboxSelected.checked) {
          if (n.checked && n.choices != checkboxSelected.choices) {
            n.checked = false;
          }
        } else if (checkboxSelected.checked) {
          if (n.is_exclusive == 1) {
            n.checked = false;
          }
        }
      });
    }
    if (q.question_type == 9) {//Continuous Sum
      this.calculateSum(q)
    }
    if (q.matrix_question_type == 9) {//Continuous Sum
      this.calculateMatrixSum(q)
    }
    let qst = this.displayLogicQuestion;
    //set display logic question answer
    qst.forEach(m => {
      if (q != "" || q?.length > 0) {
        m?.question_logical_data?.forEach(grouplogic => {
          grouplogic?.question_logical_data?.forEach(k => {
            if (k.question_identifer == q.question_identifer) {
              if (k.question_type == 2) {//Check Box
                k.condition_question_answer = undefined;
                q.option.forEach(n => {
                  if (n.checked) {
                    if (n.choices == k.condition_question_option) {
                      k.condition_question_answer = n.choices;
                    }
                  }
                });
              } else if (k.question_type == 5 ||
                k.question_type == 9 ||
                k.question_type == 6) {//Form, Continuous Sum, Matrix
                q.form_questions.forEach(n => {
                  if (k.form_identifier == n.form_identifier) {
                    k.condition_question_answer = n.answer;
                  }
                });
              } else {
                k.condition_question_answer = q.answer;
              }
            }
          });
        });
      }
      let valid = false;
      let i = 1;
      m?.question_logical_data?.forEach(grouplogic => {
        grouplogic?.question_logical_data?.forEach(x => {
          if (x.logical_operators_type == 1) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.field_value == x.condition_question_answer) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.field_value == x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (x.field_value == x.condition_question_answer) {
                valid = true;
              } else {
                valid = false;

              }
            } else if (valid || (x.field_value == x.condition_question_answer)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 2) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.field_value != x.condition_question_answer) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.field_value != x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (x.field_value != x.condition_question_answer) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.field_value != x.condition_question_answer)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 3) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (parseInt(x.field_value) < parseInt(x.condition_question_answer)) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (parseInt(x.field_value) < parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (parseInt(x.field_value) < parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (parseInt(x.field_value) < parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 4) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (parseInt(x.field_value) <= parseInt(x.condition_question_answer)) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (parseInt(x.field_value) <= parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (parseInt(x.field_value) <= parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (parseInt(x.field_value) <= parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 5) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (parseInt(x.field_value) > parseInt(x.condition_question_answer)) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (parseInt(x.field_value) > parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (parseInt(x.field_value) > parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (parseInt(x.field_value) > parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 6) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (parseInt(x.field_value) >= parseInt(x.condition_question_answer)) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (parseInt(x.field_value) >= parseInt(x.condition_question_answer))) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (parseInt(x.field_value) >= parseInt(x.condition_question_answer)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (parseInt(x.field_value) >= parseInt(x.condition_question_answer))) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 7) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.condition_question_answer == "" || x.condition_question_answer == undefined) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.condition_question_answer == "" || x.condition_question_answer == undefined)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (x.condition_question_answer == "" || x.condition_question_answer == undefined) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.condition_question_answer == "" || x.condition_question_answer == undefined)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 8) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.condition_question_answer != "" && x.condition_question_answer != undefined) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.condition_question_answer != "" && x.condition_question_answer != undefined)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (x.condition_question_answer != "" && x.condition_question_answer != undefined) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.condition_question_answer != "" && x.condition_question_answer != undefined)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 9 && x.question_type == 6) {//Matrix
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.condition_question_answer == x.condition_matrix_option_value) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.condition_question_answer == x.condition_matrix_option_value)) {
                valid = true;
              } else {
                valid = false;

              }
            } else if (i == 1) {
              if (x.condition_question_answer == x.condition_matrix_option_value) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.condition_question_answer == x.condition_matrix_option_value)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 10 && x.question_type == 6) {//Matrix
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.condition_question_answer != x.condition_matrix_option_value) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.condition_question_answer != x.condition_matrix_option_value)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (x.condition_question_answer != x.condition_matrix_option_value) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.condition_question_answer != x.condition_matrix_option_value)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 9) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.condition_question_answer == x.condition_question_option) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.condition_question_answer == x.condition_question_option)) {
                valid = true;
              } else {
                valid = false;

              }
            } else if (i == 1) {
              if (x.condition_question_answer == x.condition_question_option) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.condition_question_answer == x.condition_question_option)) {
              valid = true;
            } else {
              valid = false;
            }
          } else if (x.logical_operators_type == 10) {
            if (x.logical_condition == "And") {
              if (i == 1) {
                if (x.condition_question_answer != x.condition_question_option) {
                  valid = true;
                } else {
                  valid = false;
                }
              } else if (valid && (x.condition_question_answer != x.condition_question_option)) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (i == 1) {
              if (x.condition_question_answer != x.condition_question_option) {
                valid = true;
              } else {
                valid = false;
              }
            } else if (valid || (x.condition_question_answer != x.condition_question_option)) {
              valid = true;
            } else {
              valid = false;
            }
          }
          i++;
        });
      });


      m.active = valid;
    });
  }
  setSurveySettings() {
    this.gaAllowedno = localStorage.getItem('gaAllowed');
    this.GAKey = this.gaService.getAnalyticsKey();
    if (this.GAKey != undefined && this.GAKey != "") {
      this.apiService.surveySettings(this.survey_identifier)
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
  }
  // Google Analytics scripts
  private initializeGoogleAnalytics(analyticsKey: string): void {
    let gaScript = document.createElement('script');
    gaScript.setAttribute('async', 'true');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${analyticsKey}`);

    let gaScript2 = document.createElement('script');
    gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${analyticsKey}\');`;

    document.head.appendChild(gaScript);
    document.head.appendChild(gaScript2);
  }

  replaceWithVariable(inputText: string): string {
    this.spinner.hide();
    const pattern = /\$\(var\(([^)]*)\)\)/g;
    let replacementValue = "";
    const replacedText = inputText.replace(pattern, (match, capturedValue) => {
      let data = this.variables.filter((x: any) => {
        return x.variable_name == capturedValue
      });
      data?.forEach(element => {
        replacementValue = replacementValue + " " + element?.variable_value;
      });
      return replacementValue?.replace('***', capturedValue);
    });
    return replacedText;
  }
  replaceWithPipedText(question: any, pattern: string, replacementValue: any): string {
    const replacedText = question?.replaceAll(pattern, " " + replacementValue);
    return replacedText;
  }
  replaceWithVariableValue(inputText: string): string {
    const pattern = /\$\(var\(([^)]*)\)\)/g;
    let replacementValue = "";
    const replacedText = inputText.replace(pattern, (match, capturedValue) => {
      let data = this.variables_URL?.filter((x: any) => { return x.variables == capturedValue });
      replacementValue = data[0]?.variable_value;
      return replacementValue?.replace('***', capturedValue);
    });
    return replacedText;
  }
}