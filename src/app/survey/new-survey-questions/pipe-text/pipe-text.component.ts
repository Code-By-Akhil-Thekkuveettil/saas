import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SurveyService } from 'src/app/shared/services/survey.service';

@Component({
  selector: 'app-pipe-text',
  templateUrl: './pipe-text.component.html',
  styleUrls: ['./pipe-text.component.css']
})
export class PipeTextComponent implements OnInit {
  @Input() id: any;
  @Input() question_id: any;
  @Output() addPipeText: EventEmitter<any> = new EventEmitter<any>();
  questionDataList: any = [];
  questions: any = [];
  conditionList: any = [];
  variables: any = [];
  qLoading: boolean = true;
  eLoading: boolean = true;

  constructor(
    private surveyService: SurveyService,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,) {
  }
  addPipe(p_question: any, node: any) {
    let order = "";
    if (node?.option_order)
      order = "/" + node?.option_order;
    let pipedText = "${q:/" + p_question?.question_identifier + "/" + node?.label_name + order + '}'
    this.addPipeText.emit(pipedText)
  }
  addEmbeddedDataPipe(variable) {
    let pipedText = "${e:/" + variable + '}'
    this.addPipeText.emit(pipedText)
  }
  ngOnInit(): void {
  }
  showPipe() {
    this.getQuestionPiping();
    this.getQuestionList();
  }
  getAllVariables() {
    this.eLoading = true;
    this.surveyService.getAllSurveyVariables(this.id)
      .subscribe({
        next: (res: any) => {
          this.eLoading = false;
          this.variables = res.data;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  filterQuestion(question_identifier: any) {
    let questions: any = [];
    let q_index;
    this.questionDataList?.forEach((qstn: any, index: any) => {
      if (qstn.question_identifier == question_identifier) {
        q_index = index;
        return questions?.filter((x: any) => { return x?.question_type != 8 });
      } else {
        if ((q_index == undefined || index < q_index))
          questions.push(qstn);
      }
    })
    return questions?.filter((x: any) => { return x?.question_type != 8 });
  }
  getQuestionList() {
    this.spinner.show();
    this.qLoading = true;
    this.questions = [];
    this.surveyService.surveyAllQuestions(this.id)
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          let questions = res?.data?.questions;
          this.questionDataList = [];
          this.qLoading = false;
          const textConditions = this.conditionList?.filter((x: any) => { return x?.id == 13 })
          const formConditions = this.conditionList?.filter((x: any) => { return x?.id == 5 })
          const matrixConditions = this.conditionList?.filter((x: any) => { return x?.id == 8 })
          const textEntryCondition = this.conditionList?.filter((x: any) => { return x?.id == 4 });
          questions?.forEach((qstn: any, index: any) => {
            let pipeTextOptions: any = [];
            let pipeOptions: any = [];
            //choice pipe
            let choiceConditions = [];
            if (qstn.question_type == 2 || qstn.question_type == 3 || qstn.question_type == 4) {
              if (qstn.question_type == 2) {
                choiceConditions = this.conditionList?.filter((x: any) => {
                  return x?.id == 3 || x.id == 6 || x.id == 7 || x.id == 14
                })
              } else {
                choiceConditions = this.conditionList?.filter((x: any) => {
                  return x?.id == 3 || x.id == 6 || x.id == 7
                })
              }
              pipeTextOptions = choiceConditions;
              qstn?.option?.forEach((element) => {
                pipeOptions = [];
                pipeOptions.push({
                  id: this.conditionList[0]?.id,
                  label_name: this.conditionList[0]?.label_name,
                  name: this.conditionList[0]?.name,
                  option_order: element?.option_order,
                  option_piping_identifier: element?.option_identifier
                })
                pipeOptions.push({
                  id: this.conditionList[1]?.id,
                  label_name: this.conditionList[1]?.label_name,
                  name: this.conditionList[1].name,
                  option_order: element?.option_order,
                  option_piping_identifier: element?.option_identifier
                })
                pipeOptions.push({
                  id: this.conditionList[8]?.id,
                  label_name: this.conditionList[8]?.label_name,
                  name: this.conditionList[8].name,
                  option_order: element?.option_order,
                  option_piping_identifier: element?.option_identifier
                })
                pipeTextOptions.push({
                  id: textEntryCondition[0]?.id,
                  label_name: textEntryCondition[0]?.label_name,
                  name: element?.choices,
                  option_order: element?.form_question_order,
                  option_piping_identifier: element?.form_identifier,
                  pipeOptions: pipeOptions
                });
                if (element?.text_entry == 1) {
                  pipeTextOptions.push({
                    id: textEntryCondition[0]?.id,
                    label_name: textEntryCondition[0]?.label_name,
                    name: element?.choices + " (" + textEntryCondition[0]?.label_name + ")",
                    option_order: element?.option_order,
                    option_piping_identifier: element?.option_identifier,
                  });
                }
              });
            } else if (qstn.question_type == 5 || qstn.question_type == 6 || qstn.question_type == 9) {
              if (qstn.question_type == 9) {//total
                pipeTextOptions.push({
                  id: this.conditionList[11]?.id,
                  label_name: this.conditionList[11]?.label_name,
                  name: this.conditionList[11].name,
                })
              }
              qstn?.form_questions?.forEach((element) => {
                pipeOptions = [];
                pipeOptions.push({
                  id: formConditions[0]?.id,
                  label_name: formConditions[0]?.label_name,
                  name: formConditions[0]?.name,
                  option_order: element?.form_question_order,
                  option_piping_identifier: element?.form_identifier
                })
                pipeOptions.push({
                  id: this.conditionList[9]?.id,
                  label_name: this.conditionList[9]?.label_name,
                  name: this.conditionList[9].name,
                  option_order: element?.form_question_order,
                  option_piping_identifier: element?.form_identifier
                })
                pipeTextOptions.push({
                  id: formConditions[0]?.id,
                  label_name: formConditions[0]?.label_name,
                  name: element?.choices,
                  option_order: element?.form_question_order,
                  option_piping_identifier: element?.form_identifier,
                  pipeOptions: pipeOptions
                });
                if (qstn.question_type == 6) {
                  qstn?.matrix_option?.forEach((option) => {
                    let pipeOptionsCopy: any = pipeOptions;
                    pipeOptionsCopy.push({
                      id: matrixConditions[0]?.id,
                      label_name: matrixConditions[0]?.label_name,
                      name: option?.matrix_options + " (" + matrixConditions[0]?.name + ")",
                      option_order: element?.form_question_order + "/" + option?.matrix_options_order,
                      option_piping_identifier: option?.matrix_option_identifier
                    })
                    pipeTextOptions.pipeOptions = pipeOptionsCopy
                  });
                }
              });
              if (qstn.question_type == 6) {
                qstn?.matrix_option?.forEach((option) => {
                  pipeTextOptions.push({
                    id: this.conditionList[10]?.id,
                    label_name: this.conditionList[10]?.label_name,
                    name: option?.matrix_options + " (" + this.conditionList[10]?.name + ")",
                    option_order: option?.matrix_options_order,
                    option_piping_identifier: option?.matrix_option_identifier
                  })
                });
              }
            } else {            //text entry pipe
              pipeTextOptions = textConditions;
            }
            this.questionDataList.push({
              question: qstn.question,
              question_type: qstn.question_type,
              question_identifier: qstn.question_identifier,
              unique_question_num: qstn?.unique_question_num,
              pipeTextOptions: pipeTextOptions,
            })
          });
          this.questions = this.questionDataList;//this.filterQuestion(this.question_id);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
  getQuestionPiping() {
    this.qLoading = true;
    this.surveyService.pipingConditionList()
      .subscribe({
        next: (res: any) => {
          this.qLoading = false;
          this.conditionList = res?.data;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }
}
