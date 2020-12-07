import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricAttendanceLogComponent } from './biometric-attendance-log.component';

describe('BiometricAttendanceLogComponent', () => {
  let component: BiometricAttendanceLogComponent;
  let fixture: ComponentFixture<BiometricAttendanceLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiometricAttendanceLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricAttendanceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
