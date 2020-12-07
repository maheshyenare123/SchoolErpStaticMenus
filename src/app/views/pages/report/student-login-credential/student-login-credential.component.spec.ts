import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoginCredentialComponent } from './student-login-credential.component';

describe('StudentLoginCredentialComponent', () => {
  let component: StudentLoginCredentialComponent;
  let fixture: ComponentFixture<StudentLoginCredentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLoginCredentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLoginCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
