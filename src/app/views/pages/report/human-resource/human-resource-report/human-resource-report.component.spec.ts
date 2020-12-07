import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanResourceReportComponent } from './human-resource-report.component';

describe('HumanResourceReportComponent', () => {
  let component: HumanResourceReportComponent;
  let fixture: ComponentFixture<HumanResourceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanResourceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanResourceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
