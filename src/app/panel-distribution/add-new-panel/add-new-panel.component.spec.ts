import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPanelComponent } from './add-new-panel.component';

describe('AddNewPanelComponent', () => {
  let component: AddNewPanelComponent;
  let fixture: ComponentFixture<AddNewPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
