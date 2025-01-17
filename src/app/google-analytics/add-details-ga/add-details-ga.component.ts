import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-add-details-ga',
  templateUrl: './add-details-ga.component.html',
  styleUrls: ['./add-details-ga.component.css']
})
export class AddDetailsGaComponent implements OnInit {

  key: string = "";
  domain!: string;
  gaForm: FormGroup;
  plugin: any;

  constructor(
    public fb: FormBuilder,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    ) {
    this.gaForm = this.fb.group({
      key: new FormControl('', [Validators.required]),
      domain: new FormControl(''),
    });
   }

  ngOnInit(): void {
    this.getGAView();
  }

  add(){

      this.dashboardService.googleAnalytics(this.plugin, this.gaForm.controls['key'].value, this.gaForm.controls['domain'].value)
            .subscribe({
              next: (res: any) => {
                this.toastr.success(res?.message);
              },
              error: error => {
                this.toastr.error(error?.error?.message);            
              }
            });
  }
  
  getGAView(){
    this.dashboardService.getPluginsView()
          .subscribe({
            next: (res: any) => {
              res.data.forEach(x => {
                if(x.plugin_name == "google analytics"){
                  
                    
                    this.plugin = x.id;
                    this.dashboardService.getPluginsConnectView(this.plugin)
                        .subscribe({
                          next: (resp: any) => {
                            this.gaForm.patchValue({
                              key: resp.data[0].google_analytics_key,
                              domain: resp.data[0].google_analytics_domain
                            });
                          },
                          error: error => {
                        
                          }
                        });
                }
               
              });
            },
            error: error => {
          
            }
          });
          

  }

}
