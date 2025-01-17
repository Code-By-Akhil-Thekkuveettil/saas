import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { SurveyQuestionActionComponent } from '../survey-question-action.component';

@Component({
  selector: 'app-question-display-logic',
  templateUrl: './question-display-logic.component.html',
  styleUrls: ['./question-display-logic.component.css']
})
export class QuestionDisplayLogicComponent implements OnInit {
  @Input() questions: any;
  @Input() data: any;
  logicValid: boolean = true;
  selectedComparison: any;
  selectedOperator: any;
  selectedValue: any;
  addLogic: boolean = false;
  logicSets: any[] = [];
  groupLogic: any[] = [];
  qtype: any;
  selectedQuestion: any;
  operators: any = {};

  constructor(private surveyService: SurveyService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<SurveyQuestionActionComponent>,
    public spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getDisplayLogic();
  }
  displayLogic(group_set: any) {
    this.logicValid = true;
    let unique_skip_id = 1;
    let l = 0;
    if (group_set) {
      l = group_set?.question_skip_logical_data.length;
      if (!(group_set?.question_skip_logical_data == undefined || l == 0)) {
        unique_skip_id = group_set?.question_skip_logical_data[l - 1].unique_skip_id + 1;
      }
    }
    let con = "";
    if (l > 0) {
      con = "Or";
    }
    let g = this.groupLogic.length;
    let g_con = "";
    if (g > 0) {
      g_con = "Or";
    }
    let logic = {
      condition_question_identifier: "",
      logic_order: l + 1,
      logic_group_order: group_set?.group_order || g + 1,
      logic_type: 0,
      unique_skip_id: unique_skip_id,
      parent_question_identifier: this.data?.question_identifier,
      logical_condition: con,
      unique_index: this.logicSets?.length + 1,
      to_page_no: this.data?.page_num,
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
  copyDisplayLogic(group_set: any, logic: any) {
    let unique_skip_id = 1;
    let l = this.logicSets?.length;
    let con = "";
    if (l > 0) {
      con = "Or";
    }
    let g = this.groupLogic.length;
    let g_con = "";
    if (g > 0) {
      g_con = "Or";
    }
    let logicCopied = {
      parent_question_identifier: this.data?.question_identifier,
      condition_question_identifier: logic?.condition_question_identifier,
      condition_question_option_identifier: logic?.condition_question_option_identifier,
      field_value: logic?.field_value || '',
      logical_operators: null,
      logical_operators_type: logic?.logical_operators_type,
      logical_condition: logic.logical_condition || con,
      unique_index: this.logicSets?.length + 1,
      condition_form_question_identifier: logic?.condition_form_question_identifier || null,
      condition_matrix_option_identifier: logic?.condition_matrix_option_identifier || null,
      logic_type: 2,
      condition_page_no: 0,
      unique_skip_id: unique_skip_id,
      to_page_no: this.data?.page_num,
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
  }
  deleteDisplayLogic(logic: any, index: any) {
    logic.is_active = 0;
    logic.isEdited = true;
  }
  deleteGroupDisplayLogic(sets: any, index: any) {
    if (sets.group_identifier) {
      sets.is_active = 0;
      // this.checkValid(sets)
    } else
      this.groupLogic.splice(index, 1);
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
        (x.logical_operators_type != undefined && x.logical_operators_type != "")) {
        this.logicValid = true;
      } else {
        this.logicValid = false;
      }
    } else if ((x.condition_question_identifier != undefined &&
      x.condition_question_identifier != "") &&
      (x.logical_operators_type != undefined && x.logical_operators_type != "") &&
      ((x.field_value != undefined && x.field_value != "") ||
        (x.condition_question_option_identifier != undefined && x.condition_question_option_identifier != "") ||
        (x.condition_form_question_identifier != "" && x.condition_form_question_identifier != undefined &&
          x.condition_matrix_option_identifier != "" && x.condition_matrix_option_identifier != undefined))) {
      this.logicValid = true;
    } else {
      this.logicValid = false;
    }
  }
  saveLogic() {
    let data: any[] = [];
    this.groupLogic.forEach(group_set => {
      if (group_set.is_active != 0) {
        group_set?.question_skip_logical_data.forEach(x => {
          if (x.logical_condition_identifier != "" && x.logical_condition_identifier != undefined) {
            //update
            x.group_logical_condition_operator = group_set?.group_logical_condition_operator;
            if (group_set.isEdited) x.isEdited = true;
            this.updateDisplayLogic(x);
          } else if (x.is_active == 1) {//add
            data.push({
              survey_identifier: this.data.survey_identifier,
              condition_question_identifier: x?.condition_question_identifier,
              condition_question_option_identifier: x?.condition_question_option_identifier,
              field_value: x?.field_value || '',
              logical_operators: null,
              logical_operators_type: x?.logical_operators_type,
              logical_condition: x.logical_condition,
              unique_index: x.unique_index || 0,
              condition_form_question_identifier: x?.condition_form_question_identifier || null,
              condition_matrix_option_identifier: x?.condition_matrix_option_identifier || null,
              logic_type: 0,
              unique_skip_id: x?.unique_skip_id,
              condition_page_no: 0,
              to_page_no: this.data?.page_num,
              logic_group_order: x?.logic_group_order,
              parent_question_identifier: this.data?.question_identifier,
              logic_group_identifier: x?.logic_group_identifier,
              group_logical_condition_operator: group_set?.group_logical_condition_operator || null
            })
          }
        });
      } else if (group_set?.group_identifier)
        this.updateLogicGroup(group_set?.group_identifier)
    });
    if (data.length > 0) {
      this.addDisplaylogic(data)
    }
    this._mdr.close();
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
        logic.logical_operators_type == 11 ||
        logic.logical_operators_type == 12) {
        logic.textFieldValid = false;
      }
    }
    this.checkLogicValid(logic, isEdited)
  }
  updateQuestion(logic: any, isEdited = true) {
    this.questions.forEach(x => {
      if (x?.question_identifier == logic?.condition_question_identifier) {
        logic.question_type = x.question_type;
        logic.matrix_question_type = x.matrix_question_type;
        if (logic.question_type != 6)
          this.getLogicalOperators(logic.question_type);
        else this.getLogicalOperators(logic.matrix_question_type);
        if (x.question_type == 2 || x.question_type == 3 || x.question_type == 4) {
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
  getDisplayLogic() {
    this.spinner.show();
    this.surveyService.getSurveyDisplayLogic(this.data.question_identifier, this.data.survey_identifier, 0)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          res?.data.forEach(skipp => {
            skipp.is_active = 1;
            this.groupLogic.push(skipp)
            skipp?.question_skip_logical_data.forEach(logic_skipp => {
              this.selectedComparison = "Or";
              this.updateQuestion(logic_skipp, false);
              this.textOperatorUpdate(logic_skipp, false)
              this.logicSets.push(logic_skipp)
            });
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  removedisplayLogic() {
    this.addLogic = false;
    this.selectedOperator = "";
    this.selectedQuestion = "";
    this.selectedValue = "";
  }
  updateDisplayLogic(logic: any) {
    if (logic.isEdited) {
      if (logic.field_value == undefined) {
        logic.field_value = "";
      }
      let data = {
        logical_condition_identifier: logic?.logical_condition_identifier,
        survey_identifier: logic.survey_identifier,
        condition_question_identifier: logic?.condition_question_identifier,
        condition_question_option_identifier: logic?.condition_question_option_identifier,
        field_value: logic?.field_value,
        logical_operators: null,
        logical_operators_type: logic?.logical_operators_type,
        logical_condition: logic?.logical_condition,
        unique_index: logic.unique_index || 0,
        condition_form_question_identifier: logic?.condition_form_question_identifier,
        condition_matrix_option_identifier: logic?.condition_matrix_option_identifier,
        logic_type: 0,
        unique_skip_id: logic?.unique_skip_id,
        parent_question_identifier: this.data?.question_identifier,
        condition_page_no: 0,
        to_page_no: this.data?.page_num,
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
