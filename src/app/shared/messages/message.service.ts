import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';       
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { SuccessModalComponent } from './success-modal/success-modal.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  bsModalRef!: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  success(message: string, title: string, callback?: (result: boolean) => any){
    this.bsModalRef = this.modalService.show(SuccessModalComponent, {class: 'modal-md', ignoreBackdropClick: true});
    this.bsModalRef.content.config = {
      title : title,
      message : message
    }
    this.bsModalRef.content.onClose = (data: any) => {
      if(callback) callback(true);
    };
  }

  error(message: string, title?: string, callback?: (result: boolean) => any){
    this.bsModalRef = this.modalService.show(ErrorModalComponent, {class: 'modal-md', ignoreBackdropClick: true});
    this.bsModalRef.content.config = {
      title : title,
      message : message
    }
    this.bsModalRef.content.onClose = (data: any) => {
      if(callback)
        callback(data);
    };
  }

  confirm(message: string, title:string, callback: (result: boolean) => void){
    this.bsModalRef = this.modalService.show(ConfirmationModalComponent, {class: 'modal-md', ignoreBackdropClick: true});
    this.bsModalRef.content.config = {
      title : title,
      message : message,
      btnOkText:'OK',
      btnCancelText:'Cancel'
    }
    this.bsModalRef.content.onClose = (data: any) => {
      if(callback)
        callback(data);
    };
  }
}
