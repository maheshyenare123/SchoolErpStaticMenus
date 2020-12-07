import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianReportComponent } from './guardian-report.component';

describe('GuardianReportComponent', () => {
  let component: GuardianReportComponent;
  let fixture: ComponentFixture<GuardianReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardianReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardianReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
