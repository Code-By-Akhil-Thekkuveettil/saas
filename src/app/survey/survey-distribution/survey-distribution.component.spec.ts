import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDistributionComponent } from './survey-distribution.component';

describe('SurveyDistributionComponent', () => {
  let component: SurveyDistributionComponent;
  let fixture: ComponentFixture<SurveyDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
