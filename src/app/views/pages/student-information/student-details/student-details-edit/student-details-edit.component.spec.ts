import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailsEditComponent } from './student-details-edit.component';

describe('StudentDetailsEditComponent', () => {
  let component: StudentDetailsEditComponent;
  let fixture: ComponentFixture<StudentDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
