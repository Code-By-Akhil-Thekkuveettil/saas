import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ChoiceLogic } from 'src/app/model/ChoiceLogic';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-choice-display-logic',
  templateUrl: './choice-display-logic.component.html',
  styleUrls: ['./choice-display-logic.component.css']
})
export class ChoiceDisplayLogicComponent implements OnInit {
  selectedQuestion: any;
  questions: any[] = [];
  selectedOperator: any;
  selectedValue: any;
  addLogic: boolean = false;
  logicSets: any[] = [];
  groupLogic: any[] = [];
  qtype: any;
  isValidCondition: boolean = false;
  selectedComparison: any;
  logicValid: boolean = true;
  question_type: any;
  question: any;
  operators: any = {};

  constructor(
    private surveyService: SurveyService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<ChoiceDisplayLogicComponent>,
    public spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.getQuestionList();
  }
  closeDialog() {
    this._mdr.close()
  }
  getQuestionList() {
    this.spinner.show();
    this.questions = [];
    this.surveyService.surveyFullView(this.data.survey_identifier)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          let pages = res.data.survey_data;
          let questionIndex: any;
          pages?.forEach((x: any) => {
            if (x.questions.length > 0) {
              x.questions.forEach((qstn: any, index: any) => {
                if (qstn.question_identifier == this.data.question_identifier) {
                  questionIndex = index;
                } else {
                  if (x.page_order <= this.data.page_order && (questionIndex == undefined || index < questionIndex)) {
                    this.questions.push(qstn);
                  }
                }
              });
            }
          });
          this.getDisplayLogic();
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });

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
  //get choiceDisplay logic
  getDisplayLogic() {
    this.spinner.show();
    let data = {
      survey_identifier: this.data.survey_identifier,
      question_identifier: this.data.question_identifier,
      option_identifier: this.data.option_identifier || null,
      form_question_identifier: this.data.form_question_identifier || null,
      form_option_identifier: this.data.form_option_identifier || null,
      matrix_option_identifier: this.data.matrix_option_identifier || null
    }
    this.surveyService.viewChoiceDisplayLogic(data)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.isValidCondition = true;
          this.groupLogic = Object.values(
            res?.data?.option_display_logic_list?.reduce((acc, current) => {
              acc[current.logic_group_unique_identifier] = acc[current.logic_group_unique_identifier] ?? [];
              let option_display_logic_list: any = {
                logic_group_unique_identifier: current?.logic_group_unique_identifier,
                group_order: current?.group_order,
                is_active_logic_group: current?.is_active_logic_group,
                group_logic_condition_operator: current?.group_logic_condition_operator,
                option_display_logic_list: []
              }
              if (!acc[current.logic_group_unique_identifier]?.option_display_logic_list)
                acc[current.logic_group_unique_identifier] = option_display_logic_list;
              acc[current.logic_group_unique_identifier].option_display_logic_list.push(current)
              return acc;
            }, {})
          );

          res?.data?.option_display_logic_list?.forEach(element => {
            this.selectedComparison = "Or";
            this.updateQuestion(element, false);
            this.textOperatorUpdate(element, false)
            this.logicSets.push(element)
          });
        },
        error: error => {
          this.spinner.hide();
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
    if (logic.condition_value == undefined) {
      logic.condition_value = "";
    }
    let data = {
      survey_identifier: this.data.survey_identifier,
      question_identifier: this.data.question_identifier,
      option_identifier: this.data.option_identifier || null,
      form_question_identifier: this.data.form_question_identifier || null,
      form_option_identifier: this.data.form_option_identifier || null,
      matrix_option_identifier: this.data.matrix_option_identifier || null,
      "condition_question_identifier": logic.condition_question_identifier,
      "condition_option_identifier": logic.condition_option_identifier || null,
      condition_form_question_identifier: logic.condition_form_question_identifier || null,
      condition_form_option_identifier: logic.condition_form_option_identifier || null,
      condition_matrix_option_identifier: logic.condition_matrix_option_identifier || null,
      "option_logic_unique_identifier": logic.option_logic_unique_identifier,
      "logic_group_unique_identifier": logic.logic_group_unique_identifier,
      "group_logic_condition_operator": logic.group_logic_condition_operator || null,
      "option_logic_condition_operator": logic.option_logic_condition_operator || null,
      "group_order": logic.group_order,
      logic_order: logic.logic_order,
      "condition": logic.condition,
      "is_active_option_logic": logic.is_active_option_logic,
      "is_active_logic_group": logic.is_active_logic_group,
      condition_value: logic.condition_value
    }
    this.surveyService.updateChoiceDisplayLogic(data)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message)
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  displayLogic(group_set: any) {
    this.logicValid = true;
    let l = 0;
    if (group_set) {
      l = group_set?.option_display_logic_list?.length;
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
    let logic: any = {
      condition_question_identifier: null,
      condition_option_identifier: null,
      condition_form_question_identifier: null,
      condition_form_option_identifier: null,
      condition_matrix_option_identifier: null,
      option_logic_unique_identifier: null,
      logic_group_unique_identifier: null,
      group_logic_condition_operator: g_con,
      option_logic_condition_operator: con,
      group_order: group_set?.group_order || g + 1,
      logic_order: l + 1,
      condition: null,
      condition_value: "",
      is_active_option_logic: 1,
      is_active_logic_group: 1
    }
    this.logicSets.push(logic);
    let logicSet: any = [];
    logicSet.push(logic);
    if (group_set != null) {
      group_set?.option_display_logic_list.push(logic);
    } else {
      this.groupLogic.push({
        logic_group_unique_identifier: null,
        group_order: g + 1,
        is_active_logic_group: 1,
        group_logic_condition_operator: g_con,
        option_display_logic_list: logicSet
      })
      this.checkValid(group_set);
    }
    this.checkLogicValid(logic);
  }
  copyDisplayLogic(group_set: any, logic: any) {
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
      condition_question_identifier: logic?.condition_question_identifier,
      condition_option_identifier: logic?.condition_option_identifier,
      condition_form_question_identifier: logic?.condition_form_question_identifier,
      condition_form_option_identifier: logic?.condition_form_option_identifier,
      condition_matrix_option_identifier: logic?.condition_matrix_option_identifier,
      option_logic_unique_identifier: null,
      logic_group_unique_identifier: logic?.logic_group_unique_identifier,
      group_logic_condition_operator: g_con,
      option_logic_condition_operator: con,
      group_order: group_set?.group_order || g + 1,
      logic_order: l + 1,
      condition: logic?.condition,
      is_active_option_logic: 1,
      is_active_logic_group: 1,
      condition_value: logic?.condition_value,
      textFieldValid: logic?.textFieldValid || false

    }
    this.updateQuestion(logicCopied)
    this.logicSets.push(logicCopied);
    let logicSet: any = [];
    logicSet.push(logicCopied);
    if (group_set != null) {
      group_set?.option_display_logic_list.push(logicCopied);
    } else {
      this.groupLogic.push({
        logic_group_unique_identifier: null,
        group_order: g + 1,
        page_no: this.data.page_num,
        is_active_logic_group: 1,
        group_logic_condition_operator: g_con,
        option_display_logic_list: logicSet
      })
      this.checkValid(group_set);
    }
    this.checkLogicValid(logicCopied);
  }
  checkValid(sets: any) {
    if (sets != null) {
      if (sets?.length > 1) {
        if (sets.is_active_logic_group && (sets?.group_logic_condition_operator == undefined || sets?.group_logic_condition_operator == "")) {
          this.logicValid = false
        } else {
          this.logicValid = true
        }
      }
    }
  }
  deleteDisplayLogic(logic: any, index: any) {
    logic.is_active_option_logic = 0;
    this.checkLogicValid(logic, true);
  }
  deleteGroupDisplayLogic(sets: any, index: any) {
    if (sets.logic_group_unique_identifier) {
      sets.is_active_logic_group = 0;
      this.checkValid(sets)
    } else
      this.groupLogic.splice(index, 1);
  }
  updateQuestion(logic: any, isEdited = true) {
    this.questions.forEach(x => {
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
  checkLogicValid(x: any, isEdited = true) {
    this.logicValid = false;
    x.isEdited = isEdited;
    if (((x.condition == 7 || x.condition == 8 ||
      x.condition == 9 || x.condition == 10 ||
      x.condition == 11 || x.condition == 12) &&
      (x.question_type == 1 || x.question_type == 7 || x.question_type == 8)) ||
      !x.textFieldValid) {
      if ((x.condition_question_identifier != undefined &&
        x.condition_question_identifier != "") &&
        (x.condition != undefined && x.condition != "")) {
        this.logicValid = true;
      } else {
        this.logicValid = false;
      }
    } else {
      if ((x.condition_question_identifier != undefined &&
        x.condition_question_identifier != "") &&
        (x.condition != undefined && x.condition != "") &&
        ((x.condition_value != undefined && x.condition_value != "") ||
          (x.condition_option_identifier != undefined && x.condition_option_identifier != "") ||
          (x.condition_form_question_identifier != "" && x.condition_form_question_identifier != undefined &&
            x.condition_matrix_option_identifier != "" && x.condition_matrix_option_identifier != undefined))
      ) {
        this.logicValid = true;
      } else {
        this.logicValid = false;
      }
    }
  }
  saveLogic() {
    let option_display_logic_list: any[] = [];
    this.groupLogic.forEach(group_set => {
      if (group_set.is_active_logic_group != 0) {
        group_set?.option_display_logic_list.forEach(x => {
          let data = {
            condition_question_identifier: x?.condition_question_identifier || null,
            condition_option_identifier: x?.condition_option_identifier || null,
            condition_form_question_identifier: x?.condition_form_question_identifier || null,
            condition_form_option_identifier: x?.condition_form_option_identifier || null,
            condition_matrix_option_identifier: x?.condition_matrix_option_identifier || null,
            condition_value: x?.condition_value || "",
            option_logic_unique_identifier: x?.option_logic_unique_identifier,
            logic_group_unique_identifier: x?.logic_group_unique_identifier,
            group_logic_condition_operator: x?.group_logic_condition_operator,
            option_logic_condition_operator: x?.option_logic_condition_operator,
            group_order: group_set?.group_order,
            logic_order: x?.logic_order,
            condition: x?.condition,
            is_active_option_logic: x.is_active_option_logic,
            is_active_logic_group: x.is_active_logic_group
          }
          if (x.option_logic_unique_identifier != undefined) {
            //update
            if (group_set.isEdited || x.isEdited) { this.updateDisplayLogic(data) }
          } else {
            //add
            if (x.is_active_option_logic == 1) {
              option_display_logic_list.push(data)
            }
          }
        });
      } else {
        /*  if (group_set?.logic_group_unique_identifier)
           this.updateLogicGroup(group_set?.logic_group_unique_identifier) */
      }
    });
    if (option_display_logic_list.length > 0) {
      this.addDisplaylogic(option_display_logic_list)
    }
    this._mdr.close(true);
  }
  addDisplaylogic(option_display_logic_list: any) {
    let data = {
      option_display_logic: {
        survey_identifier: this.data.survey_identifier,
        question_identifier: this.data.question_identifier,
        option_identifier: this.data.option_identifier || null,
        form_question_identifier: this.data.form_question_identifier || null,
        form_option_identifier: this.data.form_option_identifier || null,
        matrix_option_identifier: this.data.matrix_option_identifier || null,
        option_display_logic_list: option_display_logic_list
      }
    }
    this.surveyService.addChoiceDisplayLogic(data)
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
      is_active_logic_group: 0
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
      if (logic.condition == 7 ||
        logic.condition == 8 ||
        logic.condition == 9 ||
        logic.condition == 10 ||
        logic.condition == 11 ||
        logic.condition == 12) {
        logic.textFieldValid = false;
      }
    }
    this.checkLogicValid(logic, isEdited)
  }
  getActivesetCount(sets: any) {
    let data = sets?.question_skip_logical_data?.filter(set => {
      return set.is_active_logic_group == 1
    })
    return data?.length;
  }
  getActiveGroupsetCount() {
    let data = this.groupLogic?.filter(set => {
      return set.is_active_logic_group == 1
    })
    return data?.length;
  }

  surveyQuestionUpdate(data: any) {
    this.surveyService.surveyQuestionUpdate(data, this.data.question_identifier)
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






}
