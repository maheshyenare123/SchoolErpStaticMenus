import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledStaffComponent } from './disabled-staff.component';

describe('DisabledStaffComponent', () => {
  let component: DisabledStaffComponent;
  let fixture: ComponentFixture<DisabledStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
