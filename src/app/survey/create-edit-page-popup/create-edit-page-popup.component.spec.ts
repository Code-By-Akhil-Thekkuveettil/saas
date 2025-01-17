import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPagePopupComponent } from './create-edit-page-popup.component';

describe('CreateEditPagePopupComponent', () => {
  let component: CreateEditPagePopupComponent;
  let fixture: ComponentFixture<CreateEditPagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditPagePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditPagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
