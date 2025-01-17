import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionJavascriptComponent } from './survey-question-javascript.component';

describe('SurveyQuestionJavascriptComponent', () => {
  let component: SurveyQuestionJavascriptComponent;
  let fixture: ComponentFixture<SurveyQuestionJavascriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyQuestionJavascriptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionJavascriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
