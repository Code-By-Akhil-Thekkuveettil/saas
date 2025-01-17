import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportQuestionPopupComponent } from './import-question-popup.component';

describe('ImportQuestionPopupComponent', () => {
  let component: ImportQuestionPopupComponent;
  let fixture: ComponentFixture<ImportQuestionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportQuestionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportQuestionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
