import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'EZ-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {

  config: any;
  onClose: any;

  constructor(
    public modal: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  public accept() {
    this.modal.hide();
    this.onClose(true);
  }

}
