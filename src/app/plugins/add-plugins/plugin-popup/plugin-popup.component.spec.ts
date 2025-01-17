import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginPopupComponent } from './plugin-popup.component';

describe('PluginPopupComponent', () => {
  let component: PluginPopupComponent;
  let fixture: ComponentFixture<PluginPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
