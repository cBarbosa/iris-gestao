import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSupplyContractsComponent } from './report-supply-contracts.component';

describe('ReportSupplyContractsComponent', () => {
  let component: ReportSupplyContractsComponent;
  let fixture: ComponentFixture<ReportSupplyContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSupplyContractsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSupplyContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
