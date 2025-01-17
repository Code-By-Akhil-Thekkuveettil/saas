import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAddSkipLogicComponent } from './survey-add-skip-logic.component';

describe('SurveyAddSkipLogicComponent', () => {
  let component: SurveyAddSkipLogicComponent;
  let fixture: ComponentFixture<SurveyAddSkipLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyAddSkipLogicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyAddSkipLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
