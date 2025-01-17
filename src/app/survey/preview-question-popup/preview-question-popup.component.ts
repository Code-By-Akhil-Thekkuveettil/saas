import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'app-preview-question-popup',
  templateUrl: './preview-question-popup.component.html',
  styleUrls: ['./preview-question-popup.component.css']
})
export class PreviewQuestionPopupComponent implements OnInit {
  total: any = {};
  matrixTotal: any = {};
  question: any;
  errMessage: string = "Please answer this question.";
  valid: boolean = true;
  constructor(
    private _mdr: MatDialogRef<PreviewQuestionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.question = data?.question;
    this.question.valid = true;
  }

  ngOnInit(): void {
  }
  calculateSum(question: any) {
    this.total[question?.id] = 0;
    question?.form_questions.forEach((element: any) => {
      if (element?.answer)
        this.total[question?.id] = this.total[question?.id] + element?.answer;
    })
    return this.total[question?.id];
  }
  calculateMatrixSum(question: any) {
    question.matrix_option.forEach((option: any) => {
      this.matrixTotal[question.id][option.matrix_options] = 0;
    });
    question?.form_questions.forEach((element: any) => {
      question.matrix_option.forEach((option: any) => {
        if (element?.answers[option.matrix_options]?.answer) {
          this.matrixTotal[question.id][option.matrix_options] = this.matrixTotal[question.id][option.matrix_options] + element?.answers[option.matrix_options]?.answer;
        }
      });
    })
    return this.matrixTotal[question?.id];
  }

