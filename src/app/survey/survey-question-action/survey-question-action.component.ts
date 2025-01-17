import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-survey-question-action',
  templateUrl: './survey-question-action.component.html',
  styleUrls: ['./survey-question-action.component.css']
})
export class SurveyQuestionActionComponent implements OnInit {
  @Output() upload = new EventEmitter();
  currentUser: any;
  onClose: any;
  expNavbar: boolean = true;
  questions: any[] = [];
  loading: boolean = true;
  carry_forward_questions: any[] = [];
  pipeCondition: any;
  p_question: any;
  pipeValid: boolean = false;
  showCarryForward: boolean = false;
  question_type: any;
  matrix_question_type: any;
  question: any;
  conditionList: any = [];
  pipingData: any = {};
  textValid: boolean = false;
  answerFormat: any[] = [];
  validationTypes: any[] = [];
  validation_field: any = {};
  answerFormatValue: any;

  constructor(
    private surveyService: SurveyService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<SurveyQuestionActionComponent>,
    public spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.showCarryForward = (data.question_type == 2 || data.question_type == 3 || data.question_type == 4)
  }

  ngOnInit(): void {
    this.getQuestionList();
    this.getQuestion();
    this.getQuestionPiping();
    this.viewPiping();
  }

  expand(show: any) {
    this.expNavbar = show;
  }

