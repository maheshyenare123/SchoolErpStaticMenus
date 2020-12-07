import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAttendanceTypeReportComponent } from './student-attendance-type-report.component';

describe('StudentAttendanceTypeReportComponent', () => {
  let component: StudentAttendanceTypeReportComponent;
  let fixture: ComponentFixture<StudentAttendanceTypeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentAttendanceTypeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAttendanceTypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
