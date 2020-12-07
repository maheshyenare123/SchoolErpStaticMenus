import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSmsLogComponent } from './email-sms-log.component';

describe('EmailSmsLogComponent', () => {
  let component: EmailSmsLogComponent;
  let fixture: ComponentFixture<EmailSmsLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSmsLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSmsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
