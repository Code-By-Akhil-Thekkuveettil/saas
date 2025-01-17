import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyLinkComponent } from './survey-link.component';

describe('SurveyLinkComponent', () => {
  let component: SurveyLinkComponent;
  let fixture: ComponentFixture<SurveyLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
