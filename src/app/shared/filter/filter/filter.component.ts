import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigLoaderService } from 'src/app/config/config-loader.service';
import { DocumentsService } from '../../services/documents.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {
  apiUrl: any;
  data: any;
  filterForm!: FormGroup;
  docList: any;
  constructor(public http: HttpClient,
    public spinner: NgxSpinnerService,
    public docService: DocumentsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    configurationLoader: ConfigLoaderService,
    @Inject(MAT_DIALOG_DATA) data: string,
    ) 
  {
    this.data = data;
    this.apiUrl = configurationLoader.apiBaseUrl().apiUrl;
  }

  ngOnInit(): void {
    this.buildForm();
    this.filterForm.get('name')?.setValue(this.data.name);
    this.filterForm.get('description')?.setValue(this.data.description);
    this.filterForm.get('created')?.setValue(this.data.date);
    this.filterForm.get('is_closed')?.setValue(this.data.status);
    this.filterForm
  }

  buildForm() {
    this.filterForm = this.fb.group({
      name: [''],
      description: [''],
      created: [''],
      is_closed: [''],
    });
  }

  reset() {
    this.buildForm();
  }

  filter() {
    this.close(this.filterForm.value)
  }

  close(data: any) {
    this.dialogRef.close({ data: data });
  }
}
