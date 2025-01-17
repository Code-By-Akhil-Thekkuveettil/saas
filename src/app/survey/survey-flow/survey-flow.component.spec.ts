import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFlowComponent } from './survey-flow.component';

describe('SurveyFlowComponent', () => {
  let component: SurveyFlowComponent;
  let fixture: ComponentFixture<SurveyFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
