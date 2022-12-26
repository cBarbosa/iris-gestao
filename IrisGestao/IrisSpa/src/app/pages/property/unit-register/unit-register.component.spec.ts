import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitRegisterComponent } from './unit-register.component';

describe('UnitRegisterComponent', () => {
  let component: UnitRegisterComponent;
  let fixture: ComponentFixture<UnitRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
