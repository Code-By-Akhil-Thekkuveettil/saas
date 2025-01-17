import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDistributionComponent } from './panel-distribution.component';

describe('PanelDistributionComponent', () => {
  let component: PanelDistributionComponent;
  let fixture: ComponentFixture<PanelDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
