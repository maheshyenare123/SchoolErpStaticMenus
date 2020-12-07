import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHouseComponent } from './student-house.component';

describe('StudentHouseComponent', () => {
  let component: StudentHouseComponent;
  let fixture: ComponentFixture<StudentHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
