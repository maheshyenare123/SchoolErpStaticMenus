import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookInventoryReportComponent } from './book-inventory-report.component';

describe('BookInventoryReportComponent', () => {
  let component: BookInventoryReportComponent;
  let fixture: ComponentFixture<BookInventoryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookInventoryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
