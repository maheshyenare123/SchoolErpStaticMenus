import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceFeesReportComponent } from './balance-fees-report.component';

describe('BalanceFeesReportComponent', () => {
  let component: BalanceFeesReportComponent;
  let fixture: ComponentFixture<BalanceFeesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceFeesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceFeesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
