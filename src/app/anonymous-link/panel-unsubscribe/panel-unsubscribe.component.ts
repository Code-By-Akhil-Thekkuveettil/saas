import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-panel-unsubscribe',
  templateUrl: './panel-unsubscribe.component.html',
  styleUrls: ['./panel-unsubscribe.component.css']
})
export class PanelUnsubscribeComponent implements OnInit {

  panel: any;
  id: any;
  submitted: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.panel = params['panel'];
      this.id = params['id'];
    });
  }

  confirm() {
    this.dashboardService.unsubscribePanelMember(this.panel, this.id)
      .subscribe({
        next: (res: any) => {
          this.submitted = true;
          this.toastr.success(res?.message);
        },
        error: (error: any) => {
          this.toastr.error(error?.error?.message);
        }
      });
  }

}
