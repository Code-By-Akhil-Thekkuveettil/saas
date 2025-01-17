import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { TextEditorComponent } from 'src/app/shared/text-editor/text-editor.component';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { DeletePopupService } from '../delete-popup/delete-popup.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-survey-option-edit',
  templateUrl: './survey-option-edit.component.html',
  styleUrls: ['./survey-option-edit.component.css']
})
export class SurveyOptionEditComponent implements OnInit {
  @Output() upload = new EventEmitter();
  textEditorPopup: MatDialogRef<TextEditorComponent> | undefined;
  question_type!: number;
  matrix_question_type!: number;
  onClose: any;
  expNavbar: boolean = true;
  survey_identifier: any;
  option_identifier: any;
  question: any;
  selectedQuestiontype: any;
  option: any;
  selectedSettings: any;
  selectedValidation: any = {};
  minValue: number = 0;
  maxValue!: number;
  selectedDateFormat: any;
  regex: any;
  validationTypes: any[] = [];
  validation_field: any = {};
  answerFormatValue: any;
  textEntryAnswerFormat: any[] = [];
  textEntryvalidationTypes: any[] = [];
  optionsList: any;
  answerFormat: any[] = [];
  isMultipleOptions: boolean = false;
  remove_option: boolean = false;
  multipleOptionText: any = "";
  textEntryAnswerFormatValue: any;
  params: any = ""
  allValidations: any = [];
  constructor(
    private matDialog: MatDialog,
    private surveyService: SurveyService,
    private toastr: ToastrService,
    private deletePopupService: DeletePopupService,
    private _mdr: MatDialogRef<SurveyOptionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.survey_identifier = this.data.survey_identifier;
    this.option = this.data.option;
    this.params =
      '&option_identifier=' + this.option?.option_identifier +
      '&form_questions_identifier=' + this.option?.form_identifier +
      '&matrix_options_identifier=' + this.option?.matrix_option_identifier;
    this.matrix_question_type = this.data?.matrix_question_type;
    this.question_type = this.data.question_type;
    if (this.option?.question_type == 4) {
      this.optionsList = this.option?.form_options;
    }
    this.viewValidation();
    this.setQuestion();
  }

  ngOnInit(): void {
    //init
  }
  changeQuestionType() {
    if (this.option.question_type == 1) {
      this.optionsList = [];
    } else {
      this.optionsList = this.option?.form_options;
    }
  }

  expand(show) {
    this.expNavbar = show;
  }

