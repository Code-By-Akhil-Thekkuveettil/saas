import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'EZ-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  config: any;
  onClose: any;

  constructor(
    public modal: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  public decline() {
    this.modal.hide();
    this.onClose(false);
  }

  public accept() {
    this.modal.hide();
    this.onClose(true);
  }

}
