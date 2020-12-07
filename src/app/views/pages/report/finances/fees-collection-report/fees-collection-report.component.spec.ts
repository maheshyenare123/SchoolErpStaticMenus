import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCollectionReportComponent } from './fees-collection-report.component';

describe('FeesCollectionReportComponent', () => {
  let component: FeesCollectionReportComponent;
  let fixture: ComponentFixture<FeesCollectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesCollectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
