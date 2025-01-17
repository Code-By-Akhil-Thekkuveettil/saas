import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewQuestionPopupComponent } from './preview-question-popup.component';

describe('PreviewQuestionPopupComponent', () => {
  let component: PreviewQuestionPopupComponent;
  let fixture: ComponentFixture<PreviewQuestionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewQuestionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewQuestionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
