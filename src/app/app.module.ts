import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigLoaderService } from './config/config-loader.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpConfigInterceptor } from './auth/auth-middlwares/http-unauthorized.interceptor';
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DndModule } from 'ngx-drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MyAccountModule } from './my-account/my-account.module';
import { GoogleAnalyticsModule } from './google-analytics/google-analytics.module';
import { DeletePopupService } from './survey/delete-popup/delete-popup.service';

export function initializerFn(appConfigService: ConfigLoaderService) {
  return () => {
    return appConfigService.loadAppConfig();
  };
}

@NgModule({
  declarations: [
    AppComponent, FormBuilderComponent
  ],
  imports: [
    ColorPickerModule,
    DndModule,
    NgbModule,
    TranslateModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    NgxPaginationModule,
    ClipboardModule,
    MyAccountModule,
    GoogleAnalyticsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      easing: 'ease-in',
      preventDuplicates: true,
    }),
  ],
  providers: [ConfigLoaderService,
    DeletePopupService,
    BsModalService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigLoaderService],
      useFactory: initializerFn
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
