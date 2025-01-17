import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceDisplayLogicComponent } from './choice-display-logic.component';

describe('ChoiceDisplayLogicComponent', () => {
  let component: ChoiceDisplayLogicComponent;
  let fixture: ComponentFixture<ChoiceDisplayLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoiceDisplayLogicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceDisplayLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