  closeDialog() {
    this._mdr.close()
  }
  getQuestion() {
    this.surveyService.getQuestionView(this.data.question_identifier)
      .subscribe({
        next: (res: any) => {
          res.data.forEach(k => {
            this.question = k;
            if (!this.question.custom_validation_message)
              this.question.custom_validation_message = "Please answer this question";
            let q = k.question_type;
            this.matrix_question_type = k.matrix_question_type;
            this.question_type = q;
            this.getValidationTypes(q);
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getValidationTypes(q_type: any) {
    this.spinner.show();
    this.answerFormat = [];
    this.validationTypes = [];
    this.surveyService.getValidationTypes(q_type)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.answerFormat = res?.data?.filter((validation: any) => { return validation.priority == 1 })
          this.validationTypes = res?.data?.filter((validation: any) => {
            validation.validation_type = validation.id;
            validation.is_active = 0;
            validation.value = '';
            validation.message = '';
            validation.show = true;
            return validation.priority == 0
          })
          this.viewValidation();//view saved validations
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }
  answerValidation() {
    this.validation_field.min = null;
    this.validation_field.max = null;
    this.validation_field.value = null;
    this.validationTypes = this.getValidationTypeFields(this.validation_field.id)
  }
  getValidationTypeFields(type_id: any) {
    switch (type_id) {
      case 2: return this.validationTypes.map(validation => {
        if (validation.id == 5) {
          if (((this.matrix_question_type == 9 || this.question_type == 9))) {
            return { ...validation, show: true };
          } else {
            return { ...validation, show: false, is_active: 0 };
          }
        } else {
          return { ...validation, show: true };
        }
      });
      case 10: return this.validationTypes.map(validation => {
        if (validation.id == 7 || validation.id == 8) {
          return { ...validation, show: true };
        } else {
          return { ...validation, show: false, is_active: 0 };
        }
      });
      case null:
      case undefined:
        return this.validationTypes.map(validation => {
          if (validation.id != 5) {
            return { ...validation, show: true };
          } else {
            return { ...validation, show: false, is_active: 0 };
          }
        });
      default: return this.validationTypes.map(validation => {
        if (validation.id == 7 || validation.id == 11) {
          return { ...validation, show: true };
        } else {
          return { ...validation, show: false, is_active: 0 };
        }
      });
    }
  }
  getQuestionList() {
    this.questions = [];
    this.surveyService.surveyAllQuestions(this.data.survey_identifier)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          let questionIndex: any;
          res.data.questions.forEach((qstn: any, index: any) => {
            if (qstn.question_identifier == this.data.question_identifier) {
              questionIndex = index;
            } else {
              if (qstn.page_order <= this.data.page_order && (questionIndex == undefined || index < questionIndex)) {
                this.questions.push(qstn);
                if (qstn.question_type == 2 || qstn.question_type == 3 || qstn.question_type == 4) {
                  this.carry_forward_questions.push(qstn)
                }
              }
            }
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

  }
  changeRequired(event: any) {
    this.data.required_status = event.checked ? 1 : 0;
  }
  saveValidationLogic() {
    this.data.custom_validation_message = this.question.custom_validation_message;
    this.surveyQuestionUpdate(this.data, this.data.question_identifier);
    let validation_data: any = [];
    this.validationTypes?.forEach((item: any) => {
      let newItem = {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: null,
        form_question_identifier: null,
        matrix_option_identifier: null,
        form_option_identifier: null,
        validation_on: 0,
        "validation_type": item?.validation_type,
        "min": item.min,
        "max": item.max,
        "value": item.value,
        "message": item?.message || null,
        is_active: item.is_active
      }
      if (item.is_active == 1 && item.validation_identifier == null) {
        validation_data.push(newItem)
      } else if (item.validation_identifier != null) {
        this.updateValidation(newItem, item.validation_identifier)
      }
    })
    if (this.validation_field?.id) {
      let validationField = {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: null,
        form_question_identifier: null,
        matrix_option_identifier: null,
        form_option_identifier: null,
        validation_on: 0,
        "validation_type": this.validation_field?.id,
        "min": this.validation_field.min,
        "max": this.validation_field.max,
        "value": this.validation_field.value,
        "message": this.validation_field?.message || null,
        is_active: this.validation_field.is_active
      }
      if (this.answerFormatValue) {
        this.updateValidation(validationField, this.answerFormatValue.validation_identifier)
      } else {
        validation_data.push(validationField);
      }
    }
    if (validation_data?.length > 0) {
      let data = {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: null,
        form_question_identifier: null,
        matrix_option_identifier: null,
        form_option_identifier: null,
        validation_data: validation_data,
        is_active: 1
      }
      this.addValidation(data);
    }
  }
  surveyQuestionUpdate(data: any, id: any) {
    this.surveyService.surveyQuestionUpdate(data, id)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this._mdr.close(true);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  addValidation(data: any) {
    this.surveyService.addValidation(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this._mdr.close(true);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updateValidation(data: any, id: any) {
    this.surveyService.updateValidation(data, id)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this._mdr.close(true);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  viewValidation() {
    this.surveyService.viewValidation(this.data.survey_identifier, this.data.question_identifier)
      .subscribe({
        next: (res: any) => {
          res?.data?.forEach(element => {
            if (element.validation_on == 0) {
              this.validationTypes?.forEach(item => {
                if (item.id == element.validation_type) {
                  item.min = element.min
                  item.max = element.max
                  item.value = element.value
                  item.message = element.message
                  item.is_active = 1
                  item.show = true;
                  item.validation_identifier = element.validation_identifier
                }
                if (element.priority == 1) {
                  this.answerFormatValue = element;
                  this.validation_field = element;
                  this.validation_field.id = element.validation_type
                }
              })
            }
          });
          //no saved validation
          if (res?.data?.length == 0) {
            if (this.validation_field.id == undefined || this.validation_field.id == null) {
              if (this.question_type == 9) {
                this.validation_field.id = 2
              } else if (this.question_type == 2) {
                this.validation_field.id = null;
              } else if (this.question_type == 6) {
                if (this.matrix_question_type == 2 || this.matrix_question_type == 3)
                  this.validation_field.id = null;
                else if (this.matrix_question_type == 9)
                  this.validation_field.id = 2
                else this.validation_field.id = 1;
              } else {
                this.validation_field.id = 1;
              }
              this.validation_field.is_active = 1;
            }
          }
          this.validationTypes = this.getValidationTypeFields(this.validation_field.id)
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getQuestionPiping() {
    this.surveyService.pipingConditionList()
      .subscribe({
        next: (res: any) => {
          this.conditionList = res?.data;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  viewPiping() {
    this.surveyService.viewPiping(this.data.survey_identifier, this.data.question_identifier)
      .subscribe({
        next: (res: any) => {
          this.pipingData = res?.data[0];
          this.p_question = this.pipingData?.question_piping_identifier;
          let condition = this.conditionList?.filter(item => item.id == this.pipingData?.piping_condition)
          if (condition.length > 0)
            this.pipeCondition = condition[0];
          this.checkPipeValid();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  updatePiping(status: any) {
    if (this.pipingData?.question_piping_mapping_identifier) {
      let data = this.pipingData;
      data['is_active'] = status;
      data['question_piping_identifier'] = this.p_question;
      data['piping_condition'] = this.pipeCondition?.id;
      this.surveyService.updatePiping(data)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res?.message);
            this.checkPipeValid();
            //delete options
            if (status == 0 || this.p_question != this.pipingData?.question_piping_identifier)
              this.surveyQuestionOptionUpdate()
            this._mdr.close(true);
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    } else if (status == 0) {
      this.p_question = null;
      this.pipeCondition = null;
    }
    this.checkPipeValid();
  }
  checkPipeValid() {
    this.pipeValid = false;
    if (this.p_question != null && this.pipeCondition != null)
      this.pipeValid = true;
  }
  save() {
    if (this.pipingData?.question_piping_mapping_identifier) {
      this.updatePiping(1);
    } else {
      let pipedText = "${q:/" + this.p_question + "/" + this.pipeCondition?.label_name + '}'
      let data = {
        "survey_identifier": this.data.survey_identifier,
        "question_identifier": this.data.question_identifier,
        "question_piping_identifier": this.p_question,
        "piping_condition": this.pipeCondition?.id,
        "piping_type": 1,
        "variable_pattern": pipedText
      }
      this.surveyService.addPiping(data)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res?.message);
            this.saveQuestionOption();
            this._mdr.close(true)
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  getOptions(qId: any) {
    return this.carry_forward_questions?.filter(q => q.question_identifier == qId)[0]?.option
  }
  saveQuestionOption() {
    let options = this.getOptions(this.p_question)
    if (options?.length > 0) {
      //copy questions
      options?.forEach(element => {
        let data = [{
          question_identifier: this.data.question_identifier,
          survey_identifier: this.data.survey_identifier,
          choices: element?.choices,
          text_entry: element?.text_entry,
          required_status: 0,
          is_exclusive: 0,
          is_all_of_the_above: 0,
          piping_type: 1,
        }];
        this.surveyService.surveyQuestionOptionSave(data)
          .subscribe({
            next: (res: any) => {

            },
            error: error => {
              this.toastr.error(error?.error?.message);
            }
          });
      });
    }
  }
  surveyQuestionOptionUpdate() {
    //delete existing carry forward choices
    //get current choices
    let options = this.getOptions(this.data.question_identifier)
    if (options?.length > 0) {
      //copy questions
      options?.forEach((element, index) => {
        if (element?.piping_type == 1) {
          let data = [{
            question_identifier: this.data.question_identifier,
            survey_identifier: this.data.survey_identifier,
            choices: element?.choices,
            piping_type: 1,
            is_active: 0
          }];
          this.surveyService.surveyQuestionOptionUpdate(data, element?.option_identifier)
            .subscribe({
              next: (res: any) => {
                if (index == options?.length - 1) {//last option
                  this.saveQuestionOption()
                }
              },
              error: error => {
                this.toastr.error(error?.error?.message);
              }
            });
        }
      });
    }


  }
}
