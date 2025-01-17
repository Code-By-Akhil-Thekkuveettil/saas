import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsGaComponent } from './add-details-ga.component';

describe('AddDetailsGaComponent', () => {
  let component: AddDetailsGaComponent;
  let fixture: ComponentFixture<AddDetailsGaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsGaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsGaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
