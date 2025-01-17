import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelUnsubscribeComponent } from './panel-unsubscribe.component';

describe('PanelUnsubscribeComponent', () => {
  let component: PanelUnsubscribeComponent;
  let fixture: ComponentFixture<PanelUnsubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelUnsubscribeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
