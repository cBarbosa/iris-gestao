import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDimobComponent } from './report-dimob.component';

describe('ReportDimobComponent', () => {
  let component: ReportDimobComponent;
  let fixture: ComponentFixture<ReportDimobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDimobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDimobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
