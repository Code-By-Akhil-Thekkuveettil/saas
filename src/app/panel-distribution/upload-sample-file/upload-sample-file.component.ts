import { Component, Input,  EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-upload-sample-file',
  templateUrl: './upload-sample-file.component.html',
  styleUrls: ['./upload-sample-file.component.css']
})
export class UploadSampleFileComponent implements OnInit {

  file!: File; 
  validUpload: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<UploadSampleFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this._mdr.close(true);
  }

  onChange(event) {
    this.file = event.target.files[0];
}

// OnClick of button Upload
onUpload() {
  if(this.file != undefined){
    this.dashboardService.uploadCSVPanel(this.file,this.data.id).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message);
        this.closeDialog();
      },
      error: error => {
        this.toastr.error(error?.error?.message);
      }
    });
  }else{
    this.validUpload = true;
  }
    
}
}
