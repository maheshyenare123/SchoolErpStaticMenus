import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkEvaluationReportComponent } from './homework-evaluation-report.component';

describe('HomeworkEvaluationReportComponent', () => {
  let component: HomeworkEvaluationReportComponent;
  let fixture: ComponentFixture<HomeworkEvaluationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeworkEvaluationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkEvaluationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
