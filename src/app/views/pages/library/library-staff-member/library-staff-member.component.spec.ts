import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryStaffMemberComponent } from './library-staff-member.component';

describe('LibraryStaffMemberComponent', () => {
  let component: LibraryStaffMemberComponent;
  let fixture: ComponentFixture<LibraryStaffMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryStaffMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryStaffMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
