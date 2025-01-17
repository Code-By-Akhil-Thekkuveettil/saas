import { Component, EventEmitter, OnInit, Output, Inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  @Output() upload = new EventEmitter();
  onClose: any;
  expNavbar: boolean = true;
  htmlContent: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: true,
  }

  constructor(
    private _mdr: MatDialogRef<TextEditorComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.htmlContent = this.data.content;
  }
  @HostListener('document:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    // Update the editor content here
    this.cdr.detectChanges();
  }
  @HostListener('document:cut', ['$event'])
  onCut(event: ClipboardEvent) {
    // Update the editor content here
    this.cdr.detectChanges();
  }

  onContentChange(event: any) {
    this.cdr.detectChanges();
  }
  expand(show: any) {
    this.expNavbar = show;
  }

  closeDialog() {
    this._mdr.close();
  }
  save() {
    this._mdr.close(this.htmlContent);
  }
}
