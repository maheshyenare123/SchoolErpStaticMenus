import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeGroupReportComponent } from './income-group-report.component';

describe('IncomeGroupReportComponent', () => {
  let component: IncomeGroupReportComponent;
  let fixture: ComponentFixture<IncomeGroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeGroupReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
