import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-box-type',
  templateUrl: './text-box-type.component.html',
  styleUrls: ['./text-box-type.component.css']
})
export class TextBoxTypeComponent implements OnInit {
  @Input() index: any;
  @Input() question: any;

  @Output() updateQuestion = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  update(question) {
    this.updateQuestion.emit(question)
  }
}
