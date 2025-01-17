import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  apiUrl: any;
  constructor(configurationLoader: ConfigLoaderService,
    private http: HttpClient,
    // private cookieService: CookieService,
    ) {
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;}
    getSubscriptionsList() {  
      let url =  this.apiUrl + 'super_admin/stripe/product_price/view';
      return this.http.get(url);
     }
     getSubscriptionsDetails(id:any) {  
      let url =  this.apiUrl + 'login/stripe/subscription/view/'+id;
      return this.http.get(url);
     }
     cancelSubscriptions(data:any) {  
      let url =  this.apiUrl + 'login/stripe/subscription/cancel';
      return this.http.post(url,data);
     }
     getInvoiceList(userId:any,subscriptionId:any) {  
      let url =  this.apiUrl + 'login/stripe/invoice/view/'+userId+'?stripe_subscription_id='+subscriptionId;
      return this.http.get(url);
     }
  createCustomer(data:any) {  
    let url =  this.apiUrl + 'login/stripe/customer/create';
    return this.http.post(url,data);
  }
selectPlan(data:any) {  
  let url =  this.apiUrl + 'login/stripe/subscription/create';
  return this.http.post(url,data);
}
}
