import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceTypeComponent } from './multiple-choice-type.component';

describe('MultipleChoiceTypeComponent', () => {
  let component: MultipleChoiceTypeComponent;
  let fixture: ComponentFixture<MultipleChoiceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleChoiceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
