import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionEnquiryListComponent } from "./admission-enquiry-list.component";

describe('AdmissionEnquiryListComponent', () => {
  let component: AdmissionEnquiryListComponent;
  let fixture: ComponentFixture<AdmissionEnquiryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmissionEnquiryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionEnquiryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
