import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { MessageService } from 'src/app/shared/messages/message.service';
import { NewSurveyComponent } from '../new-survey/new-survey.component';
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { auto } from '@popperjs/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { DeletePopupService } from '../delete-popup/delete-popup.service';

export interface Survey {
  id: number;
  survey_title: string;
  status: string;
  response_count: number;
}

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'created_on', 'start_date', 'response_count', 'status', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) listSort!: MatSort;
  loading: boolean = false;
  createSurveyPopup: MatDialogRef<NewSurveyComponent> | undefined;
  @Output() upload = new EventEmitter();
  bsModalRef!: BsModalRef;
  surveyList: any = [];
  sortedData: Survey[] = [];
  tableSize: number = 7;
  page: number = 1;
  survey_count: number = 0;
  currentUser: any;
  expNavbar: boolean = true;
  showNavbar: any;
  isedit: boolean = false;
  tkn: any;
  searchText;
  GAAllowNo: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private surveyService: SurveyService,
    private deletePopupService: DeletePopupService,
    // private toastr: toastr,
    private router: Router,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private messageService: MessageService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getSurveyList();
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.listSort;
    }
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  // getCurrentUser(): void {
  //   this.authService.currentUser
  //   .subscribe(user => {
  //     this.currentUser = user;
  //   })
  // }

  show(show) {
    this.showNavbar = show;
  }

  getSurveyList() {
    this.loading = true;
    this.dashboardService.surveyList()
      .subscribe({
        next: (res: any) => {
          this.surveyList = res.data;
          this.sortedData = this.surveyList.slice();
          this.survey_count = this.surveyList.length
          this.loading = false;
          this.dataSource = new MatTableDataSource(this.surveyList);
          this.dataSource.paginator = this.paginator;
          let GaCheck = 0;
          this.surveyList.forEach(x => {
            if (x.google_analytics_allowed > 0) {
              GaCheck++;
            }
          });
          if (GaCheck > 0) {
            this.GAAllowNo = 1;
          }
        },
        error: error => {
          this.loading = false;
          this.toastr.error(error?.error?.message);
        }
      });
  }
  is_edit() {
    this.isedit = true;
  }

  // newSurvey(){
  //   this.bsModalRef = this.modalService.show(NewSurveyComponent, {class: 'modal-lg', ignoreBackdropClick: true});
  //   this.bsModalRef.content.config = {
  //     btnOkText:'OK',
  //     btnCancelText:'Cancel'
  //   }
  //   this.bsModalRef.content.onClose = (data: any) => {
  //   };
  // }
  newSurvey() {
    this.createSurveyPopup = this.matDialog.open(NewSurveyComponent, {
      disableClose: true,
      width: '600px',
      height: auto
    });

    this.createSurveyPopup.afterClosed().subscribe(res => {
      if ((res == true)) {
        this.getSurveyList();
      }
    });
  }
  surveyLink(item: any) {
    this.surveyService.getSurveyUrlToken(item?.unique_identifier)
      .subscribe({
        next: (resp: any) => {
          this.tkn = resp?.data?.token;
          let token = this.tkn;
          if (token) {
            const url = '/general/testsurvey/' + token;
            window.open(url, '_blank');
          } else {
            this.toastr.error(resp.data?.message);
          }
        },
        error: (error: any) => {
          let err = '';
          if (!error.code) {
            if (error && error.errors)
              err = error.errors;
            let errMsg: string = err ? err : 'Please try again later';
            this.toastr.error(error?.error?.message);
          }
        }
      });
  }
  edit(item: any) {
    this.router.navigate(['/survey/questions', item?.unique_identifier], { state: { isEdit: true, survey_title: item.title, GAallowedno: this.GAAllowNo } });
  }

  update(item: any, status: any) {
    let obj = {}
    if (status == 2) {
      obj = {
        status: status
      }
    } else {
      obj = {
        is_active: status,
      }
    }
    let msg = 'Do you really want to ' + (status == 0 ? ' delete?' : ' close?');
    this.deletePopupService.confirm('Please confirm', msg)
      .then((confirmed) => {
        if (confirmed) {
          this.updateSurvey(item?.unique_identifier, obj);
        }
      });
  }
  updateSurvey(id: any, obj: any) {
    this.spinner.show();
    this.surveyService.surveyUpdate(id, obj)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res?.message);
          this.getSurveyList()
          this.spinner.hide()
        },
        error: error => {
          this.spinner.hide()
          this.toastr.error(error?.error?.message);
        }
      });
  }
  activate(item: any) {
    this.spinner.show()
    let obj = {
      status: 1
    }
    this.updateSurvey(item?.unique_identifier, obj)
  }

  remove(index: number) {
    this.surveyList.splice(index, 1);
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    const data = this.surveyList.slice();
    if (!sortState.active || sortState.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sortState.direction === 'asc';
      switch (sortState.active) {
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'created_on':
          return this.compare(a.created, b.created, isAsc);
        case 'start_date':
          return this.compare(a.start_date, b.start_date, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource = new MatTableDataSource(this.sortedData);

  }

  // initiateSurvey(item:any){
  //   this.initiate = this.matDialog.open(InitiateSurveyComponent, {
  //     disableClose: true,
  //     height: '500px',
  //     width: '500px',
  //     data: {
  //       dataKey: item.item
  //     }
  //   });

  //   this.initiate.afterClosed().subscribe(res => {
  //     if ((res == true)) {
  //       console.log('closePop')
  //     }
  //   });
  //   this.bsModalRef = this.modalService.show(InitiateSurveyComponent, {class: 'modal-lg', ignoreBackdropClick: true,initialState:{item:item}});
  //   this.bsModalRef.content.onClose = (data: any) => {
  //     this.getSurveyList()
  //   };
  // }  
  expand(show) {
    this.showNavbar = show;
  }
  viewActivity(item: any) {
    // this.router.navigate(['/survey/survey-activity',item.id]);
    this.router.navigate(['/survey/responses', item?.unique_identifier]);
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
  endSurvey(item: any) {
    this.messageService.confirm('End Survey', "Are you sure?", (isConfirmed) => {
      if (isConfirmed) {
        let obj = {
          is_active: 2
        }
        this.updateSurvey(item?.unique_identifier, obj)
      }
    })
  }

}
