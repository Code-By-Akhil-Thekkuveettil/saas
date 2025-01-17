import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyComponent } from './survey.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { UtilsModule } from 'src/app/shared/utils/utils.module';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { NewSurveyQuestionsComponent } from './new-survey-questions/new-survey-questions.component';
import { ViewResponseComponent } from './view-response/view-response.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { SurveySettingsComponent } from './survey-settings/survey-settings.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SurveyQuestionActionComponent } from './survey-question-action/survey-question-action.component';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { SurveyAddSkipLogicComponent } from './survey-add-skip-logic/survey-add-skip-logic.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table'
import { SurveyDistributionComponent } from './survey-distribution/survey-distribution.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { QuotaSettingsComponent } from './quota-settings/quota-settings.component';
import { SurveyOptionEditComponent } from './survey-option-edit/survey-option-edit.component';
import { SurveyQuestionJavascriptComponent } from './survey-question-javascript/survey-question-javascript.component';
import { SurveyFlowComponent } from './survey-flow/survey-flow.component';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { PreviewQuestionPopupComponent } from './preview-question-popup/preview-question-popup.component';
import { TextBoxTypeComponent } from './templates/text-box-type/text-box-type.component';
import { TextMediaTypeComponent } from './templates/text-media-type/text-media-type.component';
import { MultipleChoiceTypeComponent } from './templates/multiple-choice-type/multiple-choice-type.component';
import { ImportQuestionPopupComponent } from './import-question-popup/import-question-popup.component';
import { MatSortModule } from '@angular/material/sort';
import { CreateEditPagePopupComponent } from './create-edit-page-popup/create-edit-page-popup.component';
import { PipeTextComponent } from './new-survey-questions/pipe-text/pipe-text.component';
import { ChoiceDisplayLogicComponent } from './choice-display-logic/choice-display-logic.component';
import { QuestionDisplayLogicComponent } from './survey-question-action/question-display-logic/question-display-logic.component';
import { PageActionComponent } from './create-edit-page-popup/page-action/page-action.component';
import { SignatureComponentComponent } from './preview-question-popup/signature-component/signature-component.component';

@NgModule({
  declarations: [
    SurveyComponent,
    NewSurveyComponent,
    SurveyListComponent,
    NewSurveyQuestionsComponent,
    ViewResponseComponent,
    SurveySettingsComponent,
    SurveyQuestionActionComponent,
    SurveyAddSkipLogicComponent,
    SurveyDistributionComponent,
    QuotaSettingsComponent,
    SurveyOptionEditComponent,
    SurveyQuestionJavascriptComponent,
    SurveyFlowComponent,
    DeletePopupComponent,
    PreviewQuestionPopupComponent,
    SignatureComponentComponent,
    TextBoxTypeComponent,
    TextMediaTypeComponent,
    MultipleChoiceTypeComponent,
    ImportQuestionPopupComponent,
    CreateEditPagePopupComponent,
    PipeTextComponent,
    ChoiceDisplayLogicComponent,
    QuestionDisplayLogicComponent,
    PageActionComponent
  ],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    ClipboardModule,
    NgxPaginationModule,
    BsDatepickerModule,
    UtilsModule,
    MatDialogModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    AngularEditorModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    // BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [DatePipe,
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { color: 'primary' } as MatCheckboxDefaultOptions }
  ]
})
export class SurveyModule { }
