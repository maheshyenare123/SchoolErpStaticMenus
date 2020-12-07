import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCallLogListComponent } from './phone-call-log-list.component';

describe('PhoneCallLogListComponent', () => {
  let component: PhoneCallLogListComponent;
  let fixture: ComponentFixture<PhoneCallLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneCallLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneCallLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
