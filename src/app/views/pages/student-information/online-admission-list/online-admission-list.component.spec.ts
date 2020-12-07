import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineAdmissionListComponent } from './online-admission-list.component';

describe('OnlineAdmissionListComponent', () => {
  let component: OnlineAdmissionListComponent;
  let fixture: ComponentFixture<OnlineAdmissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineAdmissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineAdmissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
