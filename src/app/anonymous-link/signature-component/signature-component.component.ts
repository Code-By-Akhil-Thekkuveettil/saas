import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature-component',
  templateUrl: './signature-component.component.html',
  styleUrls: ['./signature-component.component.css']
})
export class SignatureComponentComponent implements OnInit {
  @ViewChild('sigPad', { static: true }) sigPad!: { nativeElement: any; };
  @Output() signature: EventEmitter<any> = new EventEmitter<any>();

  sigPadElement: any;
  context: any;
  isDrawing = false;
  isDrawn = false;
  @Input() name: any;

  constructor() {

  }
  ngOnInit() {
    this.sigPadElement = this.sigPad.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#3742fa';
    this.context.font = "1.8em 'Gigi', cursive";
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e: any) {
    this.isDrawing = false;
  }

  onMouseDown(e: any) {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
    this.save();
  }

  onMouseMove(e: any) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.stroke();
      this.isDrawn = true;
      this.save();
    }
  }

  private relativeCoords(event: { target: { getBoundingClientRect: () => any; }; clientX: number; clientY: number; }) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }
  clear() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
    this.signature.emit({ name: this.name, signature_file: null })
  }
  save() {
    const getDataPart = this.sigPadElement.toDataURL("image/png")?.split(',', 2)[1];
    this.signature.emit({ name: this.name, signature_file: getDataPart })
  }
}
