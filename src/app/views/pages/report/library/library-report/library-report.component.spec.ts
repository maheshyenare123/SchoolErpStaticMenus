import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryReportComponent } from './library-report.component';

describe('LibraryReportComponent', () => {
  let component: LibraryReportComponent;
  let fixture: ComponentFixture<LibraryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
