import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassTimetableListComponent } from './class-timetable-list.component';

describe('ClassTimetableListComponent', () => {
  let component: ClassTimetableListComponent;
  let fixture: ComponentFixture<ClassTimetableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassTimetableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassTimetableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
