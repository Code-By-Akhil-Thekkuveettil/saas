import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  apiUrl: any;
  constructor(private http: HttpClient,
    configurationLoader: ConfigLoaderService) {
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }
  createSurvey(data: any) {
    let url = this.apiUrl + 'survey/createsurvey';
    return this.http.post(url, data);
  }
  surveyViewQuestion(id: any, limit: number = 10, offset: number = 0): Observable<any> {
    let url = this.apiUrl + 'survey/new/survey/admin/view?survey_identifier=' + id + '&limit=' + limit + '&offset=' + offset;
    return this.http.get(url);
  }
  getSurveyUrlToken(id: any) {
    let url = this.apiUrl + 'survey/new/survey_url/view/' + id;
    return this.http.get(url);
  }
  surveySettings(id: any): Observable<any> {
    let url = this.apiUrl + 'survey/new/survey_view/' + id;
    return this.http.get(url);
  }
  updateSettings(data: any): Observable<any> {
    let url = this.apiUrl + 'survey_settings/settings/create_or_update';
    return this.http.post(url, data);
  }
  viewSettings(id: any): Observable<any> {
    let url = this.apiUrl + 'survey_settings/settings/view/' + id;
    return this.http.get(url);
  }
  surveyUpdate(surveyId: any, data: any) {
    let url = this.apiUrl + 'survey/new/surveyupdate/' + surveyId;
    return this.http.post(url, data);
  }
  addPageSurvey(data: any) {
    let url = this.apiUrl + 'survey/new/survey/page/add';
    return this.http.post(url, data);
  }
  editPageSurvey(data: any, id: any) {
    let url = this.apiUrl + 'survey/survey/page/update/' + id;
    return this.http.post(url, data);
  }
  getSurveyRedirectLink(id: any) {
    let url = this.apiUrl + 'survey/new/redirect_urls/view/' + id;
    return this.http.get(url);
  }
  getSurveyRedirectLinkByPagenum(id: any, page_no: any) {
    let url = this.apiUrl + 'survey/new/redirect_urls/view/' + id + '?page_no=' + page_no;
    return this.http.get(url);
  }
  surveyQuestionTypeList() {
    let url = this.apiUrl + 'survey/new/survey_questiontype/view';
    return this.http.get(url);
  }
  surveyPageView(survey_identifier: any) {
    let url = this.apiUrl + 'survey/new/survey/page/view?survey_identifier=' + survey_identifier;
    return this.http.get(url);
  }
  surveyQuestionSave(data: any) {
    let url = this.apiUrl + 'survey/new/survey_questions/create';
    return this.http.post(url, data);
  }
  libraryQuestionListView() {
    let url = this.apiUrl + 'survey/new/library/question/list/view';
    return this.http.get(url);
  }
  getQuestionCreate(data: any) {
    let url = this.apiUrl + 'survey/new/library/question/create';
    return this.http.post(url, data);
  }
  getQuestionView(id: any) {
    let url = this.apiUrl + 'survey/new/survey_questions/view/' + id;
    return this.http.get(url);
  }
  surveyQuestionUpdate(data: any, questionId: any) {
    let url = this.apiUrl + 'survey/new/survey_questions/update/' + questionId;
    return this.http.post(url, data);
  }
  addValidation(data: any) {
    let url = this.apiUrl + 'validation/validation/add';
    return this.http.post(url, data);
  }
  updateValidation(data: any, id: any) {
    let url = this.apiUrl + 'validation/validation/update/' + id;
    return this.http.post(url, data);
  }
  viewValidation(survey_identifier: any, question_identifier: any, param: any = "") {
    let url = this.apiUrl + 'validation/validation/view?survey_identifier=' + survey_identifier + '&question_identifier=' + question_identifier + param;
    return this.http.get(url);
  }
  pipingConditionList() {
    let url = this.apiUrl + 'common/condition/type/view';
    return this.http.get(url);
  }
  addPiping(data: any) {
    let url = this.apiUrl + 'pipings/question/piping/mapping/add'
    return this.http.post(url, data);
  }
  updatePiping(data: any) {
    let url = this.apiUrl + 'pipings/question/piping/mapping/update'
    return this.http.post(url, data);
  }
  viewPiping(survey_identifier: any, question_identifier: any) {
    let url = this.apiUrl + 'pipings/question/piping/mapping/view?survey_identifier=' + survey_identifier + '&question_identifier=' + question_identifier
    return this.http.get(url);
  }
  getValidationTypes(id: any) {
    let url = this.apiUrl + 'validation/validation/type/view?question_type=' + id;
    return this.http.get(url);
  }
  surveyQuestionOptionSave(data: any) {
    let url = this.apiUrl + 'survey/new/survey_options/create';
    return this.http.post(url, data);
  }
  surveyQuestionOptionView(questionId: any) {
    let url = this.apiUrl + 'survey/new/survey_options/view/' + questionId;
    return this.http.get(url);
  }
  surveyQuestionOptionFormSave(data: any) {
    let url = this.apiUrl + 'survey/new/form_questions/create';
    return this.http.post(url, data);
  }
  surveyQuestionOptionFormView(questionId: any) {
    let url = this.apiUrl + 'survey/new/form_questions/get/' + questionId;
    return this.http.get(url);
  }
  surveyQuestionOptionFormUpdate(data: any, questionId: any) {
    let url = this.apiUrl + 'survey/new/form_questions/update/' + questionId;
    return this.http.post(url, data);
  }
  surveyMatrixColUpdate(data: any, questionId: any) {
    let url = this.apiUrl + 'survey/new/matrix_options/update/' + questionId;
    return this.http.post(url, data);
  }
  surveyOptionMatrixColSave(data: any) {
    let url = this.apiUrl + 'survey/new/matrix_options/create';
    return this.http.post(url, data);
  }
  updateFormOptions(data: any, id: any) {
    let url = this.apiUrl + 'survey/new/form_options/update/' + id;
    return this.http.post(url, data);
  }
  createFormOptions(data: any) {
    let url = this.apiUrl + 'survey/new/form_options/create';
    return this.http.post(url, data);
  }
  surveyFullView(survey_identifier: any) {
    let url = this.apiUrl + 'survey/survey_details/view?survey_identifier=' + survey_identifier;
    return this.http.get(url);
  }
  surveyAllQuestions(survey_identifier: any) {
    let url = this.apiUrl + 'pipings/question/list/piping?survey_identifier=' + survey_identifier;
    return this.http.get(url);
  }
  surveyQuestionOptionUpdate(data: any, option_identifier: any) {
    let url = this.apiUrl + 'survey/new/survey_options/update/' + option_identifier;
    return this.http.post(url, data);
  }
  surveyDisplayLogic(data: any) {
    let url = this.apiUrl + 'survey/new/question/logical/condition/add';
    return this.http.post(url, data);
  }
  updateDisplayLogic(data: any) {
    let url = this.apiUrl + 'survey/new/question/logical/condition/update';
    return this.http.post(url, data);
  }
  getSurveyLogic(page_no: any, survey: any) {
    let url = this.apiUrl + 'survey/new/question/logical/condition/view?survey_identifier=' + survey + '&page_no=' + page_no;
    return this.http.get(url);
  }
  getLogicalOperatorView(question_type: any) {
    let url = this.apiUrl + 'display_logic/logical/operator/view?question_type=' + question_type;
    return this.http.get(url);
  }
  getSurveyDisplayLogic(id: any, survey: any, page_no: any) {
    let url = this.apiUrl + 'survey/new/question/logical/condition/view?survey_identifier=' + survey + '&page_no=' + page_no + '&parent_question_identifier=' + id;
    return this.http.get(url);
  }
  surveyAddVariables(data: any, id: any) {
    let url = this.apiUrl + 'survey/new/variables/create?survey_identifier=' + id;
    return this.http.post(url, data);
  }
  getSurveyVariables(page: any, id: any) {
    let url = this.apiUrl + 'survey/new/variables/view/' + id + '?page_no=' + page;
    return this.http.get(url);
  }
  surveyUpdateVariables(id: any, data: any) {
    let url = this.apiUrl + 'survey/new/variables/update/' + id;
    return this.http.post(url, data);
  }
  getAllSurveyVariables(id: any) {
    let url = this.apiUrl + 'survey/new/all/variables/view/' + id;
    return this.http.get(url);
  }
  getSharedPanelForSurvey(id: any) {
    let url = this.apiUrl + 'survey/new/survey/assigned/panels?survey_identifier=' + id;
    return this.http.get(url);
  }
  shareEmailSurveyLink(data: any) {
    let url = this.apiUrl + 'survey/panel/members/email_send';
    return this.http.post(url, data);
  }
  surveyDownload(surveyId: any, status: any = 3) {
    let url = this.apiUrl + 'survey/survey_all_Users_answers/csv/create/' + surveyId + '?status=' + status;
    return this.http.get(url);
  }
  deleteUserResponse(data: any) {
    let url = this.apiUrl + 'survey/new/answer/response/delete';
    return this.http.post(url, data);
  }
  updateLogicGroup(id: any, data: any) {
    let url = this.apiUrl + 'survey/logic_group/update/' + id;
    return this.http.post(url, data);
  }
  deletePageSurvey(data: any) {
    let url = this.apiUrl + 'survey/new/page/delete';
    return this.http.post(url, data);
  }
  movePageSurvey(data: any) {
    let url = this.apiUrl + 'survey/new/page/move';
    return this.http.post(url, data);
  }
  moveOption(data: any) {
    let url = this.apiUrl + 'survey/option/move';
    return this.http.post(url, data);
  }
  moveFormQuestion(data: any) {
    let url = this.apiUrl + 'survey/form_question/move';
    return this.http.post(url, data);
  }
  moveMatrixOption(data: any) {
    let url = this.apiUrl + 'survey/matrix_option/move';
    return this.http.post(url, data);
  }
  surveyQuestionCopy(data: any) {
    let url = this.apiUrl + 'survey/copy_question/create';
    return this.http.post(url, data);
  }
  surveyQuestionMove(data: any) {
    let url = this.apiUrl + 'survey/new/question/move';
    return this.http.post(url, data);
  }
  surveyAddPageBreak(data: any) {
    let url = this.apiUrl + 'survey/page_break/create';
    return this.http.post(url, data);
  }
  surveyRemovePageBreak(data: any, id: any) {
    let url = this.apiUrl + 'survey/page_break/update/' + id;
    return this.http.post(url, data);
  }
  surveyAddRedirectLink(data: any) {
    let url = this.apiUrl + 'survey/redirect_urls/create';
    return this.http.post(url, data);
  }
  surveyUpdateRedirectLink(id: any, data: any) {
    let url = this.apiUrl + 'survey/redirect_urls/update/' + id;
    return this.http.post(url, data);
  }
  surveylibraryCreateOption(data: any) {
    let url = this.apiUrl + 'survey/new/library/option/create';
    return this.http.post(url, data);
  }
  surveyQuestionAnswerView(surveyId: any, status: number = 3, limit: number = 10, offset: number = 0): Observable<any> {
    let url = this.apiUrl + 'survey/new/survey_answers/view/' + surveyId + '?status=' + status + '&limit=' + limit + '&offset=' + offset;
    return this.http.get(url);
  }
  surveyQuestionList(surveyId: any) {
    let url = this.apiUrl + 'survey/question/list/' + surveyId;
    return this.http.get(url);
  }
  surveyAnswerDownload(surveyId: any, responseId: any) {
    let url = this.apiUrl + 'survey_reports/pdf/create/' + surveyId + '?answers_response_identifier=' + responseId;
    return this.http.get(url);
  }
  getChoiceDisplayLogic(surveyId: any) {
    let url = this.apiUrl + 'survey/display_logic/options/display/logic/view' + surveyId;
    return this.http.get(url);
  }
  addChoiceDisplayLogic(data: any) {
    let url = this.apiUrl + 'display_logic/options/display/logic/add';
    return this.http.post(url, data);
  }
  updateChoiceDisplayLogic(data: any) {
    let url = this.apiUrl + 'display_logic/options/display/logic/update';
    return this.http.post(url, data);
  }
  viewChoiceDisplayLogic(data: any) {
    let url = this.apiUrl + 'display_logic/options/display/logic/view';
    return this.http.post(url, data);
  }
}
