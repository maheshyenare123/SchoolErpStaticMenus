import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollsReportComponent } from './payrolls-report.component';

describe('PayrollsReportComponent', () => {
  let component: PayrollsReportComponent;
  let fixture: ComponentFixture<PayrollsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
