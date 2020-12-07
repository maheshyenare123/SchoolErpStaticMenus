import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemReportComponent } from './add-item-report.component';

describe('AddItemReportComponent', () => {
  let component: AddItemReportComponent;
  let fixture: ComponentFixture<AddItemReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
