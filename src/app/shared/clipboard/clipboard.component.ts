import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';

@Component({
  selector: 'app-clipboard',
  templateUrl: './clipboard.component.html',
  styleUrls: ['./clipboard.component.css']
})
export class ClipboardComponent implements OnInit {
  cdkCopy: boolean = false;
  constructor(public dialogRef: MatDialogRef<ClipboardComponent>,
    @Inject(MAT_DIALOG_DATA) public value: any,
    ) { }

  ngOnInit(): void {
    console.log(this.value)
  }
close(){
  this.dialogRef.close();
}
cdkCopyTxt(){
  this.cdkCopy = true;
}
}
