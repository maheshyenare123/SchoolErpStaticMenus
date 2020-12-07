import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledStudentComponent } from './disabled-student.component';

describe('DisabledStudentComponent', () => {
  let component: DisabledStudentComponent;
  let fixture: ComponentFixture<DisabledStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
