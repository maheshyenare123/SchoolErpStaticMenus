import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDueReportComponent } from './book-due-report.component';

describe('BookDueReportComponent', () => {
  let component: BookDueReportComponent;
  let fixture: ComponentFixture<BookDueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
