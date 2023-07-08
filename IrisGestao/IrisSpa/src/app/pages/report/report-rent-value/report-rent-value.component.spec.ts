import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRentValueComponent } from './report-rent-value.component';

describe('ReportRentValueComponent', () => {
  let component: ReportRentValueComponent;
  let fixture: ComponentFixture<ReportRentValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRentValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportRentValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
