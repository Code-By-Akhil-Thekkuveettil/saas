import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-survey-add-skip-logic',
  templateUrl: './survey-add-skip-logic.component.html',
  styleUrls: ['./survey-add-skip-logic.component.css']
})
export class SurveyAddSkipLogicComponent implements OnInit {
  @Output() upload = new EventEmitter();
  currentUser: any;
  onClose: any;
  expNavbar: boolean = true;
  selectedQuestion: any;
  conditionQuestionList: any[] = [];
  skipToQuestions: any[] = [];
  selectedOperator: any;
  selectedValue: any;
  addLogic: boolean = false;
  logicSets: any[] = [];
  groupLogic: any[] = [];
  qtype: any;
  selectedValidation: any;
  textValid: boolean = false;
  minValue: number = 0;
  maxValue!: number;
  selectedDateFormat: any;
  regex: any;
  selectedComparison: any;
  displayLogicList: any[] = [];
  logicValid: boolean = true;
  skipto: any;
  skipLogicSets: any[] = [];
  isValidCondition: boolean = false;
  operators: any = {};

  constructor(
    private surveyService: SurveyService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<SurveyAddSkipLogicComponent>,
    public spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data.newSkip == 1) {
      this.logicValid = false;
    }
    this.getQuestionList();
  }
  getQuestionList() {
    this.spinner.show();
    this.surveyService.surveyAllQuestions(this.data.survey_identifier)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          let questions = res?.data?.questions;
          questions.forEach(x => {
            if (x.page_order <= this.data.page) {
              this.conditionQuestionList.push(x);
            } else {
              this.skipToQuestions.push(x);
            }
          });
          this.getSkipLogic();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getSkipLogic() {
    //set existing data for edit
    this.surveyService.getSurveyLogic(this.data.page_num, this.data.survey_identifier)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          res?.data.forEach(skipp => {
            skipp.is_active = 1;
            this.groupLogic.push(skipp)
            skipp?.question_skip_logical_data.forEach(logic_skipp => {
              this.selectedComparison = "Or";
              this.skipLogicSets.push(logic_skipp);
              //edit
              if (this.data.newSkip == 0) {
                var i = 1;
                const result = this.skipToQuestions.filter((x: any) => {
                  return x.question_identifier == logic_skipp?.parent_question_identifier
                });
                if (result?.length > 0)
                  this.skipto = result[0];
                if (logic_skipp.condition_question_identifier != undefined && logic_skipp.condition_question_identifier != "") {
                  this.isValidCondition = true;
                  logic_skipp.logic_order = i++;
                  this.logicSets.push(logic_skipp)
                  this.updateQuestion(logic_skipp, false);
                  this.textOperatorUpdate(logic_skipp, false)
                }
              }
            });
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  expand(show) {
    this.expNavbar = show;
  }

  closeDialog() {
    this._mdr.close();
  }

  displayLogic(group_set: any) {
    this.isValidCondition = true;
    let unique_skip_id = 1;
    let l = 0;
    if (group_set) {
      l = group_set?.question_skip_logical_data.length;
      if (group_set?.question_skip_logical_data == undefined || l == 0) {
        unique_skip_id = 1;
      } else {
        unique_skip_id = group_set?.question_skip_logical_data[l - 1].unique_skip_id + 1;
      }
    }
    let con = "";
    if (l == 0) {
      con = "";
    } else {
      con = "Or";
    }
    let g = this.groupLogic.length;
    let g_con = "";
    if (g == 0) {
      g_con = "";
    } else {
      g_con = "Or";
    }
    let logic = {
      parent_question_identifier: "",
      logic_order: l + 1,
      logic_group_order: group_set?.group_order || g + 1,
      logical_condition: con,
      unique_skip_id: unique_skip_id,
      unique_index: this.logicSets?.length + 1,
      group_logical_condition_operator: g_con,
      logic_group_identifier: group_set?.group_identifier || null,
      is_active: 1
    }
    this.logicSets.push(logic);
    let logicSet: any = [];
    logicSet.push(logic);
    if (group_set != null) {
      group_set?.question_skip_logical_data.push(logic);
    } else {
      this.groupLogic.push({
        group_identifier: null,
        group_order: g + 1,
        page_no: this.data.page_num,
        is_active: 1,
        group_logical_condition_operator: g_con,
        question_skip_logical_data: logicSet
      })
      this.checkValid(group_set);
    }
    this.checkLogicValid(logic);
  }
  checkValid(sets: any) {
    if (sets != null) {
      sets.isEdited = true;
      if (sets?.length > 1) {
        if (sets.is_active && (sets?.logical_condition_identifier == undefined || sets?.logical_condition_identifier == "")) {
          this.logicValid = false
        } else {
          this.logicValid = true
        }
      }
    }
    if (this.skipto != "" && this.skipto != undefined) {
      this.logicValid = true;
    }
  }
  updateDisplayLogic(logic: any) {
    if (logic.isEdited) {
      if (logic.field_value == undefined) {
        logic.field_value = "";
      }
      let data = {
        logical_condition_identifier: logic?.logical_condition_identifier,
        survey_identifier: logic.survey_identifier,
        parent_question_identifier: this.skipto?.question_identifier,
        condition_question_identifier: logic?.condition_question_identifier,
        condition_question_option_identifier: logic?.condition_question_option_identifier,
        field_value: logic?.field_value,
        logical_operators: null,
        logical_operators_type: logic?.logical_operators_type,
        logical_condition: logic?.logical_condition,
        unique_index: logic.unique_index || 0,
        condition_form_question_identifier: logic?.condition_form_question_identifier,
        condition_matrix_option_identifier: logic?.condition_matrix_option_identifier,
        to_page_no: this.skipto?.page_no,
        logic_group_order: logic?.logic_group_order,
        logic_group_identifier: logic?.group_identifier,
        group_logical_condition_operator: logic?.group_logical_condition_operator || null,
        is_active: logic.is_active
      }
      this.surveyService.updateDisplayLogic(data)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res?.message)
          },
          error: error => {
            this.toastr.error(error?.error?.message);
          }
        });
    }
  }
  addDisplaylogic(data: any) {
    this.surveyService.surveyDisplayLogic(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message)
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  deleteDisplayLogic(logic: any, index: any) {
    logic.is_active = 0;
    logic.isEdited = true;
    // this.checkLogicValid(logic);
  }
  copyDisplayLogic(group_set: any, logic: any) {
    this.isValidCondition = true;
    let unique_skip_id = 1;
    let l = this.logicSets?.length;
    let con = "";
    if (l == 0) {
      con = "";
    } else {
      con = "Or";
    }
    let g = this.groupLogic.length;
    let g_con = "";
    if (g == 0) {
      g_con = "";
    } else {
      g_con = "Or";
    }
    let logicCopied = {
      parent_question_identifier: this.skipto?.question_identifier,
      condition_question_identifier: logic?.condition_question_identifier,
      condition_question_option_identifier: logic?.condition_question_option_identifier,
      field_value: logic?.field_value || '',
      logical_operators: null,
      logical_operators_type: logic?.logical_operators_type,
      logical_condition: logic.logical_condition || con,
      unique_index: this.logicSets?.length + 1,
      condition_form_question_identifier: logic?.condition_form_question_identifier || null,
      condition_matrix_option_identifier: logic?.condition_matrix_option_identifier || null,
      logic_type: 1,
      condition_page_no: this.data.page_num,
      unique_skip_id: unique_skip_id,
      to_page_no: this.skipto?.page_no,
      logic_group_order: group_set?.group_order,
      logic_group_identifier: logic?.logic_group_identifier,
      group_logical_condition_operator: logic?.group_logical_condition_operator || g_con,
      logic_order: l + 1,
      question_type: logic?.question_type,
      is_active: 1,
      textFieldValid: logic?.textFieldValid || false
    }
    this.updateQuestion(logicCopied)
    this.logicSets.push(logicCopied);
    let logicSet: any = [];
    logicSet.push(logicCopied);
    if (group_set != null) {
      group_set?.question_skip_logical_data.push(logicCopied);
    } else {
      this.groupLogic.push({
        group_identifier: null,
        group_order: g + 1,
        page_no: this.data.page_num,
        is_active: 1,
        group_logical_condition_operator: g_con,
        question_skip_logical_data: logicSet
      })
      this.checkValid(group_set);
    }
    this.checkLogicValid(logicCopied);
  }
  deleteGroupDisplayLogic(sets: any, index: any) {
    if (sets.group_identifier) {
      sets.is_active = 0;
      //this.checkValid(sets)
    } else
      this.groupLogic.splice(index, 1);
  }
  updateQuestion(logic: any, isEdited = true) {
    this.conditionQuestionList.forEach(x => {
      if (x?.question_identifier == logic?.condition_question_identifier) {
        logic.question_type = x.question_type;
        logic.matrix_question_type = x.matrix_question_type;
        if (logic.question_type != 6)
          this.getLogicalOperators(logic.question_type);
        else this.getLogicalOperators(logic.matrix_question_type);
        if (x.question_type == 3 || x.question_type == 2 || x.question_type == 4) {
          logic.options = x.option;
        } else if (logic.question_type == 6) {
          logic.form_questions = x.form_questions;
          logic.matrix_option = x.matrix_option;
        } else if (logic.question_type == 5 || logic.question_type == 9) {
          logic.form_questions = x.form_questions;
        }
      }
    });
    this.checkLogicValid(logic, isEdited);
  }
  getLogicalOperators(question_type: any) {
    this.surveyService.getLogicalOperatorView(question_type)
      .subscribe({
        next: (res: any) => {
          this.operators[question_type] = res?.data;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  checkLogicValid(x: any, isEdited = true) {
    this.logicValid = false;
    x.isEdited = isEdited;
    if (((x.logical_operators_type == 7 || x.logical_operators_type == 8 ||
      x.logical_operators_type == 9 || x.logical_operators_type == 10 ||
      x.logical_operators_type == 11 || x.logical_operators_type == 12) &&
      (x.question_type == 1 || x.question_type == 7 || x.question_type == 8)) ||
      !x.textFieldValid) {
      if ((x.condition_question_identifier != undefined &&
        x.condition_question_identifier != "") &&
        (x.logical_operators_type != undefined && x.logical_operators_type != "") &&
        (this.skipto != "" && this.skipto != undefined)) {
        this.logicValid = true;
      } else {
        this.logicValid = false;
      }
    } else {
      if ((x.condition_question_identifier != undefined &&
        x.condition_question_identifier != "") &&
        (x.logical_operators_type != undefined && x.logical_operators_type != "") &&
        ((x.field_value != undefined && x.field_value != "") ||
          (x.condition_question_option_identifier != undefined && x.condition_question_option_identifier != "") ||
          (x.condition_form_question_identifier != "" && x.condition_form_question_identifier != undefined &&
            x.condition_matrix_option_identifier != "" && x.condition_matrix_option_identifier != undefined)) &&
        (this.skipto != "" && this.skipto != undefined)) {
        this.logicValid = true;
      } else {
        this.logicValid = false;
      }
    }
  }
  saveLogic() {
    let data: any[] = [];
    this.groupLogic.forEach(group_set => {
      if (group_set.is_active != 0) {
        group_set?.question_skip_logical_data.forEach(x => {
          if (x.logical_condition_identifier != "" && x.logical_condition_identifier != undefined) {
            //update
            x.group_logical_condition_operator = group_set?.group_logical_condition_operator
            if (group_set.isEdited) x.isEdited = true;
            this.updateDisplayLogic(x);
          } else {
            //add
            if (x.is_active == 1) {
              let unique_skip_id = 0;
              if (this.data.newSkip == 1) {
                this.skipLogicSets.filter((x: any) => {
                  return x.condition_page_no == this.data.page_num
                });
                if (this.skipLogicSets == undefined || this.skipLogicSets.length == 0) {
                  unique_skip_id = 1;
                } else {
                  unique_skip_id = this.skipLogicSets[this.skipLogicSets.length - 1].unique_skip_id + 1;
                }
              } else {
                unique_skip_id = 1//this.data.unique_skip_id;
              }
              data.push({
                survey_identifier: this.data.survey_identifier,
                parent_question_identifier: this.skipto?.question_identifier,
                condition_question_identifier: x?.condition_question_identifier,
                condition_question_option_identifier: x?.condition_question_option_identifier,
                field_value: x?.field_value || '',
                logical_operators: null,
                logical_operators_type: x?.logical_operators_type,
                logical_condition: x.logical_condition,
                unique_index: x.unique_index || 0,
                condition_form_question_identifier: x?.condition_form_question_identifier || null,
                condition_matrix_option_identifier: x?.condition_matrix_option_identifier || null,
                logic_type: 1,
                condition_page_no: this.data.page_num,
                unique_skip_id: unique_skip_id,
                to_page_no: this.skipto?.page_no,
                logic_group_order: x?.logic_group_order,
                logic_group_identifier: x?.logic_group_identifier,
                group_logical_condition_operator: x?.group_logical_condition_operator || null
              });
            }
          }
        });
      } else {
        if (group_set?.group_identifier)
          this.updateLogicGroup(group_set?.group_identifier)
      }
    });
    if (data.length > 0) {
      this.addDisplaylogic(data)
    }
    this._mdr.close(true);
  }
  updateLogicGroup(id: any) {
    let data = {
      is_active: 0
    }
    this.surveyService.updateLogicGroup(id, data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message)
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  textOperatorUpdate(logic: any, isEdited = true) {
    if (logic.question_type == 1 ||
      logic.question_type == 5 ||
      logic.question_type == 7 ||
      logic.question_type == 9 ||
      logic.matrix_question_type == 1 ||
      logic.matrix_question_type == 7 ||
      logic.matrix_question_type == 9 ||
      logic.question_type == 9) {
      logic.textFieldValid = true;
      if (logic.logical_operators_type == 7 ||
        logic.logical_operators_type == 8 ||
        logic.logical_operators_type == 9 ||
        logic.logical_operators_type == 10 ||
        logic.logical_operators_type == 11 ||
        logic.logical_operators_type == 12) {
        logic.textFieldValid = false;
      }
    }
    this.checkLogicValid(logic, isEdited)
  }
  getFormQuestion(question_identifier: any) {
    this.surveyService.surveyQuestionOptionFormView(question_identifier)
      .subscribe({
        next: (res: any) => {

        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getActivesetCount(sets: any) {
    let data = sets?.question_skip_logical_data.filter(set => {
      return set.is_active == 1
    })
    return data?.length;
  }
  getActiveGroupsetCount() {
    let data = this.groupLogic.filter(set => {
      return set.is_active == 1
    })
    return data?.length;
  }
}
