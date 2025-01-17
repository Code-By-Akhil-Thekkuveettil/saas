import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSurveyQuestionsComponent } from './new-survey-questions.component';

describe('NewSurveyQuestionsComponent', () => {
  let component: NewSurveyQuestionsComponent;
  let fixture: ComponentFixture<NewSurveyQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSurveyQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSurveyQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
