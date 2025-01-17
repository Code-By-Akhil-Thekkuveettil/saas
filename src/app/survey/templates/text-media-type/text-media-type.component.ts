import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-media-type',
  templateUrl: './text-media-type.component.html',
  styleUrls: ['./text-media-type.component.css']
})
export class TextMediaTypeComponent implements OnInit {

  @Input() index: any;
  @Input() question: any;

  @Output() updateQuestion = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  updateResponseStatusType(event: any, question: any) {
    question.response_status_code = event?.value;
    this.update(question);
  }
  update(question) {
    this.updateQuestion.emit(question)
  }
}
