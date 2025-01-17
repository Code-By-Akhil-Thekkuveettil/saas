import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewUserPopupComponent } from './create-new-user-popup.component';

describe('CreateNewUserPopupComponent', () => {
  let component: CreateNewUserPopupComponent;
  let fixture: ComponentFixture<CreateNewUserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewUserPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
