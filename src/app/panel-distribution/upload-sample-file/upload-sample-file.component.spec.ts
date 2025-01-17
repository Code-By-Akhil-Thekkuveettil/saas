import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSampleFileComponent } from './upload-sample-file.component';

describe('UploadSampleFileComponent', () => {
  let component: UploadSampleFileComponent;
  let fixture: ComponentFixture<UploadSampleFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSampleFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSampleFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
