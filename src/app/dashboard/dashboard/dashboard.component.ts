import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilderService } from 'src/app/form-builder/form-builder-service.service';
import { FormInterface } from 'src/app/shared/drag-drop-content/interfaces/form.interface';
import { PreviewHtmlComponent } from 'src/app/shared/preview-html/preview-html.component';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { DashboardService } from '../../shared/services/dashboard.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  docList: any;
  subscriptionForm: FormInterface = {
    content_dnd: {
      added_components: [],
      form_design: {
        fullWidth: false,
        width: 600,
        page_alignment: 'top',
        background_color: '#f5f5f5',
        container_background_color: '#ffffff',
        text_color: '#000000',
        font_family: "'Helvetica Neue', Helvetica, sans-serif",
        font_size: 16,
        rounded_corners: 8,
        page_paddings: 15,
        form_paddings: 15,
        field_rounded_corners: 5,
        form_border_width: 1,
        form_border_color: '#ced4da',
        field_background_color: '#ffffff',
        field_border_width: 1,
        field_border_color: '#ced4da',
        label_font_color: '#000000',
        label_font_size: 14,
        label_font_bold: false,
        label_font_italic: false,
        field_size: 'm',
      },
    },
  };
  expNavbar: boolean = true;
  nodata: boolean = false;
  projects = {};
  surveys: any;

  constructor(public spinner: NgxSpinnerService,
    public dashboard: DashboardService,
    public docService: DocumentsService,
    private modalService: NgbModal,
    private formBuilderService: FormBuilderService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getDashboardReport();
  }

  expand(show) {
    this.expNavbar = show;
  }

  getFormHtml(id) {
    this.spinner.show();
    let obj = {
      "reference_id": id
    }
    this.docService.getFormJson(obj)
      .subscribe({
        next: (resp: any) => {
          this.subscriptionForm.content_dnd.added_components = resp.data.added_components;
          this.openPreview(id);
          this.spinner.hide();
        },
        error: (error: any) => {
          if (error) {
            this.toastr.error(error?.error?.message);
          }
          this.spinner.hide();
        }
      })
  }

  openPreview(id) {
    const modalRef = this.modalService.open(PreviewHtmlComponent, {
      size: 'lg',
      windowClass: 'full-width',
      centered: true,
      scrollable: false,
    });
    this.formBuilderService.components =
      this.subscriptionForm.content_dnd.added_components;
    this.formBuilderService.formDesign =
      this.subscriptionForm.content_dnd.form_design;
    modalRef.componentInstance.content = this.formBuilderService.generateHtml(id);
  }

  getDocumentList() {
    this.spinner.show();
    this.docService.getLatestProjects().subscribe({
      next: (result) => {
        this.docList = result.data;
        this.spinner.hide();
        this.nodata = result.data.length == 0;
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message);
      }
    });
  }

  createReport() {
    this.spinner.show();
    this.dashboard.createReport().subscribe({
      next: (result) => {
        this.viewReport();
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        if (err.error.code !== 401) {
          this.toastr.error('', err.error?.message, {
            timeOut: 3000
          });
        }
      }
    });
  }

  viewReport() {
    this.spinner.show();
    this.dashboard.viewReport().subscribe({
      next: (result) => {
        this.projects = result.data;
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        if (err.error.code !== 401) {
          this.toastr.error('', err.error.message, {
            timeOut: 3000
          });
        }
      }
    });
  }

  showResponse(id) {
    this.router.navigate(['dashboard/view-response', id]);
  }

  getDashboardReport() {
    this.spinner.show();
    this.dashboard.dashboardReport()
      .subscribe({
        next: (res: any) => {
          this.surveys = res.data;
          this.nodata = (res.data?.last_response_data == null || res.data?.last_response_data?.length == 0);
          this.spinner.hide();
        },
        error: (err: any) => {
          this.spinner.hide();
          if (err.error.code !== 401) {
            this.toastr.error('', err.error.message, {
              timeOut: 3000
            });
          }
        }
      });
  }

}
