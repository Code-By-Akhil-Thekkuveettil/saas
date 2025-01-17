import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyQuestionActionComponent } from './survey-question-action.component';

describe('SurveyQuestionActionComponent', () => {
  let component: SurveyQuestionActionComponent;
  let fixture: ComponentFixture<SurveyQuestionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyQuestionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
