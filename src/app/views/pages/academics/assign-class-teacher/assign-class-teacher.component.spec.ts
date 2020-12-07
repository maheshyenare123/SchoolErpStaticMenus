import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClassTeacherComponent } from './assign-class-teacher.component';

describe('AssignClassTeacherComponent', () => {
  let component: AssignClassTeacherComponent;
  let fixture: ComponentFixture<AssignClassTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignClassTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignClassTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
