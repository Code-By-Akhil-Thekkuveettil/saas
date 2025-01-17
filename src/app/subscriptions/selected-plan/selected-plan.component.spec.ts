import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPlanComponent } from './selected-plan.component';

describe('SelectedPlanComponent', () => {
  let component: SelectedPlanComponent;
  let fixture: ComponentFixture<SelectedPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