  closeDialog() {
    this._mdr.close()
  }
  getValidationTypes(type: any, q_type: any = 1) {
    let types: any[]
    let answerFormatType: any[];
    this.surveyService.getValidationTypes(q_type)
      .subscribe({
        next: (res: any) => {
          answerFormatType = res?.data?.filter((validation: any) => { return validation.priority == 1 })
          types = res?.data?.filter((validation: any) => {
            validation.validation_type = validation.id;
            validation.is_active = 0;
            validation.value = '';
            validation.message = '';
            validation.show = true;
            return validation.priority == 0
          });
          //initialise

          if (type == 1) {
            this.validationTypes = types;
            this.answerFormat = answerFormatType;
          } else {
            this.textEntryvalidationTypes = types;
            this.textEntryAnswerFormat = answerFormatType;
          }
          this.getValidation(type);//view saved validations 
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
    this.validation_field.message = null;
    this.validationTypes = this.getValidationTypeFields(this.validationTypes, this.validation_field.id)
  }
  textEntryValidation() {
    this.textEntryvalidationTypes = this.getValidationTypeFields(this.textEntryvalidationTypes, this.selectedValidation.id)
  }
  getValidationTypeFields(types: any, type_id: any) {
    switch (type_id) {
      case 2:
        return types.map(validation => {
          if (validation.id != 7 && validation.id != 5 && validation.id != 11)
            return { ...validation, show: true };
          else {
            return { ...validation, show: false, is_active: 0 };
          }
        });
      case 10: return types.map(validation => {
        if (validation.id == 8) {
          return { ...validation, show: true };
        } else {
          return { ...validation, show: false, is_active: 0 };
        }
      });
      case null:
      case undefined:
      default: return types.map(validation => {
        if ((!this.option.matrix_option_identifier && validation.id == 7)
          || (this.option.matrix_option_identifier && validation.id == 11)) {
          return { ...validation, show: true };
        } else {
          return { ...validation, show: false, is_active: 0 };
        }
      });
    }
  }
  setQuestion() {
    if (this.question_type == 5 || this.question_type == 6 || this.question_type == 9) {
      if (this.data.matrix_option) {
        this.option_identifier = this.option.matrix_option_identifier;
      } else
        this.option_identifier = this.option.form_identifier;
    } else {
      this.option_identifier = this.option.option_identifier;
      if (this.option.is_exclusive == 1) {
        this.selectedSettings = 1;
      } else if (this.option.is_all_of_the_above == 1) {
        this.selectedSettings = 2;
      }
    }
  }
  changeRequired(event: any) {
    this.option.required_status = event.checked ? 1 : 0;
  }

  addOption() {
    this.optionsList.push({
      question_identifier: this.data?.question_identifier,
      survey_identifier: this.survey_identifier,
      form_identifier: this.option_identifier,
      choices: "Option" + (this.optionsList.length + 1),
      option_type: 1,
      isNew: true,
      required_status: 0,
      is_exclusive: 0,
      is_active: 1
    });
  }

  deleteOption(item: any) {
    this.deletePopupService.confirm('Please confirm', 'Do you really want to delete?')
      .then((confirmed) => {
        if (confirmed) {
          if (item.form_option_identifier != undefined && item.form_option_identifier != "") { //options that are added already
            item.is_active = 0
            this.updateFormOptions(item);
          } else {
            item.is_active = 0
          }
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  updateFormOption(data: any) {
    this.surveyService.surveyQuestionOptionFormUpdate(data, this.option_identifier)
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
  surveyMatrixColUpdate(data: any) {
    this.surveyService.surveyMatrixColUpdate(data, this.option_identifier)
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
  updateFormOptions(data: any) {
    if (data.form_option_identifier) {
      this.surveyService.updateFormOptions(data, data.form_option_identifier)
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
  updateOption(data: any) {
    this.surveyService.surveyQuestionOptionUpdate(data, this.option_identifier)
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
  add() {
    // add new option
    let datas = this.optionsList?.filter((x: any) => {
      return (x.form_option_identifier == undefined ||
        x.form_option_identifier == "") &&
        x.is_active == 1
    });
    if (datas?.length > 0)
      this.surveyService.createFormOptions(datas)
        .subscribe({
          next: (res: any) => {
          },
          error: error => {
            this.toastr.error(error, error?.message)
          }
        });
    let data = {
      choices: null,
      matrix_options: null,
      question_type: null,
      header: this.option.header || null,
      text_entry: this.option.text_entry == "" || this.option.text_entry == undefined ? 0 : 1,
      is_required_text_entry: this.option.is_required_text_entry ? 1 : 0,
      default_option: this.option.default_option == "" || this.option.default_option == undefined ? 0 : 1,
      required_status: this.option.required_status == "" || this.option.required_status == undefined ? 0 : 1,
      is_exclusive: this.selectedSettings == 1 ? 1 : 0,
      is_shuffle: this.option.is_shuffle == false ? 0 : 1,
      is_all_of_the_above: this.selectedSettings == 2 ? 1 : 0,
    };
    if (this.question_type == 5 || this.question_type == 6 || this.question_type == 9) {
      if (this.question_type == 5) {
        data.question_type = this.option?.question_type;
      }
      if (this.data.matrix_option) {
        data.matrix_options = this.option.choices;
        this.surveyMatrixColUpdate(data)
      } else {
        data.choices = this.option.choices;
        this.updateFormOption(data);
      }
    } else {
      if (this.question_type == 2 || this.question_type == 3 || this.question_type == 4) {
        data.choices = this.option.choices;
      }
      this.updateOption(data);
    }
    //add validations
    this.saveValidationLogic(1);
    if (data.text_entry)
      this.saveValidationLogic(2);
  }
  addMultipleOptions() {
    this.isMultipleOptions = true;
  }
  onCheckboxChange(event: MatCheckboxChange) {
    this.remove_option = event.checked;
  }
  multipleOptionsConvertionForm() {
    if (this.remove_option) {
      this.optionsList = [];
    }
    let array = this.multipleOptionText.split('\n');
    array.forEach(x => {
      this.optionsList.push({
        question_identifier: this.data?.question_identifier,
        survey_identifier: this.survey_identifier,
        form_identifier: this.option_identifier,
        choices: x,
        option_type: 1,
        isNew: true,
        required_status: 0,
        is_exclusive: 0,
        is_active: 1
      });
    });
    this.multipleOptionText = "";
    this.isMultipleOptions = false;
    this.remove_option = false;
  }
  addmultipleConvertionCancel() {
    this.isMultipleOptions = false;
  }
  editTextEditor(choices: any, type: any = 'choice') {
    this.textEditorPopup = this.matDialog.open(TextEditorComponent, {
      disableClose: true,
      height: '500px',
      width: '700px',
      data: {
        content: choices
      }
    });
    this.textEditorPopup.afterClosed().subscribe(res => {
      if (res) {
        if (type == 'choice')
          this.option.choices = res;
        else
          this.option.header = res;
      }
    });
  }
  saveValidationLogic(type: any) {
    let validation_data: any = [];
    let types: any[]
    let validationField: any;
    let answer: any = {};
    let validation_on = this.option.option_identifier != null ? 1 : this.option.matrix_option_identifier != null ? 3 : 2
    if (type == 1) {
      types = this.validationTypes;
      validationField = this.validation_field;
      answer = this.answerFormatValue;
    } else {
      types = this.textEntryvalidationTypes;
      validationField = this.selectedValidation;
      answer = this.textEntryAnswerFormatValue;
    }
    types?.forEach((item: any) => {
      let newItem = {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: this.option.option_identifier || null,
        form_question_identifier: this.option.form_identifier || null,
        matrix_option_identifier: this.option.matrix_option_identifier || null,
        form_option_identifier: null,
        validation_on: type == 2 ? 4 : validation_on,
        "validation_type": item?.validation_type,
        "min": item.min,
        "max": item.max,
        "value": item.value,
        "message": item?.message || null,
        is_active: item.is_active ? 1 : 0
      }
      if (item.is_active && item.validation_identifier == null) {
        validation_data.push(newItem)
      } else if (item.validation_identifier != null) {
        this.updateValidation(newItem, item.validation_identifier)
      }
    })
    if (validationField?.id) {
      let new_validationField = {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: this.option.option_identifier || null,
        form_question_identifier: this.option.form_identifier || null,
        matrix_option_identifier: this.option.matrix_option_identifier || null,
        form_option_identifier: null,
        validation_on: type == 2 ? 4 : validation_on,
        "validation_type": validationField?.id,
        "min": validationField.min,
        "max": validationField.max,
        "value": validationField.value,
        "message": validationField?.message || null,
        is_active: validationField.is_active ? 1 : 0
      }
      if (answer) {
        this.updateValidation(new_validationField, answer.validation_identifier)
      } else {
        validation_data.push(new_validationField);
      }
    }
    if (validation_data?.length > 0) {
      let data = {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: this.option.option_identifier || null,
        form_question_identifier: this.option.form_identifier || null,
        matrix_option_identifier: this.option.matrix_option_identifier || null,
        form_option_identifier: null,
        validation_data: validation_data,
        is_active: 1
      }
      this.addValidation(data);
    }
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
    this.surveyService.viewValidation(this.data.survey_identifier, this.data.question_identifier, this.params)
      .subscribe({
        next: (res: any) => {
          this.allValidations = res?.data;
          if (this.question_type == 5 || this.question_type == 9 ||
            (this.question_type == 6 && this.matrix_question_type != 3))
            this.getValidationTypes(1, this.question_type);
          this.getValidationTypes(2, 1);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getValidation(type: any) {
    let types: any[]
    let validationField: any = {};
    let validations: any = []
    if (type == 1) {
      types = this.validationTypes;
      validations = this.allValidations?.filter((element: any) => {
        return element.validation_on != 4
      });
    } else {
      types = this.textEntryvalidationTypes;
      validations = this.allValidations?.filter((element: any) => {
        return element.validation_on == 4
      });
    }
    validations?.forEach(element => {
      types?.forEach(item => {
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
          validationField = element;
          validationField.is_active = 1;
          validationField.id = element.validation_type
          if (type == 1) {
            this.answerFormatValue = element;
          } else {
            this.textEntryAnswerFormatValue = element;
          }
        }
      })
    });
    //no saved validation
    if (validations?.length == 0) {
      if (validationField.id == undefined || validationField.id == null) {
        if (type == 1) {
          if (this.question_type == 9) {
            validationField.id = 2
          } else if (this.question_type == 2) {
            validationField.id = null;
          } else if (this.question_type == 6) {
            if (this.matrix_question_type == 2 || this.matrix_question_type == 3)
              validationField.id = null;
            else if (this.matrix_question_type == 9)
              validationField.id = 2
            else validationField.id = 1;
          } else {
            validationField.id = 1;
          }
        } else {
          validationField.id = 1;
        }
        validationField.is_active = 1;
      }
    }
    if (type == 1) {
      this.validation_field = validationField;
      this.validationTypes = this.getValidationTypeFields(types, validationField.id)
    } else {
      this.selectedValidation = validationField;
      this.textEntryvalidationTypes = this.getValidationTypeFields(types, validationField.id)
    }
  }
}
