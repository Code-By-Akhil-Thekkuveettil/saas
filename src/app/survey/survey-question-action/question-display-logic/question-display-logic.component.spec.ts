import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDisplayLogicComponent } from './question-display-logic.component';

describe('QuestionDisplayLogicComponent', () => {
  let component: QuestionDisplayLogicComponent;
  let fixture: ComponentFixture<QuestionDisplayLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDisplayLogicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDisplayLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
