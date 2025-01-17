import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscribeComponent } from './new-subscribe.component';

describe('NewSubscribeComponent', () => {
  let component: NewSubscribeComponent;
  let fixture: ComponentFixture<NewSubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubscribeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
