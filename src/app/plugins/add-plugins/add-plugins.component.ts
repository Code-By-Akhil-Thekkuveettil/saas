import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { PluginPopupComponent } from './plugin-popup/plugin-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletePopupService } from 'src/app/survey/delete-popup/delete-popup.service';

@Component({
  selector: 'app-add-plugins',
  templateUrl: './add-plugins.component.html',
  styleUrls: ['./add-plugins.component.css']
})
export class AddPluginsComponent implements OnInit {

  expNavbar: boolean = true;
  pluginsList: any[] = [];
  searchText;
  pluginPopup: MatDialogRef<PluginPopupComponent> | undefined;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private deletePopupService: DeletePopupService,
  ) { }

  ngOnInit(): void {
    this.getPluginsView();
  }

  expand(show) {
    this.expNavbar = show;
  }

  getPluginsView() {
    this.dashboardService.getPluginsView()
      .subscribe({
        next: (res: any) => {
          this.pluginsList = res.data;
          this.pluginsList.forEach(x => {
            if (x.plugin_connection_data != undefined) {
              if (x.plugin_connection_data.is_connect == 1) {
                x.connected = true;
              } else {
                x.connected = false;
              }
            } else {
              x.connected = false;
            }
          });
        },
        error: error => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

  connect(plugin: any) {
    this.pluginPopup = this.matDialog.open(PluginPopupComponent, {
      disableClose: true,
      height: 'auto',
      width: '700px',
      data: plugin
    });
    this.pluginPopup.afterClosed().subscribe(res => {
      if (res) {
        this.getPluginsView();
      }
    });
  }
  disconnect(id: any) {
    this.deletePopupService.confirm('Disconnect plugin', 'Do you really want to disconnect?')
      .then((confirmed) => {
        if (confirmed) {
          this.dashboardService.pluginsDisconnect(id)
            .subscribe({
              next: (res: any) => {
                this.getPluginsView();
              },
              error: error => {

              }
            });
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
