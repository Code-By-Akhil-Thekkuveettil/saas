import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMediaTypeComponent } from './text-media-type.component';

describe('TextMediaTypeComponent', () => {
  let component: TextMediaTypeComponent;
  let fixture: ComponentFixture<TextMediaTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextMediaTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextMediaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
