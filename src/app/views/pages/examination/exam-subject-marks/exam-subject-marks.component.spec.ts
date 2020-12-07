import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSubjectMarksComponent } from './exam-subject-marks.component';

describe('ExamSubjectMarksComponent', () => {
  let component: ExamSubjectMarksComponent;
  let fixture: ComponentFixture<ExamSubjectMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSubjectMarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSubjectMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
