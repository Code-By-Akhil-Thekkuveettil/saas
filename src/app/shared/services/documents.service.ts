import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  apiUrl: any;
  constructor(private cookieService: CookieService,
    private http: HttpClient,
    configurationLoader: ConfigLoaderService,
    public spinner: NgxSpinnerService) { 
      this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
    }

    getDocumentList(URL): Observable<any> {
      return this.http.get(URL) 
    }

    getLatestProjects(): Observable<any> {
      const URL = this.apiUrl + 'file_forms/latest_project/list?organization=' + this.cookieService.get('organization_id') + '&user=' + this.cookieService.get('user_id');
      return this.http.get(URL) 
    }

    responseCount(): Observable<any> {
      const data = {
        organization_id : this.cookieService.get('organization_id'),
        user_id : this.cookieService.get('user_id')
      }
      const URL = this.apiUrl + 'file_forms/form/response/count/update';
      return this.http.post(URL, data) 
    }

    uploadData(data): Observable<any> {
      const URL = this.apiUrl + 'file_forms/file/upload';
      const fd: FormData = new FormData();
      fd.append('file', data.file);
      fd.append('user_id', this.cookieService.get('user_id'));
      fd.append('organization_id', this.cookieService.get('organization_id')),
      fd.append('description', data.description);
      fd.append('name', data.name);
      const header = new HttpHeaders().set('Content-Type', 'application/json')
      const headers = { headers: header };
      return this.http.post(URL, fd, headers) 
    }

    generateForm(data:any): Observable<any> {
      let url = this.apiUrl + 'file_forms/form/generate?organization_id='+ this.cookieService.get('organization_id') + '&user_id=' + this.cookieService.get('user_id');
      // // const header = new HttpHeaders().set('Content-Type', 'application/json')
      // .append('Authorization', 'Bearer ' + this.cookieService.get('token'));
      // const headers = { headers: header };
      // let url = 'master/marital/status';
      return this.http.post(url,data);
    }
    getForm(data:any): Observable<any> {
      console.log(data)
      let url = this.apiUrl + 'file_forms/form/view?reference_id='+data.reference_id
      //  const header = new HttpHeaders().set('Content-Type', 'application/json') 
      // const headers = { headers: header };
      return this.http.post(url,data);
    }
    getFormJson(data:any): Observable<any> {  
      console.log(data)
      let url = this.apiUrl + 'file_forms/form/db_json/view?reference_id='+data.reference_id
      //  const header = new HttpHeaders().set('Content-Type', 'application/json') 
      // const headers = { headers: header };
      return this.http.get(url);
    }
  // anonymous form getjsom
    getAnonymousFormJson(data:any): Observable<any> {  
      console.log(data)
      let url = this.apiUrl + 'file_forms/form/anonymous/view?reference_id='+data.reference_id
      //  const header = new HttpHeaders().set('Content-Type', 'application/json') 
      // const headers = { headers: header };
      return this.http.get(url);
    }
   publishForm(data:any,id:any): Observable<any> {  
      console.log(data)
      let url = this.apiUrl + 'file_forms/form/edit/save?reference_id='+id
    const header = new HttpHeaders().set('Content-Type', 'application/json')
      // .append('Authorization', 'Bearer ' + this.cookieService.get('token'));
      const headers = { headers: header };
      return this.http.post(url,data,headers);
    }
    getAnonymousLink(id){
      let url = this.apiUrl + 'file_forms/form/anonymous_url/create?reference_id='+id
      return this.http.get(url);
    }
    getFilterData(URL){
      //let url = this.apiUrl + 'file_forms/file/view?limit=10&offset=0&organization_id='+this.cookieService.get('organization_id')+'&user_id='+ this.cookieService.get('user_id')+'&created='+data.created+'&is_closed='+data.is_closed+'&description='+data.description+'&name='+data.name
      return this.http.get(URL);
    }
    getAnonymousResponse(data:any): Observable<any> {
      let url = this.apiUrl + 'file_forms/form/response?reference_id='+data.id
      return this.http.get(url);
    }

    closeProject(id){
      const data = {
        'reference_id' : id
      }
      let url = this.apiUrl + 'file_forms/form/close'
      return this.http.post(url, data);
    }

}
