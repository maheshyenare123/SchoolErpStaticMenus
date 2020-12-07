import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryStudentMemberComponent } from './library-student-member.component';

describe('LibraryStudentMemberComponent', () => {
  let component: LibraryStudentMemberComponent;
  let fixture: ComponentFixture<LibraryStudentMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryStudentMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryStudentMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
