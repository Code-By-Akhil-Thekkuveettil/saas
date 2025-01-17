import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddNewPanelComponent } from '../add-new-panel/add-new-panel.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
export interface Panel {
  title: string;
  created: Date;
}
@Component({
  selector: 'app-panel-list',
  templateUrl: './panel-list.component.html',
  styleUrls: ['./panel-list.component.css']
})

export class PanelListComponent implements OnInit {
  newPanelDialog: MatDialogRef<AddNewPanelComponent> | undefined;
  tableSize: number = 7;
  page: number = 1;
  panel_count: number = 0;
  panel: any[] = [];
  searchText;
  displayedColumns: string[] = ['title', 'created_on', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private dashboardService: DashboardService,
    private matDialog: MatDialog,
  ) { }
  ngAfterViewInit() {
    if (this.dataSource)
      this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getPanelList();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  newPanel() {
    this.newPanelDialog = this.matDialog.open(AddNewPanelComponent, {
      disableClose: true,
      height: 'auto',
      width: '600px',
    });

    this.newPanelDialog.afterClosed().subscribe(res => {
      if ((res == true)) {
      }
    });
  }

  getPanelList() {
    this.loading = true;
    this.dashboardService.getPanelList()
      .subscribe({
        next: (res: any) => {
          this.panel = res.data;
          this.loading = false;
          this.dataSource = new MatTableDataSource(this.panel);
          this.dataSource.paginator = this.paginator;
          this.panel_count = this.panel.length;
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  editPanel(item: any) {
    this.router.navigate(['/panel-distribution/members', item.id], { state: { isEdit: true, panelTitle: item.title } });
  }

  deletePanel(item: any) {
    let data = {
      is_active: 0
    }
    this.dashboardService.deletePanel(data, item.id)
      .subscribe({
        next: (res: any) => {
          this.getPanelList();
          this.toastr.success(res?.message);
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

}
