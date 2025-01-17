import { Injectable } from '@angular/core';
import { Configuration } from './models.service';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigLoaderService {
  public readonly CONFIGURATION_URL = "./assets/config/configuration.json";
  public _configuration!: Configuration;
  appConfig: any;
  constructor(public _http: HttpClient) { }

  loadAppConfig() {
    return new Promise<boolean>((resolve, reject) => {
      fetch('../assets/config/config.json').then(res => res.json())
        .then(jsonData => {
          console.log(jsonData, 'config-runtime')
          this.appConfig = jsonData;
          resolve(true);
        });
    })
  }

  apiBaseUrl() {
    return this.appConfig;
  }
}
