import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectReportComponent } from './class-subject-report.component';

describe('ClassSubjectReportComponent', () => {
  let component: ClassSubjectReportComponent;
  let fixture: ComponentFixture<ClassSubjectReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSubjectReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSubjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
