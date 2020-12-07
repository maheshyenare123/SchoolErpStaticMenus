import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesReminderComponent } from './fees-reminder.component';

describe('FeesReminderComponent', () => {
  let component: FeesReminderComponent;
  let fixture: ComponentFixture<FeesReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
