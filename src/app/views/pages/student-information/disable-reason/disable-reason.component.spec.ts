import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisableReasonComponent } from './disable-reason.component';

describe('DisableReasonComponent', () => {
  let component: DisableReasonComponent;
  let fixture: ComponentFixture<DisableReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisableReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisableReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
