import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyOptionEditComponent } from './survey-option-edit.component';

describe('SurveyOptionEditComponent', () => {
  let component: SurveyOptionEditComponent;
  let fixture: ComponentFixture<SurveyOptionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyOptionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyOptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
