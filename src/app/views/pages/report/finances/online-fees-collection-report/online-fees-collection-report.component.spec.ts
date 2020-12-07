import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFeesCollectionReportComponent } from './online-fees-collection-report.component';

describe('OnlineFeesCollectionReportComponent', () => {
  let component: OnlineFeesCollectionReportComponent;
  let fixture: ComponentFixture<OnlineFeesCollectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineFeesCollectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineFeesCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
