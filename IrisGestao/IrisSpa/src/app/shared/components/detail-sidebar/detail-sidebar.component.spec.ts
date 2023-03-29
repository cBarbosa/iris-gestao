import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSidebarComponent } from './detail-sidebar.component';

describe('DetailSidebarComponent', () => {
  let component: DetailSidebarComponent;
  let fixture: ComponentFixture<DetailSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DetailSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
