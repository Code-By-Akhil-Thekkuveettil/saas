import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyAnswerService {
  apiUrl: any;
  constructor(private http: HttpClient,
    configurationLoader: ConfigLoaderService) {
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }
  getSurveyUrl(token: any) {
    let url = this.apiUrl + 'survey/survey_id/get/' + token;
    return this.http.get(url);
  }
  viewSettings(id: any): Observable<any> {
    let url = this.apiUrl + 'survey_settings/settings/view/' + id;
    return this.http.get(url);
  }
  getSurveyRedirectLinkByPagenum(id: any, page_no: any, response_code: any) {
    let url = this.apiUrl + 'survey/redirect_url/response/view/' + id + '?page_no=' + page_no + '&response_code=' + response_code;
    return this.http.get(url);
  }
  surveySettings(id: any): Observable<any> {
    let url = this.apiUrl + 'survey/new/survey_view/' + id;
    return this.http.get(url);
  }
  getSurveyVariables(page: any, id: any) {
    let url = this.apiUrl + 'survey/new/variables/view/' + id + '?page_no=' + page;
    return this.http.get(url);
  }
  surveyVariableResponseView(surveyId: any, response_code: any) {
    let url = this.apiUrl + 'survey/new/variable_response/view?survey_identifier=' + surveyId + '&response_code=' + response_code;
    return this.http.get(url);
  }
  surveyAddAnswer(param: any, data: any) {
    let url = this.apiUrl + 'survey/new/survey_answers/anonymous/create?survey_identifier=' + param.id +
      '&survey_status=0' +
      '&page_no=' + param.page +
      '&is_skip=' + param.is_skip;
    return this.http.post(url, data);
  }
  triggerEmail(data: any) {
    let url = this.apiUrl + 'survey_settings/settings/email/send';
    return this.http.post(url, data);
  }
  surveyVariableResponse(data: any, id: any, response_code: any) {
    let url = this.apiUrl + 'survey/new/variable_response/save?survey_identifier=' + id + '&response_code=' + response_code;
    return this.http.post(url, data);
  }
  surveyUserViewQuestionOnNext(token: any, last_question_identifier: any, page_order: any, response_code: any): Observable<any> {
    let url = this.apiUrl + 'survey/new/anonymous_user/survey/view?next=True&last_question_identifier=' +
      last_question_identifier +
      '&token=' + token +
      '&response_code=' + response_code +
      '&page_order=' + page_order;
    return this.http.get(url);
  }
  surveyUserViewQuestion(token: any): Observable<any> {
    let url = this.apiUrl + 'survey/new/anonymous_user/survey/view?token=' + token;
    return this.http.get(url);
  }
}
