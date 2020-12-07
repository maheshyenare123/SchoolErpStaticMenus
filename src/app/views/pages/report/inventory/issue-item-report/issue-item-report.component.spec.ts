import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueItemReportComponent } from './issue-item-report.component';

describe('IssueItemReportComponent', () => {
  let component: IssueItemReportComponent;
  let fixture: ComponentFixture<IssueItemReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueItemReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
