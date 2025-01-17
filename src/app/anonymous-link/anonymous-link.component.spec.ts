import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousLinkComponent } from './anonymous-link.component';

describe('AnonymousLinkComponent', () => {
  let component: AnonymousLinkComponent;
  let fixture: ComponentFixture<AnonymousLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnonymousLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonymousLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
