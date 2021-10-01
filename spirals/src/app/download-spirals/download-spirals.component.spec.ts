import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSpiralsComponent } from './download-spirals.component';

describe('DownloadSpiralsComponent', () => {
  let component: DownloadSpiralsComponent;
  let fixture: ComponentFixture<DownloadSpiralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadSpiralsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadSpiralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
