import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiblingReportComponent } from './sibling-report.component';

describe('SiblingReportComponent', () => {
  let component: SiblingReportComponent;
  let fixture: ComponentFixture<SiblingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiblingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiblingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
