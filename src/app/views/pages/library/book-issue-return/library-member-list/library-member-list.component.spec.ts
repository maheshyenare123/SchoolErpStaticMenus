import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryMemberListComponent } from './library-member-list.component';

describe('LibraryMemberListComponent', () => {
  let component: LibraryMemberListComponent;
  let fixture: ComponentFixture<LibraryMemberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryMemberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
