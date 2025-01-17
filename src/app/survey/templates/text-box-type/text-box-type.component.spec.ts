import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxTypeComponent } from './text-box-type.component';

describe('TextBoxTypeComponent', () => {
  let component: TextBoxTypeComponent;
  let fixture: ComponentFixture<TextBoxTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextBoxTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextBoxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
