import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'EZ-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent implements OnInit {

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
