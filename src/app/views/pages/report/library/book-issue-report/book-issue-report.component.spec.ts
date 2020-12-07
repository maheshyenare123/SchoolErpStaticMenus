import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookIssueReportComponent } from './book-issue-report.component';

describe('BookIssueReportComponent', () => {
  let component: BookIssueReportComponent;
  let fixture: ComponentFixture<BookIssueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookIssueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookIssueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
