import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReceiptsComponent } from './report-receipts.component';

describe('ReportReceiptsComponent', () => {
  let component: ReportReceiptsComponent;
  let fixture: ComponentFixture<ReportReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReceiptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
