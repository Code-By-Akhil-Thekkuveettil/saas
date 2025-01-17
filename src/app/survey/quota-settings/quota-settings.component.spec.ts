import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaSettingsComponent } from './quota-settings.component';

describe('QuotaSettingsComponent', () => {
  let component: QuotaSettingsComponent;
  let fixture: ComponentFixture<QuotaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
