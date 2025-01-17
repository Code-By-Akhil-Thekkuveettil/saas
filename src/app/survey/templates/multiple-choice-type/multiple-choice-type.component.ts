import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ChoiceDisplayLogicComponent } from '../../choice-display-logic/choice-display-logic.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-multiple-choice-type',
  templateUrl: './multiple-choice-type.component.html',
  styleUrls: ['./multiple-choice-type.component.css']
})
export class MultipleChoiceTypeComponent implements OnInit {
  @Input() id: any;
  @Input() page_order: any;
  @Input() question: any;
  @Output() updateQuestion = new EventEmitter();
  @Output() addPipeText = new EventEmitter();
  @Output() addnewoption = new EventEmitter();
  @Output() editOptions = new EventEmitter();
  @Output() multipleConvertionAlreadyAdded = new EventEmitter();
  @Output() updateOption = new EventEmitter();
  @Output() deleteDialog = new EventEmitter();
  optionLoaded: boolean = false;

  newoption: string = "";
  popup: MatDialogRef<ChoiceDisplayLogicComponent> | undefined;

  constructor(private surveyService: SurveyService,
    private matDialog: MatDialog,
    public spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    //init
  }
  addPipe(pipedText: any, node: any) {
    this.addPipeText.emit({ pipedText: pipedText, node: node })
  }
  update(question) {
    this.updateQuestion.emit(question)
  }
  addMultipleAlreadyAdded(question: any) {
    question.isMultipleOptions = true;
  }
  addNew(question: any) {
    question.isnew = true;
    this.addNewOpt(question.question_identifier, this.newoption)
  }
  addNewOpt(question_identifier: any, option: any) {
    this.addnewoption.emit({ question_identifier: question_identifier, option: option });
  }
  editOpt(items: any) {
    this.editOptions.emit({ item: items, question_type: this.question.question_type });
  }
  multiConvertionAlreadyAdded(question: any) {
    this.multipleConvertionAlreadyAdded.emit(question)
  }

  multipleConvertionCancel(question: any) {
    question.isMultipleOptions = false;
  }
  openConfirmationDialog(type: any, value: any, options: any = "") {
    this.deleteDialog.emit({ type: type, value: value, options: options })
  }
  isExclusive(item: any) {
    if (item.is_exclusive != 1) {
      item.is_exclusive = 1;
    } else {
      item.is_exclusive = 0;
    }
    this.updateOpt(item);
  }
  updateOpt(item: any) {
    this.updateOption.emit(item)
  }
  allowTextEntry(item: any) {
    if (item.text_entry != 1) {
      item.text_entry = 1;
      item.is_required_text_entry = 1;
    } else {
      item.text_entry = 0;
      item.is_required_text_entry = 0;
    }
    this.updateOpt(item);
  }
  allowTextEntryRequired(item: any) {
    if (item.is_required_text_entry != 1) {
      item.is_required_text_entry = 1;
    } else {
      item.is_required_text_entry = 0;
    }
    this.updateOpt(item);
  }
  default_option(item: any, options: any) {
    if (item.default_option != 1) {
      item.default_option = 1;
    } else {
      item.default_option = 0;
    }
    this.updateOpt(item);
  }
  moveOption(from: any, to: any) {
    let data = {
      "survey_identifier": this.id,
      "question_identifier": this.question?.question_identifier,
      "option_order": from,
      "move_to_option_order": to
    };
    this.surveyService.moveOption(data)
      .subscribe({
        next: (resp: any) => {
          this.update(this.question)
        },
        error: (error: any) => {
         
        }
      });
  }
  loadOptions(event) {
    if (event.checked) {
      this.spinner.show()
      this.optionLoaded = false;
      this.surveyService.surveyQuestionOptionView(this.question?.question_identifier)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            this.optionLoaded = true;
            this.question.option = res?.data;
          },
          error: error => {
          }
        });
    } else {
      this.optionLoaded = false;
      this.question.option = [];
    }
  }

  displayLogic(item: any) {
    this.popup = this.matDialog.open(ChoiceDisplayLogicComponent, {
      disableClose: true,
      height: 'auto',
      width: '800px',
      data: {
        survey_identifier: this.id,
        page_order: this.page_order,
        question_identifier: this.question?.question_identifier,
        option_identifier: item?.option_identifier,
      }
    });

    this.popup.afterClosed().subscribe(res => {
     
    });
  }
}
