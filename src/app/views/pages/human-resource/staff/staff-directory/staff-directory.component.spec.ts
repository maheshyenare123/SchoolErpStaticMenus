import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDirectoryComponent } from './staff-directory.component';

describe('StaffDirectoryComponent', () => {
  let component: StaffDirectoryComponent;
  let fixture: ComponentFixture<StaffDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
