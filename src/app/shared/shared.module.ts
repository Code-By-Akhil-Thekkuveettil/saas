import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ConfigModule } from '../config/config.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidenavComponent } from './sidenav/sidenav.component';
// import { SafePipe } from './pipes/safe.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { I18nService } from './i18n.service';
import { ButtonPropertyComponent } from './drag-drop-content/elements/button-property/button-property.component';
import { ButtonComponent } from './drag-drop-content/elements/button/button.component';
import { CheckboxPropertyComponent } from './drag-drop-content/elements/checkbox-property/checkbox-property.component';
import { CheckboxComponent } from './drag-drop-content/elements/checkbox/checkbox.component';
import { CurrentElementComponent } from './drag-drop-content/elements/current-element/current-element.component';
import { DropdownPropertyComponent } from './drag-drop-content/elements/dropdown-property/dropdown-property.component';
import { DropdownComponent } from './drag-drop-content/elements/dropdown/dropdown.component';
import { FormDesignPropertyComponent } from './drag-drop-content/elements/form-design-property/form-design-property.component';
import { InputPropertyComponent } from './drag-drop-content/elements/input-property/input-property.component';
import { InputComponent } from './drag-drop-content/elements/input/input.component';
import { PicturePropertyComponent } from './drag-drop-content/elements/picture-property/picture-property.component';
import { PictureComponent } from './drag-drop-content/elements/picture/picture.component';
import { RadiosPropertyComponent } from './drag-drop-content/elements/radios-property/radios-property.component';
import { RadiosComponent } from './drag-drop-content/elements/radios/radios.component';
import { SeparatorPropertyComponent } from './drag-drop-content/elements/separator-property/separator-property.component';
import { SeparatorComponent } from './drag-drop-content/elements/separator/separator.component';
import { SocialPropertyComponent } from './drag-drop-content/elements/social-property/social-property.component';
import { SocialComponent } from './drag-drop-content/elements/social/social.component';
import { SpacerPropertyComponent } from './drag-drop-content/elements/spacer-property/spacer-property.component';
import { SpacerComponent } from './drag-drop-content/elements/spacer/spacer.component';
import { TextPropertyComponent } from './drag-drop-content/elements/text-property/text-property.component';
import { TextComponent } from './drag-drop-content/elements/text/text.component';
import { TextareaPropertyComponent } from './drag-drop-content/elements/textarea-property/textarea-property.component';
import { TextareaComponent } from './drag-drop-content/elements/textarea/textarea.component';
import { UploaderPropertyComponent } from './drag-drop-content/elements/uploader-property/uploader-property.component';
import { UploaderComponent } from './drag-drop-content/elements/uploader/uploader.component';
import { FontOptionsComponent } from './font-options/font-options.component';
import { HtmlEditorComponent } from './html-editor/html-editor.component';
import { PreviewHtmlComponent } from './preview-html/preview-html.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CKEditorModule } from 'ngx-ckeditor';
import { ColorPickerModule } from 'ngx-color-picker';
import { DndModule } from 'ngx-drag-drop';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ClipboardComponent } from './clipboard/clipboard.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatInputModule } from '@angular/material/input';
import { FilterComponent } from './filter/filter/filter.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GroupByPipe } from './pipes/group-by.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    NavBarComponent,
    SidenavComponent,
    // SafePipe
    SafeHtmlPipe,
    GroupByPipe,
    FontOptionsComponent,
    ConfirmationModalComponent,
    TextComponent,
    SeparatorComponent,
    ButtonComponent,
    PictureComponent,
    SocialComponent,
    CurrentElementComponent,
    TextPropertyComponent,
    PicturePropertyComponent,
    ButtonPropertyComponent,
    SeparatorPropertyComponent,
    SocialPropertyComponent,
    HtmlEditorComponent,
    PreviewHtmlComponent,
    CheckboxComponent,
    CheckboxPropertyComponent,
    RadiosComponent,
    DropdownComponent,
    InputComponent,
    TextareaComponent,
    SpacerComponent,
    SpacerPropertyComponent,
    TextareaPropertyComponent,
    RadiosPropertyComponent,
    DropdownPropertyComponent,
    InputPropertyComponent,
    FormDesignPropertyComponent,
    UploaderComponent,
    UploaderPropertyComponent,
    ClipboardComponent,
    FilterComponent,
    TextEditorComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ConfigModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DndModule,
    CKEditorModule,
    ColorPickerModule,
    TranslateModule.forChild(),
    DropzoneModule,
    ClipboardModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMomentDateModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AngularEditorModule

  ],
  exports: [
    NavBarComponent, SidenavComponent,
    HeaderComponent,
    FormsModule,
    SafeHtmlPipe,
    GroupByPipe,
    FontOptionsComponent,
    TextComponent,
    SeparatorComponent,
    ButtonComponent,
    PictureComponent,
    SocialComponent,
    CurrentElementComponent,
    TextPropertyComponent,
    PicturePropertyComponent,
    ButtonPropertyComponent,
    SeparatorPropertyComponent,
    SocialPropertyComponent,
    HtmlEditorComponent,
    CheckboxComponent,
    CheckboxPropertyComponent,
    RadiosComponent,
    DropdownComponent,
    InputComponent,
    TextareaComponent,
    SpacerComponent,
    SpacerPropertyComponent,
    TextareaPropertyComponent,
    RadiosPropertyComponent,
    DropdownPropertyComponent,
    InputPropertyComponent,
    FormDesignPropertyComponent,
    UploaderComponent,
    UploaderPropertyComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule, MatMomentDateModule,
    MatTooltipModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  entryComponents: [ConfirmationModalComponent, ClipboardComponent],
  providers: [I18nService],
})
export class SharedModule { }
