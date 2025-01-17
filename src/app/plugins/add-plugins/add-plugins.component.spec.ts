import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPluginsComponent } from './add-plugins.component';

describe('AddPluginsComponent', () => {
  let component: AddPluginsComponent;
  let fixture: ComponentFixture<AddPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPluginsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
