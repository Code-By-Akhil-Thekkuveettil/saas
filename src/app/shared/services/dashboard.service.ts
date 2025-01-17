import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl: any;
  constructor(private http: HttpClient,
    configurationLoader: ConfigLoaderService,
    private cookieService: CookieService) {
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }

  createReport(): Observable<any> {
    let data = {
      user: this.cookieService.get('user_id'),
      organization: this.cookieService.get('organization_id')
    }
    const URL = this.apiUrl + 'login/report/create';
    return this.http.post(URL, data);
  }

  viewReport(): Observable<any> {
    const URL = this.apiUrl + 'login/report/view/' + this.cookieService.get('organization_id');
    return this.http.get(URL);
  }

  dashboardReport() {
    let url = this.apiUrl + 'survey/dashboard/report/' + this.cookieService.get('organization_id');
    return this.http.get(url);
  }

  surveyList() {
    let url = this.apiUrl + 'survey/activesurvey/list/' + this.cookieService.get('organization_id');
    return this.http.get(url);
  }
  surveyPageView() {
    let url = this.apiUrl + 'survey/page/view';
    return this.http.get(url);
  }
  surveyAssignEmployeeList(surveyId: any, orgId: any) {
    let url = this.apiUrl + 'survey/survey_users/list?survey=' + surveyId + '&organization_id=' + orgId;
    return this.http.get(url);
  }

  surveyInitiate(data: any) {
    let url = this.apiUrl + 'survey/survey_users/bulk/create';
    return this.http.post(url, data);
  }

  surveyAssignDistributionList(surveyId: any, orgId: any) {//not get
    let url = this.apiUrl + 'survey/distribution/list?survey=' + surveyId + '&organization_id=' + orgId;
    return this.http.get(url);
  }

  surveyRespondedUsers(surveyId: any, orgId: any) {
    let url = this.apiUrl + 'survey/survey_responded/user/' + surveyId + '?org_id=' + orgId;
    return this.http.get(url);
  }
  surveyUrlCreate(data: any) {
    let url = this.apiUrl + 'survey/survey_url/create';
    return this.http.post(url, data);
  }
  getQuestionList(id: any) {
    let url = this.apiUrl + 'survey/survey_questions/view/' + id;
    return this.http.get(url);
  }

  UpdateDisplayLogic(data: any) {
    let url = this.apiUrl + 'survey/question/logical/condition/update';
    return this.http.post(url, data);
  }

  getSurveyQuestionAnswer(s: any, question: any, response_code: any) {
    let url = this.apiUrl + 'survey/question/answer/view?survey=' + s + '&survey_question=' + question + '&response_code=' + response_code;
    return this.http.get(url);
  }

  newPanelDistribution(data: any) {
    let url = this.apiUrl + 'survey/panel/details/create';
    return this.http.post(url, data);
  }

  getPanelList() {
    let url = this.apiUrl + 'survey/panel/details/view/' + this.cookieService.get('organization_id');
    return this.http.get(url);
  }

  saveNewPanelMember(data: any) {
    let url = this.apiUrl + 'survey/panel/members/create';
    return this.http.post(url, data);
  }

  updatePanelMember(data: any, id: any) {
    let url = this.apiUrl + 'survey/panel/members/update/' + id;
    return this.http.post(url, data);
  }

  getPanelMemberList(id: any) {
    let url = this.apiUrl + 'survey/panel/members/view/' + id;
    return this.http.get(url);
  }

  deletePanel(data: any, id: any) {
    let url = this.apiUrl + 'survey/panel/details/update/' + id;
    return this.http.post(url, data);
  }

  unsubscribePanelMember(panel: any, id: any) {
    let url = this.apiUrl + 'survey/panel/members/unsubscription?panel=' + panel + '&id=' + id;
    return this.http.post(url, null);
  }

  getPanelDetails(id: any) {
    let url = this.apiUrl + 'survey/panel/details/given_id/' + id;
    return this.http.get(url);
  }

  uploadCSVPanel(file: any, id: any) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("panel", id);
    let url = this.apiUrl + 'survey/panel/members/create';
    return this.http.post(url, formData);
  }


  getPluginsView() {
    let url = this.apiUrl + 'survey/plugin/details/view?organization=' + this.cookieService.get('organization_id');
    return this.http.get(url);
  }

  pluginsConnect(plugin: any) {
    let data = {
      organization: this.cookieService.get('organization_id'),
      user: this.cookieService.get('user_id'),
      plugin: plugin,
      is_connect: 1
    }
    let url = this.apiUrl + 'survey/plugin/connect';
    return this.http.post(url, data);
  }

  pluginsDisconnect(plugin: any) {
    let data = {
      organization: this.cookieService.get('organization_id'),
      user: this.cookieService.get('user_id'),
      plugin: plugin,
      is_connect: 0
    }
    let url = this.apiUrl + 'survey/plugin/connect';
    return this.http.post(url, data);
  }

  getPluginsConnectView(plugin: any) {
    let url = this.apiUrl + 'survey/plugin/connect/view?organization=' + this.cookieService.get('organization_id') + '&plugin=' + plugin;
    return this.http.get(url);
  }

  organizationUserCreate(data: any) {
    let url = this.apiUrl + 'login/organization/add_user';
    return this.http.post(url, data);
  }

  organizationUserList() {
    let url = this.apiUrl + 'login/organization/user/view/' + this.cookieService.get('organization_id');
    return this.http.get(url);
  }

  organizationUserUpdate(data: any) {
    let url = this.apiUrl + 'login/organization/update_user';
    return this.http.post(url, data);
  }

  panelDepartmentList() {
    let url = this.apiUrl + 'survey/department/view';
    return this.http.get(url);
  }

  panelJobTypeList() {
    let url = this.apiUrl + 'survey/job_type/view';
    return this.http.get(url);
  }

  googleAnalytics(plugin_id: any, key: any, domain: any) {
    let data = {
      organization: this.cookieService.get('organization_id'),
      user: this.cookieService.get('user_id'),
      plugin: plugin_id,
      google_analytics_key: key,
      google_analytics_domain: domain
    };
    let url = this.apiUrl + 'survey/plugin/credentials/update_create';
    return this.http.post(url, data);
  }

  pluginUpdate(data: any) {
    let url = this.apiUrl + 'survey/plugin/credentials/update_create';
    return this.http.post(url, data);
  }

  joinPanelList(survey: any, response_code: any) {
    let url = this.apiUrl + 'survey/after_response/panel_member/add?survey=' + survey + '&response_code=' + response_code;
    return this.http.get(url);
  }

}
