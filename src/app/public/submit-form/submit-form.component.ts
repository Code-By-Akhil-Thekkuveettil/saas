import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilderService } from 'src/app/form-builder/form-builder-service.service';
import { PreviewHtmlComponent } from 'src/app/shared/preview-html/preview-html.component';
import { DocumentsService } from 'src/app/shared/services/documents.service';

@Component({
  selector: 'app-submit-form',
  templateUrl: './submit-form.component.html',
  styleUrls: ['./submit-form.component.css']
})
export class SubmitFormComponent implements OnInit {
  reference_id: string | null;
  subscriptionForm: any={

  };
  // subscriptionForm: any={
  //   "added_components": [
  //     {
  //       "name": "Input",
  //       "machineName": "input",
  //       "iconClass": "far fa-square fa-2x",
  //       "addedComponents": [],
  //       "element": {
  //         "label": "Enter your name",
  //         "field_name": "input-2244460f",
  //         "is_required": false,
  //         "show_label": true,
  //         "placeholder_text": "Placeholder text"
  //       },
  //       "deletable": true,
  //       "type": "text",
  //       "isSelected": false,
  //       "id": "2244460f-15d0-ec05-57ff-bcb7f8ce6ed9",
  //       "componentSettings": {
  //         "background_color": "",
  //         "rounded_corners": 0,
  //         "padding_top": 10,
  //         "padding_right": 0,
  //         "padding_bottom": 10,
  //         "padding_left": 0,
  //         "height": 0
  //       }
  //     },
  //     {
  //       "name": "Input",
  //       "machineName": "input",
  //       "iconClass": "far fa-square fa-2x",
  //       "addedComponents": [],
  //       "element": {
  //         "label": "Enter your age",
  //         "field_name": "input-2244460f",
  //         "is_required": false,
  //         "show_label": true,
  //         "placeholder_text": "Placeholder text"
  //       },
  //       "deletable": true,
  //       "type": "text",
  //       "isSelected": false,
  //       "id": "2244460f-15d0-ec05-57ff-bcb7f8ce6ed90",
  //       "componentSettings": {
  //         "background_color": "",
  //         "rounded_corners": 0,
  //         "padding_top": 10,
  //         "padding_right": 0,
  //         "padding_bottom": 10,
  //         "padding_left": 0,
  //         "height": 0
  //       }
  //     },
  //     {
  //       "name": "Button",
  //       "machineName": "button",
  //       "iconClass": "fas fa-square fa-2x",
  //       "addedComponents": [],
  //       "element": {
  //         "content": "Upload",
  //         "link_to": "",
  //         "button_type": "submit",
  //         "button_style": "",
  //         "button_color": "#0143a3",
  //         "text_color": "#FFFFFF",
  //         "rounded_corners": 0,
  //         "button_size_type": "auto",
  //         "button_size": 100,
  //         "font_family": "'Helvetica Neue', Helvetica, sans-serif",
  //         "font_size": 16,
  //         "font_bold": false,
  //         "font_italic": false,
  //         "line_height": 1.5,
  //         "height": 30,
  //         "alignment": "center",
  //         "vertical_align": "middle",
  //         "box_shadow_color": "",
  //         "gradient_top_color": "",
  //         "gradient_bottom_color": ""
  //       },
  //       "deletable": true,
  //       "type": "text",
  //       "isSelected": true,
  //       "id": "8e3d1bde-9642-3552-6261-485b92804b15",
  //       "componentSettings": {
  //         "background_color": "",
  //         "rounded_corners": 0,
  //         "padding_top": 10,
  //         "padding_right": 0,
  //         "padding_bottom": 10,
  //         "padding_left": 0,
  //         "height": 0
  //       }
  //     }
  //   ],
  //   "form_design": {
  //     "fullWidth": false,
  //     "width": 600,
  //     "page_alignment": "top",
  //     "background_color": "#f5f5f5",
  //     "container_background_color": "#ffffff",
  //     "text_color": "#000000",
  //     "font_family": "'Helvetica Neue', Helvetica, sans-serif",
  //     "font_size": 16,
  //     "rounded_corners": 8,
  //     "page_paddings": 15,
  //     "form_paddings": 15,
  //     "field_rounded_corners": 5,
  //     "form_border_width": 1,
  //     "form_border_color": "#ced4da",
  //     "field_background_color": "#ffffff",
  //     "field_border_width": 1,
  //     "field_border_color": "#ced4da",
  //     "label_font_color": "#000000",
  //     "label_font_size": 14,
  //     "label_font_bold": false,
  //     "label_font_italic": false,
  //     "field_size": "m"
  //   }
  // }
  myHtml: any;

  constructor(
    private modalService: NgbModal,
    public docService: DocumentsService,
    private toastr: ToastrService,
    private formBuilderService: FormBuilderService,
    public spinner: NgxSpinnerService,
    private route: ActivatedRoute,
  ) { 
    // this.reference_id = this.route.snapshot.paramMap.get('id');
    this.reference_id = this.route.snapshot.queryParams['id'];


  }

  ngOnInit(): void {
    this.getFormHtml()
  }
  getFormHtml() {
    this.spinner.show();
    let obj = {
      "reference_id": this.reference_id
    } 
    this.docService.getAnonymousFormJson(obj)
      .subscribe({
        next: (resp: any) => { 
          console.log(resp)
          
          var element = { 
          "name": "Button",
          "machineName": "button",
          "iconClass": "fas fa-square fa-2x",
          "addedComponents": [],
          "element": {
            "content": "submit",
            "link_to": "",
            "button_type": "submit",
            "button_style": "",
            "button_color": "#0143a3",
            "text_color": "#FFFFFF",
            "rounded_corners": 0,
            "button_size_type": "auto",
            "button_size": 100,
            "font_family": "'Helvetica Neue', Helvetica, sans-serif",
            "font_size": 16,
            "font_bold": false,
            "font_italic": false,
            "line_height": 1.5,
            "height": 30,
            "alignment": "center",
            "vertical_align": "middle",
            "box_shadow_color": "",
            "gradient_top_color": "",
            "gradient_bottom_color": ""
          },
          "deletable": true,
          "type": "text",
          "isSelected": true,
          "id": "8e3d1bde-9642-3552-6261-485b92804b15",
          "componentSettings": {
            "background_color": "",
            "rounded_corners": 0,
            "padding_top": 10,
            "padding_right": 0,
            "padding_bottom": 10,
            "padding_left": 0,
            "height": 0
          }};
          resp.data.added_components.push(element)
          this.subscriptionForm = resp.data;
          console.log('tested', this.subscriptionForm)
          this.onPreview();
          this.spinner.hide();
        },
        error: (error: any) => {
          let err = '';
          if (!error.code) {
            if (error && error.errors)
              err = error.errors;
            let errMsg: string = err ? err : 'Please try again later';
            this.toastr.error(error?.error?.message);
          }
          this.spinner.hide();
        }
      })
  }
  onPreview() {
    console.log('jkdk')
    // const modalRef = this.modalService.open(PreviewHtmlComponent, {
    //   size: 'lg',
    //   windowClass: 'full-width',
    //   centered: true,
    //   scrollable: false,
    // });
    this.formBuilderService.components =
      this.subscriptionForm.added_components;
    this.formBuilderService.formDesign =
      this.subscriptionForm.form_design;
      this.myHtml= this.formBuilderService.generateHtml(this.reference_id);
      // console.log(this.myHtml)
  }
  submit(){
    console.log(this.subscriptionForm,'w')
  }
}
