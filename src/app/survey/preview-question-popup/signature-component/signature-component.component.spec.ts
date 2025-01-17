import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureComponentComponent } from './signature-component.component';

describe('SignatureComponentComponent', () => {
  let component: SignatureComponentComponent;
  let fixture: ComponentFixture<SignatureComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
