import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLeasedAreaComponent } from './report-leased-area.component';

describe('ReportLeasedAreaComponent', () => {
  let component: ReportLeasedAreaComponent;
  let fixture: ComponentFixture<ReportLeasedAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportLeasedAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLeasedAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
