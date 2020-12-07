import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLeaveListComponent } from './approve-leave-list.component';

describe('ApproveLeaveListComponent', () => {
  let component: ApproveLeaveListComponent;
  let fixture: ComponentFixture<ApproveLeaveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveLeaveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
