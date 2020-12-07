import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseGroupReportComponent } from './expense-group-report.component';

describe('ExpenseGroupReportComponent', () => {
  let component: ExpenseGroupReportComponent;
  let fixture: ComponentFixture<ExpenseGroupReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGroupReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