  closeDialog() {
    this._mdr.close();
  }
  showValue(question: any) {
    this.requiredValidation()
  }
  requiredValidation() {
    let isValid = true;
    /* resetting the error variables STARTS */
    this.question.valid = true;
    this.question.textEntryValidation = true;
    this.question.option_required_error = false;
    /* resetting the error variables ENDS */

    if (this.question.active) {
      this.question.valid = true;
      //text entry validation
      //Check Box
      //Radio Button
      //Drop down
      if (this.question.question_type == 2 ||
        this.question.question_type == 3 ||
        this.question.question_type == 4
      ) {
        this.question.option.forEach((item: any) => {
          let isItemselected = false;
          if (this.question.question_type == 2) {
            isItemselected = item.checked
          } else if (this.question.question_type == 3 ||
            this.question.question_type == 4) {
            if (item.option_identifier == this.question.answer)
              isItemselected = true
          }
          if (isItemselected && item.text_entry == 1) {//selected item
            if (item.text_entry_value == "" ||
              item.text_entry_value == undefined) { //text entry validation
              if (item.is_required_text_entry == 1) {
                this.question.valid = false;
                isValid = false;
                this.question.textEntryValidation = false;
              }
            } else {
              let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 4 })
              if (!this.checkAllowTextValidation(validation_data, item.text_entry_value)) {
                isValid = false;
                item.valid = false;
                this.question.valid = false;
                this.question.textEntryValidation = false;
              }
            }
          } else if (!isItemselected && item.text_entry == 1 &&
            item.text_entry_value != "" &&
            item.text_entry_value != undefined) {
            this.question.valid = false;
            item.valid = false;
            isValid = false;
          }
        });
      } else if (this.question.question_type == 6) {//Matrix
        this.question.form_questions.forEach((item: any) => {
          if (this.question.matrix_question_type) {
            this.question.matrix_option?.forEach((opt: any) => {
              if (item.answers[opt.matrix_option_identifier] != "" &&
                item.answers[opt.matrix_option_identifier] != undefined) {
                if (item.text_entry == 1 && item.is_required_text_entry == 1 &&
                  (item.text_entry_value == "" ||
                    item.text_entry_value == undefined)) {
                  this.question.valid = false;
                  this.question.textEntryValidation = false;
                  isValid = false;
                }
              } else if (item.text_entry == 1 &&
                item.text_entry_value != "" &&
                item.text_entry_value != undefined) {
                this.question.textEntryValidation = false;
                this.question.valid = false;
                isValid = false;
              }
            });
          }
        });
      } else if (this.question.question_type == 5 || this.question.question_type == 9) { //answer format validation  //form         
        this.question.form_questions.forEach((item) => {
          if (item.answer == '' || item.answer == undefined || item.answer == null) {
            // not answered            
          } else {
            //question validation
            let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
            if (!this.checkAllowTextValidation(validation_data, item.answer)) {
              item.valid = false;
              isValid = false;
              this.question.valid = false;
            } else {
              //item validation
              let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 2 })
              if (!this.checkAllowTextValidation(validation_data, item.answer)) {
                item.valid = false;
                isValid = false;
                this.question.valid = false;
              }
            }
          }
        });
      } else if (this.question.question_type == 1 || this.question.question_type == 7) {//text box
        if (this.question.answer == '' || this.question.answer == undefined || this.question.answer == null) {
          this.question.textEntryValidation = false;
        } else {
          let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
          if (!this.checkAllowTextValidation(validation_data, this.question.answer)) {
            isValid = false;
            this.question.valid = false;
            this.question.textEntryValidation = false;
          }
        }
      }
      //required validation
      let ans_count = 0;
      if (this.question.required_status == 1) {
        if (this.question.question_type == 5 ||
          this.question.question_type == 9) {//Form, Continuous Sum
          //option answer required validation
          ans_count = 0;
          let i = 0;
          this.question.form_questions.forEach((item) => {
            if (item?.answer?.toString() == '' || item?.answer == undefined || item.answer == null) {
              if (item.required_status == 1) {
                isValid = false;
                this.question.valid = false;
                this.question.option_required_error = true;
                if (i == 0) {
                  this.question.option_required = item.choices;
                  i++;
                }
              }
            } else {
              ans_count++;
            }
          });
          if (ans_count == 0) {
            isValid = false;
            this.question.valid = false;
            this.question.option_required_error = true;
          }
        } else if (this.question.question_type == 6) {//Matrix
          ans_count = 0;
          let index = 0;
          this.question.form_questions?.forEach((item: any) => {
            let choiceAnswered = 0;
            this.question.matrix_option?.forEach((option) => {
              let isNotAnswered: boolean;
              let optionanswered = 0;
              if (this.question.matrix_question_type == null || this.question.matrix_question_type == 3) {//Radio Button
                isNotAnswered = item.answer == undefined || item.answer == null;
              } else if (this.question.matrix_question_type == 2) {//Check Box
                isNotAnswered = (item.answers[option.matrix_option_identifier].checked == undefined ||
                  !item.answers[option.matrix_option_identifier].checked ||
                  item.answers[option.matrix_option_identifier].checked == null)
              } else {
                isNotAnswered = (item.answers[option.matrix_option_identifier].answer == 0 ||
                  item.answers[option.matrix_option_identifier].answer == undefined ||
                  item.answers[option.matrix_option_identifier].answer == null)
                if (!isNotAnswered) {
                  //question validation
                  let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_on == 0 })
                  if (!this.checkAllowTextValidation(validation_data, item.answers[option.matrix_option_identifier].answer)) {
                    item.valid = false;
                    isValid = false;
                    this.question.valid = false;
                    option.valid = false;
                  } else {
                    //item validation
                    let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_on == 2 })
                    if (!this.checkAllowTextValidation(validation_data, item.answers[option.matrix_option_identifier].answer)) {
                      item.valid = false;
                      isValid = false;
                      this.question.valid = false;
                      option.valid = false;
                    }
                  }
                }
              }
              if (isNotAnswered) {
                if (item.required_status == 1 || option.required_status == 1) {
                  isValid = false;
                  this.question.valid = false;
                  item.valid = false;
                  this.question.option_required_error = true;
                  if (index == 0) {
                    if (item.required_status == 1) {
                      this.question.option_required = item.choices;
                    } else {
                      this.question.option_required = option.matrix_options;
                    }
                    index++;
                  }
                }
              } else {
                choiceAnswered++;
                ans_count++;
                optionanswered++;
              }
            });
            if (item.required_status == 1 && choiceAnswered == 0) {
              isValid = false;
              this.question.valid = false;
              item.valid = false;
              this.question.option_required_error = true;
              if (index == 0) {
                this.question.option_required = item.choices;
                index++;
              }
            }
            //min & max answer count validation
            let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_type == 7 })
            if (validation_data?.length > 0) {
              let validation = validation_data[0];
              let min = Number(validation.min)
              let max = Number(validation.max)
              if (min > 0 || max > 0) {
                if ((choiceAnswered < min && min > 0) ||
                  (choiceAnswered > max && max > 0)) {
                  isValid = false;
                  this.question.valid = false;
                  validation.isValid = false;
                  validation.message = validation.message || 'Please enter  ' + (min || 'no') + " minimum answers and  " + (max || 'no') + " maximum answers"
                }
              }
            }
            if (this.question.valid) {
              let validation_data = item?.validation_data?.filter((validation: any) => { return validation.validation_type == 7 })
              if (validation_data?.length > 0) {
                let validation = validation_data[0];
                let min = Number(validation.min)
                let max = Number(validation.max)
                if (min > 0 || max > 0) {
                  if ((choiceAnswered < min && min > 0) ||
                    (choiceAnswered > max && max > 0)) {
                    isValid = false;
                    this.question.valid = false;
                    validation.isValid = false;
                    validation.message = validation.message || 'Please enter  ' + (min || 'no') + " minimum answers and  " + (max || 'no') + " maximum answers"
                  }
                }
              }
            }
          });
          if (ans_count == 0) {
            isValid = false;
            this.question.valid = false;
            this.question.textEntryValidation = false;
          }
        } else if (this.question.question_type == 2) {//Check Box
          ans_count = 0;
          this.question.option.forEach((item) => {
            if (item.checked) {
              ans_count++;
            }
          });
          if (ans_count == 0) {
            isValid = false;
            this.question.valid = false;
            this.question.textEntryValidation = false;
          }
        } else if (this.question.question_type == 8) {//Text/Media
        } else if (this.question.question_type == 10) {//Signature
          if (this.question.signature_file == undefined || this.question.choices == undefined) {
            isValid = false;
            this.question.valid = false;
          }
        } else if (this.question.answer == '' || this.question.answer == undefined ||
          this.question.answer == null) {
          isValid = false;
          this.question.valid = false;
          this.question.textEntryValidation = false;
        }
      } else {// item required validation

      }
      //must total validation
      if (this.question.question_type == 9) {//Continuous Sum 
        let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_type == 5 })
        if (validation_data?.length > 0) {
          let validation = validation_data[0];
          let max = Number(validation.max)
          if (ans_count > 0 && this.total[this.question?.question_identifier] != max) {
            this.question.valid = false;
            isValid = false;
            validation.isValid = false;
            validation.message = validation.message || 'Total value must be equal to ' + max
          }
        }
      }
      if (this.question.matrix_question_type == 9) {//Continuous Sum         
        //must total validation
        let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_type == 5 })
        if (validation_data?.length > 0) {
          let validation = validation_data[0];
          let max = Number(validation.max)
          if (ans_count > 0) {
            this.question.matrix_option?.forEach((option) => {
              if (this.matrixTotal[this.question.question_identifier][option?.matrix_option_identifier] != max) {
                this.question.valid = false;
                isValid = false;
                validation.isValid = false;
                validation.message = validation.message || 'Total value must be equal to ' + max
              }
            });
          }
        }
      }
      //min & max answer count validation
      let validation_data = this.question?.validation_data?.filter((validation: any) => { return validation.validation_type == 7 })
      if (validation_data?.length > 0) {
        let validation = validation_data[0];
        let min = Number(validation.min)
        let max = Number(validation.max)
        if (min > 0 || max > 0) {
          if ((ans_count < min && min > 0) ||
            (ans_count > max && max > 0)) {
            isValid = false;
            this.question.valid = false;
            validation.isValid = false;
            validation.message = validation.message || 'Please enter  ' + (min || 'no') + " minimum answers and  " + (max || 'no') + " maximum answers"
          }
        }
      }
    }

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
              if (!Number(value)) {
                validation.isValid = false;
                isValid = false;
                validation.message = validation.message || 'Please enter valid number'
                return isValid;
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
              if (!RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).exec(value)) {
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
                if (val < min || val > max) {
                  validation.isValid = false;
                  isValid = false;
                  validation.message = validation.message || 'Please enter number less than ' + min + ' greater than ' + max
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










}
