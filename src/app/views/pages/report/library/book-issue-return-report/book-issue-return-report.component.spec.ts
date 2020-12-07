import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueReturnReportComponent } from './book-issue-return-report.component';

describe('BookIssueReturnReportComponent', () => {
  let component: BookIssueReturnReportComponent;
  let fixture: ComponentFixture<BookIssueReturnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookIssueReturnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookIssueReturnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
